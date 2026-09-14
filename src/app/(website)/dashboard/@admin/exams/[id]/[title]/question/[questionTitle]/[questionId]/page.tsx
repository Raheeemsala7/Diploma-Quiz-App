import { getSingleQuestionApi } from '@/src/features/questions/apis/question.api'
import { Button, buttonVariants } from '@/src/shared/components/ui/button'
import { cn } from '@/src/shared/lib/utils'
import { Ban, ExternalLink, PenLine, Trash2 } from 'lucide-react'
import Link from 'next/link'
import slugify from 'slugify'


const page = async ({ params }: {
    params: Promise<{
        id: string;
        title: string;
        questionTitle: string
        questionId: string;
    }>
}) => {

    const { questionTitle, questionId, title, id } = await params

    const questionInfo = await getSingleQuestionApi(questionId)

    return (
        <div className="space-y-4">
            <div className='flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:flex-row md:items-center md:justify-between'>
                <div>
                    <h5 className='text-lg font-semibold tracking-tight text-foreground'>{questionTitle.split("-").join(" ")}</h5>
                    <p className='mt-1 flex items-center gap-1 text-sm text-muted-foreground'>
                        Exam :{" "}
                        <Link className="flex items-center gap-1 text-primary underline underline-offset-4" href={`/exams/${id}/${title}`}>
                            {title}
                            <ExternalLink size={14} />
                        </Link>
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="outline" className="gap-2.5">
                        <Ban />
                        Immutable
                    </Button>
                    <Link className={cn(buttonVariants(), "gap-2.5")}
                        href={`/exams/${id}/${slugify(title, { lower: false })}/question/${slugify(questionTitle, { lower: false })}/${questionId}/edit`}
                    >
                        <PenLine />
                        Edit
                    </Link>
                    <Button variant="destructive" className="gap-2.5">
                        <Trash2 />
                        Delete
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border border-border bg-card">
                <div className="space-y-4 p-5">
                    <div>
                        <p className='mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase'>Headline</p>
                        <h6 className='font-medium text-foreground'>{questionInfo.question.text}</h6>
                    </div>
                    <div>
                        <p className='mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase'>Exam</p>
                        <p className='text-sm text-foreground'>{questionInfo.question.exam.title}</p>
                    </div>
                    <div>
                        <p className='mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase'>Answers</p>
                        <div className="divide-y divide-border rounded-lg border border-border">
                            {questionInfo.question.answers.length === 0 && (
                                <p className="p-3 text-sm text-muted-foreground">No answers</p>
                            )}
                            {questionInfo.question.answers.map((answer) => (
                                <div key={answer.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                                    <p className="text-sm text-foreground">{answer.text}</p>
                                    {answer.isCorrect && (
                                        <span className="rounded-md bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                                            Correct
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page