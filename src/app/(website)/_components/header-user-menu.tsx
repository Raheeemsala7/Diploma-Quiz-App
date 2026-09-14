"use client"

import Link from "next/link"
import { ChevronDown, LayoutDashboard, UserRound } from "lucide-react"
import type { IUser } from "@/src/features/auth/types/user"
import { Avatar, AvatarFallback } from "@/src/shared/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/shared/components/ui/dropdown-menu"
import SignOutButton from "@/src/shared/components/signOutButton"

interface HeaderUserMenuProps {
  user: IUser
}

const getInitials = (user: IUser) =>
  `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toLocaleUpperCase() ||
  "U"

export function HeaderUserMenu({ user }: HeaderUserMenuProps) {
  const initials = getInitials(user)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Open menu for ${user.firstName ?? user.username}`}
          className="flex items-center gap-2.5 rounded-full py-1.5 pr-1 pl-1.5 transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-40 truncate text-sm font-medium sm:block">
            {user.firstName} {user.lastName}
          </span>
          <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="grid gap-0.5 p-4">
          <span className="truncate text-sm font-semibold">
            {user.firstName} {user.lastName}
          </span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2 p-3" asChild>
          <Link href="/dashboard">
            <LayoutDashboard />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 p-3" asChild>
          <Link href="/dashboard/account">
            <UserRound />
            Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}