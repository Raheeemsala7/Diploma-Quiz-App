import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import ExamsList from "../../../../../../features/exams/_components/exams-list"

interface IPageProps {
  params: Promise<{
    id: string
    title: string
  }>
}

const Page = async ({ params }: IPageProps) => {
  const { id, title } = await params

  return (
    <section className="space-y-6">
      <header className="flex items-center gap-3">
        <Link
          href="/dashboard"
          aria-label="Back to diplomas"
          className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">Diploma</p>
          <h1 className="truncate text-2xl font-semibold tracking-tight">
            {title}
          </h1>
        </div>
      </header>
      <ExamsList id={id} />
    </section>
  )
}

export default Page