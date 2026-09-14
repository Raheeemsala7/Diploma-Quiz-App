import React, { useEffect, useRef, useState } from 'react'
import { Controller, useForm, useFormContext } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { uploadImageSchema, UploadImageType } from '../lib/schema/image.schema'
import { useUploadImage } from '../hooks/use-upload-image'
import { Progress } from './ui/progress'
import { toast } from 'sonner'
import { CreateDiplomaType } from '@/src/features/diploma/schema/diploma.schema'
import { CloudUpload, CloudUploadIcon, Download, FileImage, Trash, Trash2 } from 'lucide-react'

interface IProps {
    url?: string;
    isEdit?: boolean
}

const UploadImageField = ({ isEdit, url }: IProps) => {

    const { isPending, mutate, uploadProgress } = useUploadImage()
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [uploadedImage, setUploadedImage] = useState<{
        name: string
        size: number
    } | null>(null)


    const diplomaForm = useFormContext<CreateDiplomaType>()
    const {
        formState: { errors }
    } = diplomaForm

    const form = useForm<UploadImageType>({
        resolver: zodResolver(uploadImageSchema),
        mode: "onChange"
    })


    useEffect(() => {
        if (isEdit && url) {
            setPreview(url)
            setUploadedImage({
                name: "uploaded-image",
                size: 0
            })
        }
    }, [])


    useEffect(() => {
        const unsubscribe = form.subscribe({
            formState: {
                values: true,
                isValid: true
            },
            callback: ({ values, isValid }) => {

                if (isValid) {
                    mutate.mutate(values, {
                        onError: (error) => {
                            form.setError("image", { message: error.message })
                        },
                        onSuccess: (data) => {
                            toast.success("uploaded image successfully")
                            console.log(data.url)
                            diplomaForm.setValue("image", data.url)

                            // LOCAL PREVIEW
                            const url = URL.createObjectURL(values.image)
                            setPreview(url)
                            setUploadedImage({
                                name: form.getValues("image")?.name || "image",
                                size: form.getValues("image")?.size || 0
                            })
                        }
                    })

                }


            }
        })

        return () => unsubscribe()
    })


    return (
        <Controller
            name="image"
            control={form.control}
            render={({ field: { value: _value, onChange, ...field }, fieldState }) => (
                <Field>
                    <FieldLabel>
                        Image
                    </FieldLabel>
                    <div>
                        {uploadedImage && preview ? (
                            <div className="p-1.5 flex items-center gap-2 bg-muted/40 border border-border cursor-pointer rounded-lg">

                                {/* IMAGE PREVIEW */}
                                <img
                                    src={preview || ""}
                                    alt="uploaded"
                                    className="w-21.5 h-21.5 object-cover rounded-md"
                                />

                                {/* INFO */}
                                <div className="text-sm flex-1 min-w-0">
                                    <p className='text-muted-foreground truncate'> {uploadedImage.name}</p>
                                </div>

                                <div className="flex gap-2 p-2.5 items-center">

                                    <p className="text-muted-foreground/70 border-r border-border pr-3 hidden sm:block">{(uploadedImage.size / 1024).toFixed(2)} KB</p>

                                    <div className='flex gap-1.5 items-center'>
                                        {/* DOWNLOAD */}
                                        <a
                                            href={preview}
                                            download
                                            className="text-primary"
                                        >
                                            <Download />
                                        </a>

                                        {/* REMOVE */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setUploadedImage(null)
                                                diplomaForm.setValue("image", "")
                                                form.reset()
                                            }}
                                            className="text-destructive"
                                        >
                                            <Trash2 />
                                        </button>
                                    </div>


                                </div>
                            </div>
                        ) : (
                            <div className="h-22 p-6 border border-dashed border-border rounded-lg flex justify-center items-center relative hover:bg-muted/40 transition-colors cursor-pointer" onClick={() => inputRef.current?.click()}>
                                <span className='absolute left-6 top-6 text-muted-foreground/25'>
                                    <FileImage className='size-10' />
                                </span>
                                <p className='text-sm flex items-center gap-1.5 text-muted-foreground'><CloudUploadIcon className='size-4' /> Drop an image here or <span className='text-primary font-medium'>select from your computer</span></p>
                                <Input
                                    className="hidden"
                                    type="file"
                                    placeholder="Description"
                                    onChange={(e) => onChange(e.target.files?.[0])}
                                    {...field}
                                    ref={inputRef}
                                />
                            </div>
                        )}


                    </div>
                    {isPending && <Progress value={uploadProgress} />}
                    {fieldState.invalid && (
                        <FieldError
                            className="text-red-500"
                            errors={[fieldState.error]}
                        />
                    )}
                    {errors.image && (
                        <FieldError
                            className="text-red-500"
                            errors={[errors.image]}
                        />
                    )}
                </Field>
            )}
        />
    )
}

export default UploadImageField