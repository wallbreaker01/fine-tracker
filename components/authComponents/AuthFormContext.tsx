"use client"

import { authRoutes, signInInitialState, signUpInitialState } from "@/lib/constants"
import { SignInInput, signInSchema, SignUpInput, signUpSchema } from "@/lib/formValidation"
import { useRouter } from "next/navigation"
import React, { useState } from "react"


type mode = "sign-in" | "sign-up"
export type SignInErrors = Partial<Record<keyof SignInInput, string>>
export type SignUpErrors = Partial<Record<keyof SignUpInput, string>>

interface AuthFormContextValue {
    mode: mode
    isSignIn: boolean
    formData: SignInInput | SignUpInput
    errors: SignInErrors | SignUpErrors
    isSubmitting: boolean
    successMessage: string | null
    handleInputChange: (field: string, value: string) => void
    handleSubmit: (event: React.FormEvent) => void
}

const AuthFormContext = React.createContext<AuthFormContextValue | undefined>(undefined)

function ZodValidation(issues: any[]): SignInErrors | SignUpErrors {
    const errorMap: Record<string, string> = {}
    issues.forEach(issue => {
        const field = issue.path[0] as string
        errorMap[field] = issue.message
    })
    return errorMap as SignInErrors | SignUpErrors
}

type AuthApiResponse = {
    success: boolean
    message?: string
    user?: { id: number; name: string; email: string; avatar?: string | null }
}

function mapApiErrorToFields(
    message: string | undefined,
    isSignIn: boolean,
): SignInErrors | SignUpErrors {
    const fallback = message ?? "Something went wrong. Please try again."
    const lower = fallback.toLowerCase()

    if (lower.includes("already exists")) {
        return { email: fallback }
    }

    if (lower.includes("invalid email or password")) {
        return { password: fallback }
    }

    return isSignIn ? { email: fallback } : { email: fallback }
}


export function AuthFormProvider({ children, mode }: { children: React.ReactNode, mode: mode }) {
    const router = useRouter()
    const isSignIn = mode === "sign-in"
    const [formData, setFormData] = useState<SignInInput | SignUpInput>(isSignIn ? signInInitialState : signUpInitialState)
    const [errors, setErrors] = useState<SignInErrors | SignUpErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        setErrors(prev => ({ ...prev, [field]: undefined }))
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        const schema = isSignIn ? signInSchema : signUpSchema
        const SchemaResult = schema.safeParse(formData)

        if (!SchemaResult.success) {
            setErrors(ZodValidation(SchemaResult.error.issues))
            return;
        }
        setIsSubmitting(true)
        setSuccessMessage(null)
        const endpoint = isSignIn ? "/api/auth/sign-in" : "/api/auth/sign-up"
        let result: AuthApiResponse
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })
            result = await response.json()
        } catch {
            setErrors(mapApiErrorToFields("Unable to connect. Please try again.", isSignIn))
            setIsSubmitting(false)
            return
        }

        if (!result.success) {
            setErrors(mapApiErrorToFields(result.message, isSignIn))
            setIsSubmitting(false)
            return
        }

        if (isSignIn) {
            if (result.user) {
                localStorage.setItem("fineTrackerUser", JSON.stringify(result.user))
                window.dispatchEvent(new CustomEvent("fineTrackerUserUpdated"))
                router.push(authRoutes.dashboard)
                return
            }

            setErrors(mapApiErrorToFields("Unable to sign in right now.", isSignIn))
            setIsSubmitting(false)
            return
        }

        setIsSubmitting(false)
        setSuccessMessage("Account created successfully! Redirecting to sign in...")
        setTimeout(() => {
            router.push(authRoutes.signIn)
        }, 2000)
    }
    const values = { mode, isSignIn, formData, errors, isSubmitting, successMessage, handleInputChange, handleSubmit }

    return (
        <AuthFormContext.Provider value={values}>
            {children}
        </AuthFormContext.Provider>
    )

}

export function useAuthForm() {
    const context = React.useContext(AuthFormContext)
    if (!context) {
        throw new Error("useAuthForm must be used within an AuthFormProvider")
    }
    return context
}
