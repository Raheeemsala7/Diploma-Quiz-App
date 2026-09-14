import FormExam from '@/src/features/exams/_components/form-exam';
import { getExamById } from '@/src/features/exams/apis/exams.api';
import MenubarSortQuestion from '@/src/features/questions/_components/menubar-sort-questions';
import QuestionsList from '@/src/features/questions/_components/questions-list';
import { buttonVariants } from '@/src/shared/components/ui/button';
import { cn } from '@/src/shared/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React, { Suspense } from 'react'

interface IProps {
  params: Promise<{
    id: string;
    title: string;
  }>;
  searchParams: {
    search?: string;
    sortBy?: "title" | "createdAt";
    sortOrder?: "asc" | "desc";
  };
}

const page = async ({ params, searchParams }: IProps) => {

  const { id, title } = await params

  const data = await getExamById(id)

  const sp = await searchParams


  if (!data || !data.status) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-semibold">Exam not found</h2>
      </div>
    )
  }

  const exam = data.payload.exam
  return (
    <div className="space-y-4">
      <FormExam initialData={exam} isEdit={true} id={id} />

      <div className="rounded-lg border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-foreground">Exam Questions</p>
          <Link href={`/exams/${id}/add-question/${exam.diplomaId}`} className={cn(buttonVariants({ size: "sm" }), "gap-2")}>
            <Plus />
            Add Questions
          </Link>
        </div>
        <div className="flex items-center justify-between gap-4 border-b border-border bg-muted/40 px-4 py-2.5">
          <p className="text-sm font-medium text-muted-foreground">Title</p>
          <MenubarSortQuestion />
        </div>
        <Suspense fallback={<p className="p-4 text-sm text-muted-foreground">Loading...</p>}>
          <QuestionsList id={id} title={title} searchParams={sp} />
        </Suspense>
      </div>
    </div>
  )
}

export default page