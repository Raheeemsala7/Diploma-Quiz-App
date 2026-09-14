"use client"
import { Stepper, StepperIndicator, StepperItem, StepperNav, StepperSeparator, StepperTrigger } from '@/src/shared/components/reui/stepper';
import { Button } from '@/src/shared/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/src/shared/components/ui/dialog'
import { DiamondIcon, Loader2Icon, PencilLine } from 'lucide-react'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { emailRequestSchema, EmailRequestType } from '../schema/profile-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldLabel } from '@/src/shared/components/ui/field';
import { Input } from '@/src/shared/components/ui/input';
import { useChangeEmailConfirm, useChangeEmailRequest } from '../hooks/use-account';
import { toast } from 'sonner';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/src/shared/components/ui/input-otp';
import { IPayloadEmailConfirm } from '../types/account';


const steps = [
    { step: 1, label: "Request", icon: DiamondIcon },
    { step: 2, label: "Confirm", icon: DiamondIcon },

];


const ModelChangeEmail = () => {
    const [step, setStep] = useState(1)
    const [open, setOpen] = useState(false)
    const [code, setCode] = useState("")

    const { mutate: mutateReq, isPending: isPendingReq } = useChangeEmailRequest()
    const { mutate: mutateConfirm, isPending: isPendingConfirm } = useChangeEmailConfirm()

    const formRequest = useForm<EmailRequestType>({
        resolver: zodResolver(emailRequestSchema),
        defaultValues: {
            newEmail: ""
        }

    })

    const onSubmitRequest = (values: EmailRequestType) => {
        mutateReq({
            newEmail: values.newEmail
        }, {
            onSuccess() {
                toast.success("Verification email sent successfully.")
                setStep(2)
            },
            onError: (error) => {
                const message = error instanceof Error ? error.message : "Failed to delete account";
                toast.error(message)
            }
        })
    }

    const handelVerifyCode = (values: IPayloadEmailConfirm) => {
        mutateConfirm({
            code: values.code
        }, {
            onSuccess() {
                toast.success("Your data has been updated.")
                setOpen(false)
                setStep(1)
            },
            onError: (error) => {
                const message = error instanceof Error ? error.message : "Failed to delete account";
                toast.error(message)
            }
        })
    }



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className='text-primary cursor-pointer flex gap-1 items-center' onClick={() => setOpen(true)}>
                    <PencilLine className='size-4' />
                    <span className='text-sm'>change</span>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl flex justify-center items-center flex-col p-9">

                <Stepper value={step} className="w-full max-w-2xl mx-auto">
                    <StepperNav>
                        {steps.map(({ step: s, icon: Icon }) => (
                            <StepperItem key={s} step={s} >
                                <StepperTrigger>
                                    <StepperIndicator
                                        className={`group !bg-transparent
                                                        transition-all duration-200 size-6
                                                        data-[state=active]:bg-primary/10 data-[state=active]:ring-2 data-[state=active]:ring-primary/20
                                                    `}
                                    >
                                        <div>
                                            <Icon className="bg-transparent group-data-[state=completed]:stroke-primary group-data-[state=active]:stroke-primary group-data-[state=completed]:fill-primary group-data-[state=active]:fill-primary group-data-[state=inactive]:stroke-primary" size={25} />
                                        </div>
                                    </StepperIndicator>
                                </StepperTrigger>

                                {/* Line */}
                                {s !== steps.length && (
                                    <StepperSeparator className="border-b-2 border-dashed border-primary group-data-[state=completed]/step:border-solid" />
                                )}
                            </StepperItem>
                        ))}
                    </StepperNav>


                </Stepper>

                {step === 1 ?
                    <div className='text-start w-full space-y-4'>
                        <h6 className='text-3xl font-bold'>Change Email</h6>
                        <p className='text-primary text-2xl font-bold'>Enter your new email</p>

                        <form onSubmit={formRequest.handleSubmit(onSubmitRequest)}>
                            <Controller
                                name="newEmail"
                                control={formRequest.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>
                                            Email
                                        </FieldLabel>
                                        <Input
                                            className="px-4 py-6 border-border"
                                            type="email"
                                            placeholder="user@example.com"

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

                            <DialogFooter className='w-full flex !justify-center items-center pt-6'>

                                <Button disabled={isPendingReq} className='flex-1' type="submit">
                                    {isPendingReq ? <>
                                        <Loader2Icon className=' animate-spin' />
                                        Next
                                    </> : "Next"}
                                </Button>
                            </DialogFooter>
                        </form>

                    </div> :

                    <div className='text-start w-full space-y-4'>
                        <h6 className='text-3xl font-bold'>Change Email</h6>
                        <p className='text-primary text-2xl font-bold'>Verify OTP</p>

                        <p>Please enter the 6-digits code we have sent to:</p>
                        <div >
                            user@example.com <span onClick={() => setStep(1)} className="text-primary cursor-pointer underline"> Edit</span>
                        </div>

                        <div className="flex justify-center mt-5">
                            <InputOTP maxLength={6} className="mx-auto font-mono"
                                onComplete={(data) => {
                                    handelVerifyCode({ code: data });
                                    setCode(data)
                                }}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot className="!font-mono" index={0} />
                                    <InputOTPSlot className="!font-mono" index={1} />
                                    <InputOTPSlot className="!font-mono" index={2} />
                                    <InputOTPSlot className="!font-mono" index={3} />
                                    <InputOTPSlot className="!font-mono" index={4} />
                                    <InputOTPSlot className="!font-mono" index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        <DialogFooter className='w-full flex !justify-center items-center pt-6'>

                            <Button onClick={() => handelVerifyCode({ code })} disabled={isPendingConfirm} className='flex-1' type="submit">
                                {isPendingConfirm ? <>
                                    <Loader2Icon className=' animate-spin' />
                                    Verify...
                                </> : "Verify"}
                            </Button>
                        </DialogFooter>

                    </div>

                }


            </DialogContent>
        </Dialog>
    )
}

export default ModelChangeEmail