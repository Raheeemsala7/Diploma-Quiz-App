"use client"


import React, { useEffect } from 'react'
import { useGetQuestions } from '../hooks/use-question'
import { Loader2, Plus } from 'lucide-react'
import { ExamQuestion, IQueItem } from '../types/questions'
import { Button } from '@/src/shared/components/ui/button'
import { Label } from '@/src/shared/components/ui/label'
import { Input } from '@/src/shared/components/ui/input'
import { cn } from '@/src/shared/lib/utils'

interface IProps {
    id: string
    multiQuestion: IQueItem[]
    setMultiQuestion: React.Dispatch<
        React.SetStateAction<IQueItem[]>
    >
    singleQuestion: ExamQuestion
    setSingleQuestion: (question: ExamQuestion) => void
    setOriginalQuestions: (
        questions: IQueItem[]
    ) => void
}
const QuestionBulkMode = ({ id, multiQuestion, setMultiQuestion, singleQuestion, setSingleQuestion, setOriginalQuestions }: IProps) => {


    const { data: questions, isLoading, isError, error } = useGetQuestions({ examId: id })


    useEffect(() => {
        if (questions?.status) {
            setMultiQuestion(questions.payload.questions)
            setOriginalQuestions(questions.payload.questions)

            if (questions.payload.questions.length > 0) {
                setSingleQuestion({
                    id: questions.payload.questions[0].id,
                    text: questions.payload.questions[0].text,
                    examId : id,
                    immutable: false,
                    answers: questions.payload.questions[0].answers
                })
            }

        }

       
    }, [questions, setMultiQuestion, setSingleQuestion, setOriginalQuestions, id])




    if (isLoading) {
        return (
            <div className='flex items-center gap-2 p-4 text-sm text-muted-foreground'>
                <Loader2 className='size-4 animate-spin' />
                Loading questions...
            </div>
        )
    }

    if (isError) {
        return (
            <div className='rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive'>
                {(error as Error).message || "Failed to load questions"}
            </div>
        )
    }


    return (
        <div className='space-y-4'>
            <div className='flex flex-wrap items-center gap-2'>
                <div className="flex flex-1 flex-wrap overflow-hidden rounded-lg border border-border">
                    {multiQuestion.map((que, index) => (
                        <button
                            key={que.id}
                            type="button"
                            className={cn(
                                'min-w-12 border-r border-border bg-muted/40 px-4 py-2.5 text-center text-sm font-medium transition-colors last:border-r-0',
                                singleQuestion.id === que.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted'
                            )}
                            onClick={() => {
                                setSingleQuestion({
                                    id: que.id,
                                    text: que.text,
                                    examId: id,
                                    immutable: false,
                                    answers: que.answers,
                                    isNew: true
                                })
                            }}
                        >
                            Q{index + 1}
                        </button>
                    ))}
                </div>
                <Button size={"icon"} variant="outline" onClick={() => {
                    const newQuestion: ExamQuestion = {
                        id: Date.now().toString(),
                        text: '',
                        answers: [],
                        examId: id,
                        immutable: false,
                        isNew: true,
                    }

                    setSingleQuestion(newQuestion)
                    setMultiQuestion([...multiQuestion, newQuestion])
                }} aria-label="Add new question">
                    <Plus />
                </Button>


            </div>
            <div className='space-y-2'>
                <Label>Question Headline</Label>
                <Input value={singleQuestion.text} placeholder="Write the question here"
                    onChange={(e) => {
                        const updated = {
                            ...singleQuestion,
                            text: e.target.value,
                        }

                        setSingleQuestion(updated)

                        setMultiQuestion((prev: IQueItem[]) =>
                            prev.map((q) =>
                                q.id === updated.id
                                    ? { ...q, text: updated.text }
                                    : q
                            )
                        )
                    }}
                />
            </div>
        </div>
    )
}

export default QuestionBulkMode