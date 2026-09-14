import {
  BadgeCheck,
  CheckCheck,
  CheckCircle2,
  GraduationCap,
  History,
  TimerReset,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/src/shared/components/ui/button"
import { cn } from "@/src/shared/lib/utils"

const overview = [
  {
    icon: GraduationCap,
    title: "Diploma tracks",
    desc: "Frontend, Backend, and Mobile paths, each with its own set of focused exams.",
  },
  {
    icon: TimerReset,
    title: "Timed exams",
    desc: "Every exam runs on a real countdown and submits itself the moment time is up.",
  },
  {
    icon: BadgeCheck,
    title: "Instant results",
    desc: "See your score and a question-by-question review of right and wrong answers.",
  },
  {
    icon: History,
    title: "Audited by design",
    desc: "Admins author content with confidence — every change stays in the audit log.",
  },
]

const steps = [
  {
    step: "01",
    title: "Pick a diploma",
    desc: "Choose the track you want to master — Frontend, Backend, Mobile, and more.",
  },
  {
    step: "02",
    title: "Take a timed exam",
    desc: "Answer focused questions while the clock runs. The exam submits itself when time is up.",
  },
  {
    step: "03",
    title: "Review the result",
    desc: "Get an instant score with a clear breakdown of every answer, right after you finish.",
  },
]

/** Static preview that mirrors the real results screen (see features/questions/_components/result-view.tsx). */
function ExamResultPreview() {
  const questions = [
    {
      isCorrect: true,
      text: "Which method converts a string to an integer in JavaScript?",
      picked: "parseInt",
      answer: "parseInt",
    },
    {
      isCorrect: false,
      text: "What keyword declares a block-scoped variable?",
      picked: "var",
      answer: "let",
    },
    {
      isCorrect: false,
      text: "Which operator performs a strict equality check?",
      picked: "==",
      answer: "===",
    },
  ]

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Card header */}
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <p className="text-sm font-semibold">JavaScript — Exam 1</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Diploma in Frontend Development</p>
        </div>
        <span className="shrink-0 rounded-full border border-success/25 bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
          Completed
        </span>
      </div>

      {/* Score summary */}
      <div className="flex items-center gap-6 px-5 py-4">
        <div className="relative grid size-14 place-items-center">
          <svg viewBox="0 0 36 36" className="size-14 -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              strokeWidth="4"
              className="stroke-muted"
            />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              strokeWidth="4"
              pathLength={100}
              strokeDasharray="33 100"
              strokeLinecap="round"
              className="stroke-success"
            />
          </svg>
          <span className="absolute text-sm font-semibold tabular-nums">
            {Math.round((1 / 3) * 100)}%
          </span>
        </div>
        <div className="space-y-1.5">
          <p className="flex items-center gap-2 text-sm font-medium">
            <span className="size-2.5 rounded-full bg-success" />
            Correct: 1
          </p>
          <p className="flex items-center gap-2 text-sm font-medium">
            <span className="size-2.5 rounded-full bg-destructive" />
            Wrong: 2
          </p>
        </div>
      </div>

      {/* Question-by-question review */}
      <div className="space-y-3 border-t border-border px-5 py-4">
        {questions.map((q) => (
          <div key={q.text} className="space-y-2">
            <p className="flex items-start gap-2 text-sm font-medium">
              {q.isCorrect ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
              ) : (
                <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              )}
              {q.text}
            </p>
            <div
              className={cn(
                "ml-6 flex items-center justify-between gap-2.5 rounded-md border px-3 py-1.5 text-sm",
                q.isCorrect
                  ? "border-success/30 bg-success/5"
                  : "border-destructive/30 bg-destructive/5"
              )}
            >
              <span>{q.picked}</span>
              {!q.isCorrect && (
                <CheckCheck className="size-4 shrink-0 text-success" />
              )}
            </div>
            {!q.isCorrect && (
              <p className="ml-6 flex items-center gap-2 text-sm font-medium text-success">
                <span className="size-1.5 rounded-full bg-success" />
                {q.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const HomePage = () => {
  return (
    <div className="w-full space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-xl border border-border bg-card">
        {/* Soft clay glow, echoing the auth brand panel */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-24 size-96 rounded-full bg-[radial-gradient(circle,rgba(196,119,72,0.16),transparent_65%)]"
        />

        <div className="relative grid gap-12 px-6 py-14 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div className="space-y-8">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <GraduationCap className="size-3.5" />
              Diploma-based exam platform
            </span>

            <div className="space-y-4">
              <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                Prove your skills, exam by exam.
              </h1>
              <p className="max-w-lg leading-relaxed text-foreground/70">
                Exam App organizes learning into diploma tracks. Pick a track,
                take focused timed exams, and see your score with full answer
                review the moment you finish.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="#diplomas"
                className={cn(buttonVariants(), "h-11 px-5")}
              >
                Browse your diplomas
              </Link>
              <Link
                href="#how-it-works"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 px-5"
                )}
              >
                See how it works
              </Link>
            </div>
          </div>

          <ExamResultPreview />
        </div>
      </section>

      {/* Product overview */}
      <section className="space-y-8">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-medium tracking-widest text-primary uppercase">
            What you can do
          </p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            A complete path from practice to proof.
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Whether you are learning or authoring content, the platform keeps
            the flow simple: diplomas structure the learning, exams measure it,
            and results explain it.
          </p>
        </div>

        <div className="grid overflow-hidden rounded-xl border border-border bg-card sm:grid-cols-2">
          {overview.map(({ icon: Icon, title, desc }, index) => (
            <div
              key={title}
              className={cn(
                "border-border p-6",
                index % 2 === 0 && "sm:border-r",
                index >= 2 && "border-t"
              )}
            >
              <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 space-y-8">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-medium tracking-widest text-primary uppercase">
            How it works
          </p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            From first click to final result.
          </h2>
        </div>

        <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
          {steps.map(({ step, title, desc }) => (
            <div key={step} className="space-y-3">
              <p className="text-3xl font-semibold tracking-tight text-primary/60 tabular-nums">
                {step}
              </p>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden rounded-xl bg-sidebar px-6 py-12 text-center text-sidebar-foreground sm:px-12 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-24 size-80 rounded-full bg-[radial-gradient(circle,rgba(196,119,72,0.22),transparent_65%)]"
        />
        <div className="relative mx-auto max-w-xl space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            Your next diploma is one exam away.
          </h2>
          <p className="text-sm leading-relaxed text-sidebar-foreground/70 sm:text-base">
            Browse the catalog below, pick the track that fits your goals, and
            complete your first timed exam today.
          </p>
          <Link
            href="#diplomas"
            className={cn(
              buttonVariants(),
              "h-11 px-6 shadow-sm"
            )}
          >
            Start practicing
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage