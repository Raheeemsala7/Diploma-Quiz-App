import DiplomasList from "@/src/features/diploma/_components/diplomas-list-infinite"
import { GraduationCap } from "lucide-react"

const userPage = () => {
  return (
    <main className="w-full space-y-6">
      <header
        id="diplomas"
        className="flex scroll-mt-24 items-center gap-4 rounded-lg border border-border bg-card p-5"
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <GraduationCap className="size-6" />
        </span>
        <div>
          <h4 className="text-xl font-semibold tracking-tight">Diplomas</h4>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Pick a track and start exploring your exams.
          </p>
        </div>
      </header>

      <DiplomasList />
    </main>
  )
}

export default userPage