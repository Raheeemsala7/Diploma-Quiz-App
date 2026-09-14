import React from "react"
import { BookOpenCheck, Brain, RectangleEllipsis } from "lucide-react"
import LogoApp from "@/src/shared/components/icons/Logo"

const features = [
  {
    icon: Brain,
    title: "Tailored Diplomas",
    desc: "Choose from specialized tracks like Frontend, Backend, and Mobile Development.",
  },
  {
    icon: BookOpenCheck,
    title: "Focused Exams",
    desc: "Access topic-specific tests including HTML, CSS, JavaScript, and more.",
  },
  {
    icon: RectangleEllipsis,
    title: "Smart Multi-Step Forms",
    desc: "A refined registration flow that keeps on-boarding clear and effortless.",
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

        <p className="relative text-sm text-sidebar-foreground/45">
          Your progress, exams, and diplomas in one place.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
        <div className="mb-10 lg:hidden">
          <LogoApp />
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}

export default layout