"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  EllipsisIcon,
  GraduationCap,
  BookOpenCheck,
  ScrollText,
  UserRound,
  Bolt,
} from "lucide-react"
import { cn } from "@/src/shared/lib/utils"
import { IUser } from "@/src/features/auth/types/user"
import {
  Avatar,
  AvatarFallback,
} from "@/src/shared/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/shared/components/ui/dropdown-menu"
import SignOutButton from "@/src/shared/components/signOutButton"

interface SidebarNavProps {
  user?: IUser
  isAdmin: boolean
}

const navItems = (isAdmin: boolean) =>
  [
    { href: "/", label: "Diploma", icon: GraduationCap, match: "exact" as const },
    ...(isAdmin
      ? [
          { href: "/exams", label: "Exams", icon: BookOpenCheck, match: "prefix" as const },
          { href: "/audit-log", label: "Audit Log", icon: ScrollText, match: "prefix" as const },
        ]
      : []),
    { href: "/account", label: "Account", icon: UserRound, match: "prefix" as const },
  ]

export function SidebarNav({ user, isAdmin }: SidebarNavProps) {
  const pathname = usePathname()

  const isActive = (href: string, match: "exact" | "prefix") =>
    match === "exact" ? pathname === href : pathname.startsWith(href)

  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toLocaleUpperCase() ||
    "U"

  return (
    <div className="flex h-full min-h-0 flex-col gap-8">
      <nav className="space-y-1" aria-label="Main navigation">
        <p className="px-3 text-xs font-medium tracking-widest text-sidebar-foreground/45 uppercase">
          Browse
        </p>
        {navItems(isAdmin).map(({ href, label, icon: Icon, match }) => {
          const active = isActive(href, match)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-5 shrink-0" />
              <span className="truncate">{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-sidebar-border pt-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none"
            >
              <Avatar size="sm">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="grid min-w-0 flex-1">
                <span className="truncate text-sm font-medium text-sidebar-foreground">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="truncate text-xs text-sidebar-foreground/55">
                  {user?.email}
                </span>
              </span>
              <EllipsisIcon className="size-4 shrink-0 text-sidebar-foreground/55" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            side="right"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex items-center gap-2 p-3" asChild>
                <Link href="/account">
                  <UserRound />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 p-3" asChild>
                <Link href="/">
                  <Bolt />
                  Dashboard
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <SignOutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}