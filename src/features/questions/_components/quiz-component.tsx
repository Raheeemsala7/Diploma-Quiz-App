"use client"
import React, { useState } from 'react'
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

const QuizComponent = ({ questions, examInfo }: IProps) => {

    const total = questions.length;

    const [currentIndex, setCurrentIndex] = useState(0);
    const seconds = examInfo.exam.duration;
    const [showResult, setShowResult] = useState(false)

    const [submission, setSubmission] = useState<ISubmission>()
    const [questionAnalytics, setQuestionAnalytics] = useState<IQuestionAnalytics[]>()

    const startedAt = new Date().toISOString()

    const { mutateAsync, isPending } = useSubmissions()


    const currentQuestion = questions[currentIndex];


    const form = useForm<FormValues>({
        defaultValues: {
            answers: {},
        },
    });

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


    const buildSubmission = () => {
        const values = form.getValues();

        const answers = questions.map((q) => {
            const answerId = values.answers[q.id];

            return {
                questionId: q.id,
                ...(answerId != null && { answerId }),
            };
        });

        return {
            examId: examInfo.exam.id,
            startedAt,
            answers,
        };
    };


    const handleSubmitExam = async () => {
        const values = form.getValues();

        const unanswered = questions.some(
            (q) => !values.answers[q.id]
        );

        if (unanswered) {
            toast.error("لازم تجاوب كل الأسئلة");
            return;
        }

        const payload = buildSubmission();

        try {
            const data = await mutateAsync(payload)

            setSubmission(data.submission)
            setQuestionAnalytics(data.analytics)
            toast.success("done")

            if (data.analytics && data.submission) {
                setShowResult(true)
            }

        } catch (error) {
            setShowResult(false)

            const message =
                error instanceof Error ? error.message : "Something went wrong";
            toast.error(message);
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
                            total={seconds}
                            remaining={seconds}
                        />
                    </>
                )}
            </div>

            {!showResult ? <>
                <h2 className="text-xl font-semibold text-foreground">
                    {currentQuestion.text}
                </h2>

                <RadioGroup
                    value={selectedAnswer}
                    onValueChange={(value) =>
                        form.setValue(`answers.${currentQuestion.id}`, value)
                    }
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
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex((prev) => prev - 1)}
                        className='flex-1'
                    >
                        Previous
                    </Button>

                    <Button
                        onClick={handleNext}
                        disabled={!selectedAnswer || isPending}
                        className='flex-1'
                    >
                        {currentIndex === questions.length - 1 ? isPending ? <>
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