"use client"
import { Button } from "@/src/shared/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/src/shared/components/ui/field";
import { Input } from "@/src/shared/components/ui/input";
import { register } from "@/src/features/auth/hooks/hooks";
import { createPasswordSchema, CreatePasswordType } from "@/src/shared/lib/zodSchema"
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner";

interface IProps {
    userInfo: {
        email?: string,
        phone: string,
        firstName: string,
        lastName: string,
        username: string,
    }
}

export default function Step4PasswordForm({
    userInfo,
}: IProps) {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const { mutateAsync: registerAsync, } = register();

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
        const { firstName, lastName, phone, username, email } = userInfo
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
            const message = error as Error
            toast.error(message.message || "Registration failed");
        }
    }

    return (
        <div>
            <h4 className="text-3xl font-bold my-4">Create Account</h4>

            <h4 className="text-[#155DFC] text-2xl mb-4 font-bold">Create a strong password</h4>

            <form onSubmit={formCreatePassword.handleSubmit(onSubmitCreatePassword)} className="space-y-4">
                {/* Password */}
                <Controller
                    name="password"
                    control={formCreatePassword.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel className="font-mono">
                                Password <span className="text-red-500">*</span>
                            </FieldLabel>

                            <div className="relative">
                                <Input
                                    className="rounded-sm px-4 py-6 pr-10 border border-[#E5E7EB] font-mono"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    {...field}
                                />

                                {/* Eye Icon */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? "🙈" : "👁"}
                                </button>
                            </div>

                            {fieldState.invalid && (
                                <FieldError
                                    className="text-red-500"
                                    errors={[fieldState.error]}
                                />
                            )}
                        </Field>
                    )}
                />

                {/* Confirm Password */}
                <Controller
                    name="confirmPassword"
                    control={formCreatePassword.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel className="font-mono">
                                Confirm Password <span className="text-red-500">*</span>
                            </FieldLabel>

                            <div className="relative">
                                <Input
                                    className="rounded-sm px-4 py-6 pr-10 border border-[#E5E7EB] font-mono"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    {...field}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showConfirmPassword ? "🙈" : "👁"}
                                </button>
                            </div>

                            {fieldState.invalid && (
                                <FieldError
                                    className="text-red-500"
                                    errors={[fieldState.error]}
                                />
                            )}
                        </Field>
                    )}
                />


                {/* Submit */}
                <Button
                    type="submit"
                    className="w-full bg-[#2563EB] text-white font-mono py-5 mt-5"
                // disabled={registerIsPending}
                >
                    {/* {registerIsPending ? "Registering..." : "Create Account"} */}
                    Create Account
                </Button>
            </form>
        </div>
    )
}

