import slugify from 'slugify'
import { getQuestionsApi } from '../apis/question.api'
import Link from 'next/link'
import { Ellipsis, Eye, Pencil, Trash2 } from 'lucide-react'
import { Menubar, MenubarContent, MenubarGroup, MenubarItem, MenubarMenu, MenubarTrigger } from '@/src/shared/components/ui/menubar'

interface IProps {
    id: string
    title: string;
    searchParams?: {
        search?: string;
        sortBy?: "title" | "createdAt";
        sortOrder?: "asc" | "desc";
    };
}

const QuestionsList = async ({ id, title, searchParams }: IProps) => {

    const questions = await getQuestionsApi(id, {
        search: searchParams?.search,
        sortBy: searchParams?.sortBy,
        sortOrder: searchParams?.sortOrder,
    })

    return (
        <div className="space-y-0 overflow-hidden rounded-lg border border-border bg-card">
            {questions.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No questions found.
                </div>
            )}
            {questions.map((que) => (
                <div className='flex items-center justify-between border-b border-border px-4 py-3 last:border-none' key={que.id}>
                    <p className='flex-1 truncate text-sm text-foreground'>{que.text}</p>

                    <Menubar>
                        <MenubarMenu>
                            <MenubarTrigger className="grid size-8 place-items-center rounded-md border border-border bg-muted/60 p-0 hover:bg-muted">
                                <Ellipsis />
                            </MenubarTrigger>

                            <MenubarContent>
                                <MenubarGroup>
                                    <MenubarItem asChild>
                                        <Link
                                            href={`/exams/${id}/${slugify(title, { lower: false })}/question/${slugify(que.text, { lower: false })}/${que.id}`}
                                            className="flex items-center gap-2"
                                        >
                                            <Eye className="h-4 w-4 text-success" />
                                            View
                                        </Link>
                                    </MenubarItem>

                                    <MenubarItem asChild>
                                        <Link
                                            href={`/exams/${id}/${slugify(title, { lower: false })}/question/${slugify(que.text, { lower: false })}/${que.id}/edit`}
                                            className="flex items-center gap-2"
                                        >
                                            <Pencil className="h-4 w-4 text-info" />
                                            Edit
                                        </Link>
                                    </MenubarItem>

                                    <MenubarItem className="flex items-center gap-2">
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                        Delete
                                    </MenubarItem>
                                </MenubarGroup>
                            </MenubarContent>
                        </MenubarMenu>
                    </Menubar>
                </div>
            ))}
        </div>
    )
}

export default QuestionsList