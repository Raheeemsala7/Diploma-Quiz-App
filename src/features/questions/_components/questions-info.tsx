"use client"
import { Button, buttonVariants } from '@/src/shared/components/ui/button'
import { Input } from '@/src/shared/components/ui/input'
import { Label } from '@/src/shared/components/ui/label'
import { cn } from '@/src/shared/lib/utils'
import { CheckCheck, CheckIcon, CopyPlus, Loader2, Plus, SaveIcon, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Answer, ExamQuestion, IQueItem } from '../types/questions'
import { ExamsCombobox } from './ExamsCombobox'
import { useCreateMultiBulkQuestion, useCreateSingleQuestion, useUpdateSingleQuestion } from '../hooks/use-question'
import { toast } from 'sonner'
import QuestionBulkMode from './questionBulkMode'


const QuestionsInfo = ({ id, diplomaId }: { id: string, diplomaId: string }) => {
    const [bulkMode, setBulkMode] = useState(false)
    const [singleQuestion, setSingleQuestion] = useState<ExamQuestion>({
        id: "",
        text: '',
        examId: id,
        immutable: false,
        answers: [],
        isNew: true,
    })
    const [newAnswerText, setNewAnswerText] = useState('')
    const [showNewAnswerInput, setShowNewAnswerInput] = useState(false)
    const [selectExamId, setSelectExamId] = useState<string>(id || "");
    const { mutateAsync: createSingleQuestion, isPending: isSinglePending } = useCreateSingleQuestion()
    const { mutateAsync: createBulkQuestion, isPending: isBulkQuestionPending } = useCreateMultiBulkQuestion()
    const { mutateAsync: updateSingleQuestion, isPending: isUpdateQuestionPending } = useUpdateSingleQuestion()

    const [multiQuestion, setMultiQuestion] = useState<IQueItem[]>([])
    const [originalQuestions, setOriginalQuestions] =
        useState<IQueItem[]>([])


    const handleAddAnswer = () => {
        if (newAnswerText.trim() === "")
            return

        const newAnswer: Answer = {
            id: Date.now().toString(),
            text: newAnswerText,
            isCorrect: false,
        }

        const updatedQuestion = {
            ...singleQuestion,
            examId: id,
            immutable: false,
            answers: [
                ...singleQuestion.answers,
                newAnswer,
            ],
        }

        setSingleQuestion(updatedQuestion)

        if (bulkMode) {
            setMultiQuestion((prev) =>
                prev.map((q) =>
                    q.id === updatedQuestion.id
                        ? updatedQuestion
                        : q
                )
            )
        }

        setNewAnswerText("")
        setShowNewAnswerInput(false)
    }

 const handleRemoveAnswer = (answerId: string) => {

    const updatedQuestion = {
        ...singleQuestion,
        answers: singleQuestion.answers.filter(
            (a) => a.id !== answerId
        ),
    }

    setSingleQuestion(updatedQuestion)

    if (bulkMode) {
        setMultiQuestion((prev) =>
            prev.map((q) =>
                q.id === updatedQuestion.id
                    ? updatedQuestion
                    : q
            )
        )
    }
}
const handleMarkCorrect = (answerId: string) => {

    const updatedQuestion = {
        ...singleQuestion,
        answers: singleQuestion.answers.map((a) => ({
            ...a,
            isCorrect: a.id === answerId,
        })),
    }

    setSingleQuestion(updatedQuestion)

    if (bulkMode) {
        setMultiQuestion((prev) =>
            prev.map((q) =>
                q.id === updatedQuestion.id
                    ? updatedQuestion
                    : q
            )
        )
    }
}
    const hasCorrectAnswer = singleQuestion.answers.some((a) => a.isCorrect)
    const canAddMore = singleQuestion.answers.length < 4

    const handleSaveQuestions = async () => {
        // SINGLE MODE
       if (!bulkMode) {
            // SINGLE MODE (CREATE OR UPDATE)
            if (singleQuestion.text.trim() === "") {
                toast.error("Please enter question headline")
                return
            }

            if (!hasCorrectAnswer) {
                toast.error("Please select a correct answer")
                return
            }

            if (singleQuestion.answers.length < 2) {
                toast.error("Please add more answers")
                return
            }

            // لو مفيش ID → CREATE
            if (singleQuestion.isNew) {
                await createSingleQuestion({
                    values: {
                        text: singleQuestion.text,
                        answers: singleQuestion.answers.map(a => ({
                            text: a.text,
                            isCorrect: a.isCorrect,
                        })),
                    },
                    examId: id,
                })

                toast.success("Question created successfully")
            } 
            // لو فيه ID → UPDATE
            else {
                await updateSingleQuestion({
                    id: singleQuestion.id,
                    values: {
                        text: singleQuestion.text,
                        answers: singleQuestion.answers.map(a => ({
                            text: a.text,
                            isCorrect: a.isCorrect,
                        })),
                    },
                })

                toast.success("Question updated successfully")
            }

            return
        }


        // BULK MODE
        try {
            // NEW QUESTIONS
            const newQuestions =
                multiQuestion.filter(
                    (q) => q.isNew
                )

            // EXISTING QUESTIONS
            const existingQuestions =
                multiQuestion.filter(
                    (q) => !q.isNew
                )

            // UPDATED QUESTIONS ONLY
            const updatedQuestions =
                existingQuestions.filter((q) => {

                    const original =
                        originalQuestions.find(
                            (o) => o.id === q.id
                        )

                    if (!original) {
                        return false
                    }

                    return (
                        original.text !== q.text ||

                        JSON.stringify(
                            original.answers
                        ) !==
                        JSON.stringify(
                            q.answers
                        )
                    )
                })

            // =========================
            // SINGLE CREATE
            // =========================

            if (newQuestions.length === 1) {

                await createSingleQuestion({
                    values: {
                        text:
                            newQuestions[0].text,
                        answers:
                            newQuestions[0].answers.map(
                                (a) => ({
                                    text: a.text,
                                    isCorrect:
                                        a.isCorrect,
                                })
                            ),
                    },

                    examId: id,
                })
                toast.success(
                    "Question created successfully"
                )
            }

            // ** BULK CREATE

            if (newQuestions.length > 1) {
                const payloadBulk = newQuestions.map((q) => ({
                    text: q.text,
                    answers:
                        q.answers.map(
                            (a) => ({
                                text: a.text,
                                isCorrect:
                                    a.isCorrect,
                            })
                        ),
                }))
                await createBulkQuestion({
                    values: {
                        questions : payloadBulk
                    },
                    id
                })

                toast.success(
                    "Bulk questions created"
                )
            }

            // UPDATE QUESTIONS
            if (updatedQuestions.length > 0) {

                await Promise.all(

                    updatedQuestions.map(
                        async (question) => {

                            await updateSingleQuestion({
                                id: question.id,

                                values : {
                                    text: question.text,
                                    answers: question.answers.map((a) => ({
                                        text: a.text,
                                        isCorrect: a.isCorrect,
                                    })),
                                }
                            })
                        }
                    )
                )

                toast.success(
                    "Questions updated"
                )
            }

        } catch {
            toast.error(
                "Something went wrong"
            )
        }



    }


    return (
        <div className="space-y-6">
            <div className='flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:flex-row md:items-center md:justify-between'>
                <Button
                    onClick={() => setBulkMode(!bulkMode)}
                    variant={bulkMode ? "default" : "outline"}
                    className="w-fit gap-2.5"
                >
                    <CopyPlus size={18} />
                    {bulkMode ? "Exit Bulk Mode" : "Bulk Add Mode"}
                </Button>

                <div className="flex gap-3">
                    <Link href={"/"} className={cn(buttonVariants({ variant: "outline" }))}>
                        <X />
                        Cancel
                    </Link>

                    <Button
                        disabled={isSinglePending || isUpdateQuestionPending || isBulkQuestionPending}
                        onClick={handleSaveQuestions}
                        type='submit'
                    >
                        {isSinglePending || isUpdateQuestionPending || isBulkQuestionPending ? <>
                            <Loader2 className='size-4 animate-spin' />
                            Saving...
                        </> : <>
                            <SaveIcon />
                            Save
                        </>}
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border border-border bg-card">
                <div className="border-b border-border px-5 py-4">
                    <p className="font-medium">Exam Info</p>
                    <p className="text-sm text-muted-foreground">
                        Choose the exam this question belongs to.
                    </p>
                </div>
                <div className='space-y-4 p-5'>
                    <div className='space-y-2'>
                        <Label>Exam</Label>
                        <ExamsCombobox selectedId={selectExamId} diplomaId={diplomaId} onChange={setSelectExamId} />
                    </div>
                    {!bulkMode && (
                        <div className='space-y-2'>
                            <Label>Question Headline</Label>
                            <Input
                                value={singleQuestion.text}
                                onChange={(e) => setSingleQuestion({ ...singleQuestion, text: e.target.value })}
                                placeholder="Write the question here"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="rounded-lg border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                    <div>
                        <p className="font-medium">Answers</p>
                        <p className="text-sm text-muted-foreground">
                            Add up to 4 answers and mark the correct one.
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowNewAnswerInput(true)}
                        size="sm"
                        disabled={!canAddMore}
                        className="gap-1"
                    >
                        <Plus size={16} /> Add Answer
                    </Button>
                </div>

                <div className="p-5">
                    {bulkMode && (
                        <QuestionBulkMode id={id} multiQuestion={multiQuestion} setMultiQuestion={setMultiQuestion} singleQuestion={singleQuestion} setSingleQuestion={setSingleQuestion} setOriginalQuestions={setOriginalQuestions} />
                    )}

                    {!bulkMode && (
                        <div className="space-y-4">
                            <div className="divide-y divide-border rounded-lg border border-border">
                                {singleQuestion.answers.map((answer) => (
                                    <div
                                        key={answer.id}
                                        className="flex items-center justify-between gap-4 px-4 py-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Button
                                                size={"icon"}
                                                variant={"ghost"}
                                                onClick={() => handleRemoveAnswer(answer.id || "")}
                                                aria-label="Remove answer"
                                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                <Trash2 size={19} />
                                            </Button>

                                            <span className="text-sm text-foreground">{answer.text}</span>
                                        </div>

                                        <div>
                                            {answer.isCorrect ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-md bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                                                    <CheckCheck size={14} /> Correct Answer
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleMarkCorrect(answer.id || "")}
                                                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                                >
                                                    <CheckIcon size={14} />
                                                    Mark Correct
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {singleQuestion.answers.length === 0 && (
                                    <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                                        No answers yet. Click &quot;Add Answer&quot; to create one.
                                    </div>
                                )}
                            </div>

                            {showNewAnswerInput && (
                                <div className="flex items-center gap-3 rounded-lg border border-border bg-success/5 p-4">
                                    <button
                                        onClick={() => {
                                            setShowNewAnswerInput(false)
                                            setNewAnswerText('')
                                        }}
                                        className="grid size-7 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
                                        aria-label="Cancel adding answer"
                                    >
                                        <X size={20} />
                                    </button>
                                    <Input
                                        placeholder="Enter answer body"
                                        value={newAnswerText}
                                        onChange={(e) => setNewAnswerText(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleAddAnswer()
                                            }
                                        }}
                                        className="flex-1"
                                        autoFocus
                                    />
                                    <Button
                                        onClick={handleAddAnswer}
                                        disabled={newAnswerText.trim() === ''}
                                        className="shrink-0"
                                    >
                                        + Add
                                    </Button>
                                </div>
                            )}

                            {!showNewAnswerInput && !canAddMore && (
                                <p className="text-center text-sm text-muted-foreground">
                                    Maximum of 4 answers reached
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default QuestionsInfo