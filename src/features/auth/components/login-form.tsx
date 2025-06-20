"use client"

import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import {Button} from "../../../components/ui/button"
import {Label} from "../../../components/ui/label"
import {Loader2} from "lucide-react"
import {useAuth} from "../../../providers/auth-provider"
import {authService} from "../../../services/auth"
import {toast} from "react-hot-toast"
import {handleApiError} from "../../../lib/error-handling"
import {Input} from "../../../components/ui/input"
import type {LoginRequest} from "../../../types/auth"
import { sanitizeText } from "../../../lib/sanitize"

const loginSchema = z
    .object({
        username: z.string().min(1, "Username is required"),
        password: z.string().min(1, "Password is required"),
    })
    .strict()

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
    const {login} = useAuth()

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        setError,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginFormData) => {
        try {

            const loginData: LoginRequest = {
                username: sanitizeText(data.username),
                password: data.password,
            }
            const response = await authService.login(loginData)
            login(response.token)
            toast.success("Welcome back!")
        } catch (error: any) {
            const errorMessage = handleApiError(error)

            if (error?.response?.status === 401) {
                setError("username", {message: "Invalid credentials"})
                setError("password", {message: "Invalid credentials"})
            } else {
                toast.error(errorMessage)
            }
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    type="text"
                    autoComplete="username"
                    {...register("username")}
                    error={errors.username?.message}
                    data-testid="username-input"
                />
                {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    {...register("password")}
                    error={errors.password?.message}
                    data-testid="password-input"
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting} data-testid="login-button">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                Sign In
            </Button>
        </form>
    )
}

