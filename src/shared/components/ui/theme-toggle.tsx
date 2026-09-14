"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "./button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"
import { cn } from "@/src/shared/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
    const { resolvedTheme, setTheme } = useTheme()

    // resolvedTheme follows the system preference until the user overrides it,
    // so the toggle always flips from the theme actually in effect.
    const isDark = resolvedTheme === "dark"
    const label = isDark ? "Switch to light mode" : "Switch to dark mode"

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label={label}
                        onClick={() => setTheme(isDark ? "light" : "dark")}
                        className={cn("rounded-full", className)}
                    >
                        <Sun className="size-4 dark:hidden" />
                        <Moon className="hidden size-4 dark:block" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{label}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}