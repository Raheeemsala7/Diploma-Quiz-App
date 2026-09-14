"use client"
import { Button, buttonVariants } from '@/src/shared/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/src/shared/components/ui/field'
import { Input } from '@/src/shared/components/ui/input'
import { Textarea } from '@/src/shared/components/ui/textarea'
import UploadImageField from '@/src/shared/components/upload-image-field'
import { cn } from '@/src/shared/lib/utils'
import { Loader2, SaveIcon, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createExamSchema, CreateExamType } from '../schema/exam.diploma'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateExam, useUpdateExam } from '../hooks/hooks'
import { useDiplomasFilter } from '../../diploma/hooks/hooks'
import { MinimalDiploma } from '../../diploma/types/diploma'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/ui/select'

interface IProps {
    initialData?: CreateExamType
    isEdit?: boolean;
    id?: string
}

const FormExam = ({ initialData, isEdit, id }: IProps) => {

    const { mutate, isPending: isPendingCreate } = useCreateExam()
    const { data: diplomas } = useDiplomasFilter()
    const { mutate: mutateUpdated, isPending: isPendingUpdate } = useUpdateExam()

    const isPending = isEdit ? isPendingUpdate : isPendingCreate

    const form = useForm<CreateExamType>({
        resolver: zodResolver(createExamSchema),
        defaultValues: {
            title: initialData?.title ?? "",
            description: initialData?.description ?? "",
            image: initialData?.image ?? "",
            diplomaId: initialData?.diplomaId ?? "",
            duration : initialData?.duration ?? 1,
        }
    })

    const router = useRouter()

    const onSubmit = (values: CreateExamType) => {

        if (isEdit) {
            mutateUpdated({ values, id: id ?? "" }, {
                onSuccess() {
                    toast.success("done update diploma")
                    router.push("/exams")
                },
                onError(error) {
                    toast.error(error.message || "something error")
                },
            })

        } else {
            mutate(values, {
                onSuccess() {
                    toast.success("done create exam")
                    router.push("/exams")
                },
                onError(error) {
                    toast.error(error.message || "something error")
                },
            })
        }
    }
    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4">
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight">
                            {isEdit ? "Edit Exam" : "New Exam"}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Save your changes before leaving this page.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={"/exams"}
                            className={cn(buttonVariants({ variant: "outline" }))}
                        >
                            <X />
                            Cancel
                        </Link>

                        <Button disabled={isPending} type='submit'>
                            {isPending ? <>
                                <Loader2 className='size-4 animate-spin' />
                                Saving...
                            </> : <>
                                <SaveIcon />
                                Save
                            </>}
                        </Button>
                    </div>
                </div>

                <div className="rounded-lg border border-border bg-card">
                    <div className="border-b border-border px-5 py-4">
                        <p className="font-medium">Exam Information</p>
                        <p className="text-sm text-muted-foreground">
                            Link the exam to a diploma and set its details.
                        </p>
                    </div>
                    <div className="space-y-4 p-5">

                        <div className="grid gap-4 lg:grid-cols-2">
                            <Controller
                                name="title"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Title</FieldLabel>
                                        <Input
                                            className="h-11"
                                            type="text"
                                            placeholder="JavaScript Basics"
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
                                name="diplomaId"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Diploma</FieldLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="h-11 w-full">
                                                <SelectValue placeholder="Select diploma" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {diplomas?.map((diploma: MinimalDiploma) => (
                                                        <SelectItem
                                                            key={diploma.id}
                                                            value={diploma.id}
                                                        >
                                                            {diploma.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>

                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                        </div>

                        <div className="grid gap-4 lg:grid-cols-2">
                            <UploadImageField url={initialData?.image || undefined} isEdit={true} />
                            <Controller
                                name="description"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Description</FieldLabel>
                                        <Textarea
                                            className="min-h-28"
                                            placeholder="What this exam covers"
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
                        </div>

                        <Controller
                            name="duration"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Duration (minutes)</FieldLabel>
                                    <Input
                                        className="h-11"
                                        type="number"
                                        min={1}
                                        placeholder="30"
                                        value={field.value ?? ""}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </div>
                </div>
            </form>
        </FormProvider>
    )
}

export default FormExam