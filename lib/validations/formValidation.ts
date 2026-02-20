import { z } from "zod"
import { authValidationMessages } from "@/lib/constants"

const emailSchema = z.string().trim()
  .min(1, authValidationMessages.emailRequired)
  .email(authValidationMessages.emailInvalid)

const passwordSchema = z.string().min(1, authValidationMessages.passwordRequired)

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, authValidationMessages.passwordRequired),
})

export const signUpSchema = z.object({
    name: z.string().trim().min(1, authValidationMessages.nameRequired),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, authValidationMessages.confirmPasswordRequired),
  }).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: authValidationMessages.passwordMismatch,
  })

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
