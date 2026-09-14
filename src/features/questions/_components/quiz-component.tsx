"use client"
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IQueItem, IQuestionAnalytics, ISubmission } from '../types/questions';
import { IExamInfo } from '../../exams/types/exam';
import { Progress } from '@/src/shared/components/ui/progress';
import { TimerCircle } from './timer-component';
import { RadioGroup, RadioGroupItem } from '@/src/shared/components/ui/radio-group';
import { Button } from '@/src/shared/components/ui/button';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useSubmissions } from '../hooks/use-submissions';
import { Loader2 } from 'lucide-react';
import ResultView from './result-view';

interface IProps {
    questions: IQueItem[];
    examInfo: IExamInfo

}

type FormValues = {
    answers: Record<string, string>; // questionId -> answerId
};

type QuizSession = {
    startedAt: string;
    answers: Record<string, string>;
};

const getSessionKey = (examId: string) => `quiz-session:${examId}`;

const readSession = (examId: string): QuizSession | null => {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem(getSessionKey(examId));
        return raw ? (JSON.parse(raw) as QuizSession) : null;
    } catch {
        return null;
    }
};

const writeSession = (examId: string, session: QuizSession) => {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(getSessionKey(examId), JSON.stringify(session));
    } catch {
        // Storage can be unavailable (private mode / quota) — the exam still works in-memory.
    }
};

const clearSession = (examId: string) => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(getSessionKey(examId));
};

const QuizComponent = ({ questions, examInfo }: IProps) => {

    const total = questions.length;
    const examId = examInfo.exam.id;

    // duration is expressed in minutes by the backend.
    const durationSeconds = examInfo.exam.duration * 60;

    // Restore a started exam across refreshes/tab switches. When a fresh exam is
    // opened, startedAt is captured once here (stable for the whole attempt).
    const [initialSession] = useState<QuizSession>(() => readSession(examId) ?? {
        startedAt: new Date().toISOString(),
        answers: {},
    });

    const startedAt = initialSession.startedAt;

    // The countdown is derived from wall-clock timestamps (startedAt + duration),
    // so it stays correct across page refreshes, tab switches, throttled timers,
    // and client clock drift during the session.
    const endTimestamp = useMemo(
        () => new Date(startedAt).getTime() + durationSeconds * 1000,
        [startedAt, durationSeconds]
    );

    const [currentIndex, setCurrentIndex] = useState(0);
    const [showResult, setShowResult] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [remainingSeconds, setRemainingSeconds] = useState(() => durationSeconds);

    const [submission, setSubmission] = useState<ISubmission>()
    const [questionAnalytics, setQuestionAnalytics] = useState<IQuestionAnalytics[]>()

    const submittingRef = useRef(false);
    const submittedRef = useRef(false);

    const { mutateAsync } = useSubmissions()

    const currentQuestion = questions[currentIndex];

    const form = useForm<FormValues>({
        defaultValues: {
            answers: {},
        },
    });

    // Restore a previously saved session (answers) after hydration so the initial
    // server render and the restored state never mismatch.
    useEffect(() => {
        const stored = readSession(examId);

        if (!stored) {
            writeSession(examId, { startedAt, answers: {} });
            return;
        }

        if (Object.keys(stored.answers).length > 0) {
            form.reset({ answers: stored.answers });
        }
    }, [examId, startedAt, form]);

    const timersExpired = remainingSeconds <= 0;

    // Persist answers the moment they change so work survives refreshes.
    const handleAnswerSelect = (value: string) => {
        if (isSubmitting) return;

        const answers = {
            ...form.getValues("answers"),
            [currentQuestion.id]: value,
        };

        form.setValue(`answers.${currentQuestion.id}`, value);
        writeSession(examId, { startedAt, answers });
    };

    // Tick the remaining time from the real end timestamp.
    useEffect(() => {
        const updateRemaining = () =>
            setRemainingSeconds(
                Math.max(0, Math.floor((endTimestamp - Date.now()) / 1000))
            );

        updateRemaining();
        const timer = setInterval(updateRemaining, 1000);
        return () => clearInterval(timer);
    }, [endTimestamp]);

    const submitAnswers = useCallback(async (options?: { allowUnanswered?: boolean }) => {
        // Guard against manual + auto submit racing or double clicks.
        if (submittingRef.current || submittedRef.current) return;

        const values = form.getValues();

        // Existing business rule: manual submission requires every question answered.
        if (!options?.allowUnanswered && questions.some((q) => !values.answers[q.id])) {
            toast.error("لازم تجاوب كل الأسئلة");
            return;
        }

        submittingRef.current = true;
        setIsSubmitting(true);

        try {
            const payload = {
                examId,
                startedAt,
                answers: questions.map((q) => {
                    const answerId = values.answers[q.id];
                    return {
                        questionId: q.id,
                        ...(answerId != null ? { answerId } : {}),
                    };
                }),
            };

            const data = await mutateAsync(payload);

            submittedRef.current = true;
            clearSession(examId);
            setSubmission(data.submission)
            setQuestionAnalytics(data.analytics)
            setShowResult(true)
            toast.success("done")
        } catch (error) {
            setShowResult(false)

            const message =
                error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
        } finally {
            submittingRef.current = false;
            setIsSubmitting(false);
        }
    }, [examId, startedAt, form, questions, mutateAsync]);

    // When the countdown reaches zero, submit whatever has been answered, exactly
    // once, through the same flow used by the manual Submit button.
    useEffect(() => {
        if (showResult || submittedRef.current || submittingRef.current) return;
        if (!timersExpired) return;

        void submitAnswers({ allowUnanswered: true });
    }, [timersExpired, showResult, submitAnswers]);

    const handleSubmitExam = () => {
        // If the time already expired, submit as-is instead of blocking on the
        // "answer everything" rule.
        void submitAnswers({ allowUnanswered: timersExpired });
    };

    const selectedAnswer = form.watch(
        `answers.${currentQuestion.id}`
    );

    const handleNext = () => {
        if (!selectedAnswer) return;

        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            handleSubmitExam();
        }
    };

    const percentage = ((currentIndex + 1) / examInfo.exam.questionsCount) * 100;

    return (
        <div className='space-y-4 rounded-lg border border-border bg-card p-6'>
            <div className="flex items-center gap-6">
                <div className="flex-1 w-full space-y-1.5">
                    <div className="flex flex-wrap justify-between gap-2">
                        <h6 className="text-base font-semibold text-foreground">
                            {examInfo.exam.diploma.title} - {examInfo.exam.title}
                        </h6>
                        <p className='text-sm font-medium tabular-nums text-muted-foreground'>
                            Question {currentIndex + 1} of <span className='text-primary'>{total}</span>
                        </p>
                    </div>
                    <Progress value={percentage} />
                </div>
                {!showResult && (
                    <>
                        <div className="h-16 border-l border-border"></div>
                        <TimerCircle
                            total={durationSeconds}
                            remaining={remainingSeconds}
                        />
                    </>
                )}
            </div>

            {!showResult ? <>
                {isSubmitting && (
                    <div className="flex items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                        <Loader2 className='size-4 animate-spin text-primary' />
                        <p className="text-sm font-medium text-foreground">
                            {timersExpired
                                ? "Time is up — submitting your answers..."
                                : "Submitting your answers..."}
                        </p>
                    </div>
                )}

                <h2 className="text-xl font-semibold text-foreground">
                    {currentQuestion.text}
                </h2>

                <RadioGroup
                    value={selectedAnswer}
                    disabled={isSubmitting || timersExpired}
                    onValueChange={handleAnswerSelect}
                    className='gap-2.5'
                >
                    {currentQuestion.answers.map((answer) => (
                        <div key={answer.id} className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/30 px-4 transition-colors hover:bg-muted/60">
                            <RadioGroupItem value={answer.id} id={answer.id} />
                            <label className='flex-1 cursor-pointer py-4 text-sm text-foreground' htmlFor={answer.id}>{answer.text}</label>
                        </div>
                    ))}
                </RadioGroup>

                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        disabled={currentIndex === 0 || isSubmitting}
                        onClick={() => setCurrentIndex((prev) => prev - 1)}
                        className='flex-1'
                    >
                        Previous
                    </Button>

                    <Button
                        onClick={handleNext}
                        disabled={(!selectedAnswer && !timersExpired) || isSubmitting}
                        className='flex-1'
                    >
                        {currentIndex === questions.length - 1 ? isSubmitting ? <>
                            <span>Submitting...</span>
                            <Loader2 className='animate-spin' />
                        </> : "Submit" : "Next"}
                    </Button>
                </div>

            </> : <>

                <h2 className="text-xl font-semibold text-foreground">
                    Result
                </h2>

                <ResultView submission={submission!} analytics={questionAnalytics || []} />

            </>}
        </div>
    )
}

export default QuizComponent