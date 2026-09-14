"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { register } from "@/src/features/auth/hooks/hooks";
import { createPasswordSchema, CreatePasswordType } from "@/src/shared/lib/zodSchema";
import { Button } from "@/src/shared/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/src/shared/components/ui/field";
import { Input } from "@/src/shared/components/ui/input";
import AuthHeading from "../../_components/auth-heading";

interface IProps {
    userInfo: {
        email?: string;
        phone: string;
        firstName: string;
        lastName: string;
        username: string;
    };
}

export default function Step4PasswordForm({
    userInfo,
}: IProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const { mutateAsync: registerAsync, isPending: registerIsPending } = register();

    const formCreatePassword = useForm<CreatePasswordType>({
        resolver: zodResolver(createPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
        shouldUnregister: false,
        mode: "onTouched",
    });

    async function onSubmitCreatePassword(data: CreatePasswordType) {
        const { firstName, lastName, phone, username, email } = userInfo;
        try {
            const res = await registerAsync({
                firstName,
                lastName,
                phone,
                username,
                email: email!,
                password: data.password,
                confirmPassword: data.confirmPassword,
            });

            router.push("/auth/login");
            toast.success(res.message || "Registration successful");
        } catch (error) {
            const message = error as Error;
            toast.error(message.message || "Registration failed");
        }
    }

    return (
        <div className="space-y-6">
            <AuthHeading
                title="Create a password"
                description="At least 8 characters with a letter, a number, and a symbol."
            />

            <form
                onSubmit={formCreatePassword.handleSubmit(onSubmitCreatePassword)}
                className="space-y-5"
            >
                <Controller
                    name="password"
                    control={formCreatePassword.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="password">
                                Password <span className="text-destructive">*</span>
                            </FieldLabel>
                            <div className="relative">
                                <Input
                                    id="password"
                                    autoComplete="new-password"
                                    className="h-11 pr-10 pl-3.5 text-sm"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
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
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="confirmPassword"
                    control={formCreatePassword.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="confirmPassword">
                                Confirm password <span className="text-destructive">*</span>
                            </FieldLabel>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    autoComplete="new-password"
                                    className="h-11 pr-10 pl-3.5 text-sm"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    aria-invalid={fieldState.invalid}
                                    {...field}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </button>
                            </div>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Button
                    type="submit"
                    className="h-11 w-full"
                    disabled={registerIsPending}
                >
                    {registerIsPending ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Creating account…
                        </>
                    ) : (
                        "Create account"
                    )}
                </Button>
            </form>
        </div>
    );
}