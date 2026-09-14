import ModelDeleteExam from '@/src/features/exams/_components/ModalDeleteExam';
import { getExamById } from '@/src/features/exams/apis/exams.api';
import MenubarSortQuestion from '@/src/features/questions/_components/menubar-sort-questions';
import QuestionsList from '@/src/features/questions/_components/questions-list';
import { Button, buttonVariants } from '@/src/shared/components/ui/button';
import { cn } from '@/src/shared/lib/utils';
import { Ban, PenLine, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import slugify from 'slugify'



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

  if (!data || !data.status){
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="font-semibold">Exam not found</h2>
    </div>
  )
}

  const exam = data.payload.exam

  return (
    <div className="space-y-4">
      <div className='flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:flex-row md:items-center md:justify-between'>
        <h5 className='text-lg font-semibold tracking-tight text-foreground'>{title.split("-").join(" ")}</h5>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="gap-2.5">
            <Ban />
            Immutable
          </Button>
          <Link className={cn(buttonVariants(), "gap-2.5")} href={`/exams/${exam.id}/${slugify(exam.title, { lower: false })}/edit`}>
            <PenLine />
            Edit
          </Link>
          <ModelDeleteExam id={id} />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="grid gap-6 p-5 md:grid-cols-[220px_1fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
            <Image src={exam.image} className='object-cover' fill alt={exam.title} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className='mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase'>Title</p>
              <h6 className='font-medium text-foreground'>{exam.title}</h6>
            </div>
            <div>
              <p className='mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase'>Diploma</p>
              <p className='text-sm text-foreground'>{exam.diploma.title}</p>
            </div>
            <div>
              <p className='mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase'>Duration</p>
              <p className='text-sm text-foreground'>{exam.duration} min</p>
            </div>
            <div>
              <p className='mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase'>No. of Questions</p>
              <p className='text-sm text-foreground'>{exam.questionsCount}</p>
            </div>
            <div className="sm:col-span-2">
              <p className='mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase'>Description</p>
              <p className='text-sm text-muted-foreground'>{exam.description}</p>
            </div>
          </div>
        </div>
      </div>

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