import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../../providers/auth-provider"
import { Container } from "../../../components/common/container"
import { Logo } from "../../../components/common/logo"
import { LoginForm } from "../components/login-form"

export default function LoginPage() {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (isAuthenticated) {
            const from = (location.state as any)?.from || "/"
            navigate(from, { replace: true })
        }
    }, [isAuthenticated, navigate, location])

    if (isAuthenticated) {
        return null
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Container maxWidth="sm">
                <div className="w-full max-w-md mx-auto bg-card border border-border rounded-lg shadow-lg p-8">
                    <div className="text-center mb-8">
                        <Logo />
                        <h1 className="mt-6 text-2xl font-bold">Sign In</h1>
                        <p className="mt-2 text-muted-foreground">Enter your credentials to access your account</p>
                    </div>
                    <LoginForm />
                </div>
            </Container>
        </div>
    )
}
