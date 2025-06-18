import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { X, LogOut } from "lucide-react"
import { Logo } from "../common/logo"
import { Navigation } from "./navigation"
import { UserProfile } from "./user-profile"
import { useAuth } from "../../providers/auth-provider"
import { cn } from "../../lib/utils"

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { logout } = useAuth()

    return (
        <>
            {/* Overlay */}
            {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-50 h-screen w-64 bg-background border-r border-border flex flex-col apply-transition lg:relative lg:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                )}
                data-testid="sidebar"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6">
                    <Link to="/" onClick={onClose}>
                        <Logo />
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="lg:hidden"
                        aria-label="Close menu"
                        data-testid="sidebar-close"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-4">
                    <Navigation onItemClick={onClose} />
                </div>

                {/* User Profile */}
                <div className="p-4 border-t border-border">
                    <UserProfile />
                    <div className="mt-4">
                        <Button
                            variant="ghost"
                            onClick={logout}
                            className="w-full justify-start gap-2"
                            data-testid="logout-button"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    )
}