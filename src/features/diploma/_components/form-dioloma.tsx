"use client"
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { createDiplomaSchema, CreateDiplomaType } from '../schema/diploma.schema'
import { Field, FieldError, FieldLabel } from '@/src/shared/components/ui/field'
import { Input } from '@/src/shared/components/ui/input'
import { cn } from '@/src/shared/lib/utils'
import { Button, buttonVariants } from '@/src/shared/components/ui/button'
import Link from 'next/link'
import { Loader2, SaveIcon, X } from 'lucide-react'
import UploadImageField from '@/src/shared/components/upload-image-field'
import { useCreateDiploma, useUpdateDiploma } from '../hooks/hooks'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Textarea } from '@/src/shared/components/ui/textarea'

interface IProps {
    initialData?: CreateDiplomaType
    isEdit?: boolean;
    id?: string
}

const FormDiploma = ({ initialData, isEdit, id }: IProps) => {

    const { mutate, isPending: isPendingCreate } = useCreateDiploma()
    const { mutate: mutateUpdated, isPending: isPendingUpdate } = useUpdateDiploma()

    const isPending = isEdit ? isPendingUpdate : isPendingCreate

    const form = useForm<CreateDiplomaType>({
        resolver: zodResolver(createDiplomaSchema),
        defaultValues: {
            title: initialData?.title ?? "",
            description: initialData?.description ?? "",
            image: initialData?.image ?? "",
        }
    })

    const router = useRouter()

    const onSubmit = (values: CreateDiplomaType) => {

        if (isEdit) {
            mutateUpdated({ values, id : id ?? "" }, {
                onSuccess() {
                    toast.success("done update diploma")
                    router.push("/")
                },
                onError(error) {
                    toast.error(error.message || "something error")
                },
            })

        } else {
            mutate(values, {
                onSuccess() {
                    toast.success("done create diploma")
                    router.push("/")
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
                            {isEdit ? "Edit Diploma" : "New Diploma"}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Save your changes before leaving this page.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={"/"}
                            className={cn(buttonVariants({ variant: "outline" }))}
                        >
                            <X />
                            Cancel
                        </Link>
                        <Button disabled={isPending} type="submit">
                            {isPending ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <SaveIcon />
                                    Save
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="rounded-lg border border-border bg-card">
                    <div className="border-b border-border px-5 py-4">
                        <p className="font-medium">Diploma Information</p>
                        <p className="text-sm text-muted-foreground">
                            Provide a clear title, description, and cover image.
                        </p>
                    </div>
                    <div className="space-y-4 p-5">
                        <UploadImageField url={initialData?.image || undefined} isEdit={true} />

                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Title</FieldLabel>
                                    <Input
                                        className="h-11"
                                        type="text"
                                        placeholder="Frontend Development"
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
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Description</FieldLabel>
                                    <Textarea
                                        className="min-h-28"
                                        placeholder="A short overview of this diploma track"
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
                </div>
            </form>
        </FormProvider>
    )
}

export default FormDiploma