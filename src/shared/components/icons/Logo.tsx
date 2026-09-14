import { GraduationCap } from "lucide-react"
import { cn } from "@/src/shared/lib/utils"

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Renders the wordmark for use on dark surfaces (sidebar, auth rail). */
  onDark?: boolean
}

function LogoApp({ onDark = false, className, ...props }: LogoProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5",
        onDark ? "text-sidebar-foreground" : "text-foreground",
        className
      )}
      {...props}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <GraduationCap className="size-5" aria-hidden />
      </span>
      <span className="text-lg leading-none font-semibold tracking-tight">
        Exam App
      </span>
    </div>
  )
}

export default LogoApp