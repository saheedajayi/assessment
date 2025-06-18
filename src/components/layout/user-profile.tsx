import { useAuth } from "../../providers/auth-provider"

export function UserProfile() {
    const { user } = useAuth()

    if (!user) return null

    return (
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">{user.username.slice(0, 2).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user.username}</p>
                <p className="text-xs text-muted-foreground truncate">admin@aryon.com</p>
            </div>
        </div>
    )
}
