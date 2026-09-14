"use client"
import { Field, FieldError, FieldLabel } from "@/src/shared/components/ui/field"
import { Input } from "@/src/shared/components/ui/input"
import { Controller, useForm } from "react-hook-form"
import { ProfileFormType, profileSchema } from "../schema/profile-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useGetAccount, useUpdateProfile } from "../hooks/use-account"
import { useEffect } from "react"
import CountryPhoneSelector from "@/src/app/auth/register/_components/country-phone-selector"
import ModelDeleteAccount from "./model-delete-account"
import { Button } from "@/src/shared/components/ui/button"
import ModelChangeEmail from "./model-change-email"
import { toast } from "sonner"

const UpdateForm = () => {

    const { data, isLoading } = useGetAccount()

    const { mutate } = useUpdateProfile()




    const form = useForm<ProfileFormType>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            countryCode: "EG",
            phone :"",
            username :""


        }
    })



useEffect(() => {
    if (data && !form.formState.isDirty) {

        form.reset({
            firstName: data.firstName ?? "",
            lastName: data.lastName ?? "",
            email: data.email ?? "",
            username: data.username ?? "",
            phone: data.phone ?? "",
            countryCode: "EG"
        })
    }
}, [data])

    if (isLoading) {
        return <p>loading...</p>
    }

    const onSubmit = (values: ProfileFormType) => {
        const { firstName, lastName, phone } = values

        mutate({
            firstName,
            lastName,
            phone
        }, {
            onSuccess() {
                toast.success("Your data has been updated.")
            },
            onError: (error) => {
                const message = error instanceof Error ? error.message : "Failed to delete account";
                toast.error(message)
            }
        })
    }
  

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-2.5">
                <Controller
                    name="firstName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>First Name</FieldLabel>
                            <Input
                                className="px-4 py-6 border-border"
                                type="text"
                                placeholder="Mohammed"
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
                    name="lastName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Last Name</FieldLabel>
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
            </div>
            <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel>Username</FieldLabel>
                        <Input
                            className="px-4 py-6 border-border"
                            type="text"
                            placeholder="Ahmed"
                            disabled
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
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel className="flex justify-between">
                            <span>Email</span>
                            <ModelChangeEmail />
                        </FieldLabel>
                        <Input
                            className="px-4 py-6 border-border"
                            type="email"
                            placeholder="user@example.com"
                            readOnly
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

            <Field>
                <FieldLabel>Phone </FieldLabel>
                <Controller
                    name="countryCode"
                    control={form.control}
                    render={({ field: countryField, fieldState: countryState }) => (
                        <Controller
                            name="phone"
                            control={form.control}
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
                                            errors={[phoneState.error, countryState.error]}
                                        />
                                    )}
                                </>
                            )}
                        />
                    )}
                />
            </Field>

            <div className="flex gap-4 items-center pt-4">
                <ModelDeleteAccount />
                <Button
                  disabled={!form.formState.isDirty}
                className="flex-1" type="submit">
                    Save Changes
                </Button>
            </div>

        </form>
    )
}

export default UpdateForm