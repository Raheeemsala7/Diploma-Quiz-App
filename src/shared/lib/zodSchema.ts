import { z } from "zod"

export const registrationStep1Schema = z.object({
    email: z
        .string()
        .email('Please enter a valid email address')
        .min(1, 'Email is required'),
});

// TypeScript type from Zod schema
export type RegistrationFormStep1Type = z.infer<typeof registrationStep1Schema>;


export const registrationStep3Schema = z.object({
    firstName: z
        .string()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must be less than 50 characters')
        .regex(/^[\u0621-\u064A\u0660-\u0669a-zA-Z\s]+$/, 'First name can only contain Arabic or English letters and spaces'),
    lastName: z
        .string()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must be less than 50 characters')
        .regex(/^[\u0621-\u064A\u0660-\u0669a-zA-Z\s]+$/, 'Last name can only contain Arabic or English letters and spaces'),
    username: z
        .string()
        .min(2, "Username must be at least 2 characters")
        .max(50, "Username must be less than 50 characters")
        .regex(
            /^[\u0621-\u064Aa-zA-Z0-9_]+$/,
            "Username can only contain letters, numbers, and underscores"
        ),
    countryCode: z.string().min(1, "Please select a country"),
    phone: z
        .string()
        .min(5, "Phone number is too short")
        .max(15, "Phone number is too long")
        .regex(/^\d+$/, "Phone number must contain digits only"),
    email: z
        .string()
        .email('Please enter a valid email address')
        .min(1, 'Email is required').optional(),

});

// TypeScript type from Zod schema
export type RegistrationFormStep3Type = z.infer<typeof registrationStep3Schema>;

export const createPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
            .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
            .regex(/(?=.*\d)/, 'Password must contain at least one number')
            .regex(/(?=.*[@$!%*?&])/, 'Password must contain at least one special character'),

        confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "كلمة السر غير متطابقة",
        path: ["confirmPassword"],
    });

export type CreatePasswordType = z.infer<typeof createPasswordSchema>;


export const signInSchema = z.object({
    username: z
        .string()
        .min(2, "Username must be at least 2 characters")
        .max(50, "Username must be less than 50 characters")
        .regex(
            /^[\u0621-\u064Aa-zA-Z0-9_]+$/,
            "Username can only contain letters, numbers, and underscores"
        ),
    password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
            .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
            .regex(/(?=.*\d)/, 'Password must contain at least one number')
});

// TypeScript type from Zod schema
export type SignInFormType = z.infer<typeof signInSchema>;