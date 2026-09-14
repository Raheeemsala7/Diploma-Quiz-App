"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { sendEmailVerification, verifyCodeEmail } from "@/src/features/auth/hooks/hooks";
import {
    RegistrationFormStep1Type,
    RegistrationFormStep3Type,
    registrationStep1Schema,
    registrationStep3Schema,
} from "@/src/shared/lib/zodSchema";
import {
    Stepper,
    StepperIndicator,
    StepperItem,
    StepperNav,
    StepperSeparator,
    StepperTrigger,
} from "@/src/shared/components/reui/stepper";
import { Button } from "@/src/shared/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/src/shared/components/ui/field";
import { Input } from "@/src/shared/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/src/shared/components/ui/input-otp";
import AuthHeading from "../_components/auth-heading";
import CountryPhoneSelector from "./_components/country-phone-selector";
import Step4PasswordForm from "./_components/Step4PasswordForm";

const steps = [
    { step: 1, label: "Account" },
    { step: 2, label: "Email" },
    { step: 3, label: "Security" },
    { step: 4, label: "Finish" },
];

const otpFields = Array.from({ length: 6 }, (_, index) => index);

const RegisterPage = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");

    const [userInfo, setUserInfo] = useState<RegistrationFormStep3Type>({
        firstName: "",
        lastName: "",
        username: "",
        countryCode: "EG",
        phone: "",
        email: "",
    });

    const { mutateAsync: sendVerificationEmailAsync, isPending: isSendingEmail } = sendEmailVerification();
    const { mutateAsync: verifyCodeEmailAsync, isPending: isVerifyingCode } = verifyCodeEmail();

    const form = useForm<RegistrationFormStep1Type>({
        resolver: zodResolver(registrationStep1Schema),
        defaultValues: {
            email: "",
        },
    });

    const formStep3 = useForm<RegistrationFormStep3Type>({
        resolver: zodResolver(registrationStep3Schema),
        defaultValues: {
            firstName: "",
            lastName: "",
            username: "",
            countryCode: "EG",
            phone: "",
        },
    });

    async function onSubmit(data: RegistrationFormStep1Type) {
        try {
            await sendVerificationEmailAsync(data.email);
            setEmail(data.email);
            setStep(2);
        } catch (error) {
            const message = error as Error;
            toast.error(message?.message || "Unable to send the verification email.");
        }
    }

    async function onVerifyCodeSubmit({ code }: { code: string }) {
        try {
            const res = await verifyCodeEmailAsync({ email, code });
            toast.success(res?.message || "Email verified");
            setStep(3);
        } catch (error) {
            const message = error as Error;
            toast.error(message?.message || "Verification failed. Please check the code.");
        }
    }

    function onRegisterFormStep3(data: RegistrationFormStep3Type) {
        setUserInfo({
            ...data,
            email,
        });
        setStep(4);
    }

    return (
        <div className="space-y-8">
            {/* Step indicator — controlled so it follows the actual step state */}
            <Stepper value={step} onValueChange={setStep} className="w-full">
                <StepperNav className="w-full">
                    {steps.map(({ step: s, label }) => (
                        <StepperItem key={s} step={s}>
                            <StepperTrigger className="group flex-col gap-1.5">
                                <StepperIndicator className="size-7 text-xs font-semibold">
                                    {s < step ? <Check className="size-4" /> : s}
                                </StepperIndicator>
                                <span className="text-xs font-medium text-muted-foreground group-data-[state=active]:text-foreground group-data-[state=completed]:text-foreground">
                                    {label}
                                </span>
                            </StepperTrigger>
                            {s !== steps.length && (
                                <StepperSeparator className="mx-1 data-[state=completed]:bg-primary" />
                            )}
                        </StepperItem>
                    ))}
                </StepperNav>
            </Stepper>

            {step === 1 ? (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <AuthHeading
                        title="Create your account"
                        description="Start with your email address — we’ll verify it before we continue."
                    />

                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    autoComplete="email"
                                    className="h-11 px-3.5 text-sm"
                                    type="email"
                                    placeholder="user@example.com"
                                    aria-invalid={fieldState.invalid}
                                    {...field}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                    <Button
                        type="submit"
                        className="h-11 w-full"
                        disabled={isSendingEmail}
                    >
                        {isSendingEmail ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Sending verification email…
                            </>
                        ) : (
                            <>
                                Continue
                                <ChevronRight />
                            </>
                        )}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/auth/login"
                            className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </form>
            ) : step === 2 ? (
                <div className="space-y-6">
                    <AuthHeading
                        title="Check your email"
                        description="Enter the 6-digit code we sent to:"
                    />

                    <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/40 px-3.5 py-3">
                        <span className="min-w-0 truncate text-sm font-medium">
                            {email || "your email"}
                        </span>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="shrink-0 text-sm font-medium text-primary underline-offset-4 hover:underline"
                        >
                            Edit
                        </button>
                    </div>

                    <InputOTP
                        maxLength={6}
                        containerClassName="justify-center"
                        onComplete={(code) => onVerifyCodeSubmit({ code })}
                    >
                        <InputOTPGroup className="gap-1">
                            {otpFields.map((index) => (
                                <InputOTPSlot key={index} index={index} className="size-10" />
                            ))}
                        </InputOTPGroup>
                    </InputOTP>

                    <div className="flex justify-center">
                        <Button
                            type="button"
                            variant="secondary"
                            className="h-11 w-full"
                            disabled={isVerifyingCode}
                        >
                            {isVerifyingCode ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Verifying…
                                </>
                            ) : (
                                "Verify code"
                            )}
                        </Button>
                    </div>
                </div>
            ) : step === 3 ? (
                <div className="space-y-6">
                    <AuthHeading
                        title="Tell us about yourself"
                        description="A few details so your profile and results stay personal."
                    />

                    <form
                        onSubmit={formStep3.handleSubmit(onRegisterFormStep3)}
                        className="space-y-5"
                    >
                        {/* First name + Last name */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-3">
                            <Controller
                                name="firstName"
                                control={formStep3.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="firstName">
                                            First name <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        <Input
                                            id="firstName"
                                            autoComplete="given-name"
                                            className="h-11 px-3.5 text-sm"
                                            type="text"
                                            placeholder="Ahmed"
                                            aria-invalid={fieldState.invalid}
                                            {...field}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="lastName"
                                control={formStep3.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="lastName">
                                            Last name <span className="text-destructive">*</span>
                                        </FieldLabel>
                                        <Input
                                            id="lastName"
                                            autoComplete="family-name"
                                            className="h-11 px-3.5 text-sm"
                                            type="text"
                                            placeholder="Abdullah"
                                            aria-invalid={fieldState.invalid}
                                            {...field}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </div>

                        {/* Username */}
                        <Controller
                            name="username"
                            control={formStep3.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="username">
                                        Username <span className="text-destructive">*</span>
                                    </FieldLabel>
                                    <Input
                                        id="username"
                                        autoComplete="username"
                                        className="h-11 px-3.5 text-sm"
                                        type="text"
                                        placeholder="user123"
                                        aria-invalid={fieldState.invalid}
                                        {...field}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        {/* Phone with country selector */}
                        <Field>
                            <FieldLabel>
                                Phone <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Controller
                                name="countryCode"
                                control={formStep3.control}
                                render={({ field: countryField, fieldState: countryState }) => (
                                    <Controller
                                        name="phone"
                                        control={formStep3.control}
                                        render={({ field: phoneField, fieldState: phoneState }) => (
                                            <>
                                                <CountryPhoneSelector
                                                    selectedCountryCode={countryField.value}
                                                    onCountryChange={countryField.onChange}
                                                    phoneValue={phoneField.value}
                                                    onPhoneChange={phoneField.onChange}
                                                    phoneRef={phoneField.ref}
                                                    phoneError={phoneState.error}
                                                    countryError={countryState.error}
                                                />
                                                {(phoneState.invalid || countryState.invalid) && (
                                                    <FieldError
                                                        errors={[
                                                            phoneState.error,
                                                            countryState.error,
                                                        ]}
                                                    />
                                                )}
                                            </>
                                        )}
                                    />
                                )}
                            />
                        </Field>

                        <Button type="submit" className="h-11 w-full">
                            Continue
                            <ChevronRight />
                        </Button>
                    </form>
                </div>
            ) : (
                <Step4PasswordForm userInfo={userInfo} />
            )}
        </div>
    );
};

export default RegisterPage;