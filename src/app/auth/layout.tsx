import React from "react"
import { BadgeCheck, GraduationCap, TimerReset } from "lucide-react"
import LogoApp from "@/src/shared/components/icons/Logo"
import { ThemeToggle } from "@/src/shared/components/ui/theme-toggle"

const features = [
  {
    icon: GraduationCap,
    title: "Diploma tracks",
    desc: "Focused paths — Frontend, Backend, Mobile — built around the skills you want to prove.",
  },
  {
    icon: TimerReset,
    title: "Timed exams",
    desc: "Real countdowns on every exam. When time is up, the exam submits itself.",
  },
  {
    icon: BadgeCheck,
    title: "Instant results",
    desc: "A clear score and a question-by-question breakdown the moment you finish.",
  },
]

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-dvh bg-background lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-14 text-sidebar-foreground lg:flex">
        {/* Soft clay glow — kept subtle and static, no glassmorphism */}
        <div
          aria-hidden
          className="absolute -top-40 -right-32 size-96 rounded-full bg-[radial-gradient(circle,rgba(196,119,72,0.28),transparent_65%)]"
        />
        <div
          aria-hidden
          className="absolute -bottom-48 -left-40 size-96 rounded-full bg-[radial-gradient(circle,rgba(196,119,72,0.18),transparent_65%)]"
        />

        <div className="relative">
          <LogoApp onDark />
        </div>

        <div className="relative max-w-md space-y-10">
          <span className="inline-flex w-fit items-center rounded-full border border-sidebar-primary/30 bg-sidebar-primary/10 px-3 py-1 text-xs font-medium text-sidebar-primary">
            Diploma-based exam platform
          </span>

          <h2 className="text-4xl leading-tight font-semibold tracking-tight">
            Elevate your learning journey with our smart exam platform.
          </h2>

          <ul className="space-y-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-sidebar-primary/15 text-sidebar-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-sidebar-foreground/65">
                    {desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center gap-4">
          <span className="h-px flex-1 bg-sidebar-border" />
          <p className="text-sm whitespace-nowrap text-sidebar-foreground/45">
            Your progress, exams, and diplomas in one place.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-12">
        <ThemeToggle className="absolute top-4 right-4 text-muted-foreground hover:bg-muted hover:text-foreground" />
        <div className="mb-10 lg:hidden">
          <LogoApp />
        </div>
        <div className="w-full max-w-md rounded-xl bg-card p-6 ring-1 ring-foreground/10 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}

export default layout