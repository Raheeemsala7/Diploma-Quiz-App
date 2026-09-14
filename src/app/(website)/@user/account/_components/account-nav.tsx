"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CircleUser, Lock } from "lucide-react"
import { cn } from "@/src/shared/lib/utils"

const items = [
  { href: "/account", label: "Profile", icon: CircleUser },
  { href: "/account/change-password", label: "Change Password", icon: Lock },
]

export function AccountNav() {
  const pathname = usePathname()

  return (
    <nav className="h-fit rounded-lg border border-border bg-card p-1.5">
      <ul className="space-y-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/account"
              ? pathname === "/account"
              : pathname.startsWith(href)
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4.5" />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}