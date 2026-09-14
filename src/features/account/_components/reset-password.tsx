"use client"
import { Button } from '@/src/shared/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/src/shared/components/ui/field'
import { Input } from '@/src/shared/components/ui/input'
import { Loader2Icon } from 'lucide-react';
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { resetPasswordSchema, ResetPasswordType } from '../schema/profile-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResetPassword } from '../hooks/use-account';
import { toast } from 'sonner';


const ResetPassword = () => {

    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState("")
    const { mutate, isPending } = useResetPassword()

    const form = useForm<ResetPasswordType>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            currentPassword: "",
            confirmPassword: ""
        }
    })

    const onSubmit = (values: ResetPasswordType) => {
        mutate({ newPassword: values.newPassword, confirmPassword: values.confirmPassword, currentPassword: values.currentPassword }, {
            onSuccess: () => {
                toast.success("Done Reset Password")
                setError("")
                form.reset({
                    newPassword: "",
                    currentPassword: "",
                    confirmPassword: ""
                })
            },
            onError(error) {
                toast.error(error.message || "Failed to reset password")
                setError(error.message || "Failed to reset password")
            },
        })
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Password */}
            <Controller
                name="currentPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel>
                            Current Password
                        </FieldLabel>

                        <div className="relative">
                            <Input
                                className="px-4 py-6 pr-10 border-border"
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                {...field}
                            />

                            {/* Eye Icon */}
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            >
                                {showCurrentPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        {fieldState.invalid && (
                            <FieldError
                                errors={[fieldState.error]}
                            />
                        )}
                    </Field>
                )}
            />
            <Controller
                name="newPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel>
                            New Password
                        </FieldLabel>

                        <div className="relative">
                            <Input
                                className="px-4 py-6 pr-10 border-border"
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                {...field}
                            />

                            {/* Eye Icon */}
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            >
                                {showCurrentPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        {fieldState.invalid && (
                            <FieldError
                                errors={[fieldState.error]}
                            />
                        )}
                    </Field>
                )}
            />

            {/* Confirm Password */}
            <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel>
                            Confirm New Password
                        </FieldLabel>

                        <div className="relative">
                            <Input
                                className="px-4 py-6 pr-10 border-border"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                {...field}
                            />

                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        {fieldState.invalid && (
                            <FieldError
                                errors={[fieldState.error]}
                            />
                        )}
                    </Field>
                )}
            />


            {/* Error */}
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
            </div>
            {/* Submit */}
            <Button
                type="submit"
                className="w-full mt-5"
                disabled={isPending}
            >
                {isPending ? <>
                    <Loader2Icon className='animate-spin' />
                    Update Password...
                </> : "update password"}

            </Button>
        </form>
    )
}

export default ResetPassword