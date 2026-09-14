"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { SignInFormType, signInSchema } from "@/src/shared/lib/zodSchema"
import { Button } from "@/src/shared/components/ui/button"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/src/shared/components/ui/field"
import { Input } from "@/src/shared/components/ui/input"

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [signInError, setSignInError] = useState<string | null>(null)

  const form = useForm<SignInFormType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (data: SignInFormType) => {
    setSignInError(null)

    const res = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: true,
      callbackUrl:"/dashboard"
    })

    if (!res?.ok) {
      // Keep the message generic so the provider's internals are never leaked.
      setSignInError(
        res?.error
          ? "Invalid username or password."
          : "Unable to sign in right now. Please try again."
      )
      return
    }

    toast.success("Welcome back!")
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      {signInError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-md border border-destructive/30 bg-destructive/5 px-3.5 py-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{signInError}</span>
        </div>
      )}

      <Controller
        name="username"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              id="username"
              autoComplete="username"
              className="h-11 px-3.5 text-sm"
              type="text"
              placeholder="Your username"
              aria-invalid={fieldState.invalid}
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <div className="relative">
              <Input
                id="password"
                autoComplete="current-password"
                className="h-11 pr-10 pl-3.5 text-sm"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                aria-invalid={fieldState.invalid}
                {...field}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button
        type="submit"
        className="h-11 w-full"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  )
}

export default LoginForm