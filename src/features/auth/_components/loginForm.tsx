"use client"
import { Field, FieldError, FieldLabel } from '@/src/shared/components/ui/field'
import { Input } from '@/src/shared/components/ui/input'
import { Button } from '@/src/shared/components/ui/button'
import { SignInFormType, signInSchema } from '@/src/shared/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

const LoginForm = () => {
    const form = useForm<SignInFormType>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = async (data: SignInFormType) => {
        const res = await signIn("credentials", {
            username: data.username,
            password: data.password,
            redirect: false
        })

        if (!res?.ok) {
            toast.error(res?.error || "Login failed")
            return
        }

        toast.success("Login successful")
        window.location.href = "/"
    }
    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel>
                            Username
                        </FieldLabel>
                        <Input
                            className="px-4 py-6 border-border"
                            type="text"
                            placeholder="Ahmed"
                            {...field}
                        />
                        {fieldState.invalid && (
                            <FieldError
                                errors={[fieldState.error]}
                            />
                        )}
                    </Field>
                )}
            />
            <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel>
                            Password
                        </FieldLabel>
                        <Input
                            className="px-4 py-6 border-border"
                            type="password"
                            placeholder="*********"
                            {...field}
                        />
                        {fieldState.invalid && (
                            <FieldError
                                errors={[fieldState.error]}
                            />
                        )}
                    </Field>
                )}
            />
            <Button type="submit">Login</Button>
        </form>
    )
}

export default LoginForm