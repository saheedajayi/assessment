import type React from "react"
import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Sparkles, ClipboardList, Search, ShieldAlert } from "lucide-react"
import { cn } from "../../lib/utils"

interface NavigationItem {
    title: string
    href: string
    icon: React.ComponentType<{ className?: string }>
}

const navigationItems: NavigationItem[] = [
    {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Recommendations",
        href: "/recommendations",
        icon: Sparkles,
    },
    {
        title: "Policies",
        href: "/policies",
        icon: ClipboardList,
    },
    {
        title: "Events",
        href: "/events",
        icon: Search,
    },
    {
        title: "Waivers",
        href: "/waivers",
        icon: ShieldAlert,
    },
]

interface NavigationProps {
    onItemClick?: () => void
}

export function Navigation({ onItemClick }: NavigationProps) {
    const location = useLocation()

    const isActive = (href: string) => {
        if (href === "/") {
            return location.pathname === "/"
        }
        return location.pathname.startsWith(href)
    }

    return (
        <nav className="space-y-1">
            <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Platform</p>
            {navigationItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)

                let dataTestId: string | undefined = undefined

                switch (item.title) {
                    case "Dashboard":
                        dataTestId = "nav-dashboard"
                        break
                    case "Recommendations":
                        dataTestId = "nav-recommendations"
                        break
                    case "Policies":
                        dataTestId = "nav-policies"
                        break
                    case "Events":
                        dataTestId = "nav-events"
                        break
                    case "Waivers":
                        dataTestId = "nav-waivers"
                        break
                    default:
                        break
                }

                return (
                    <Link
                        key={item.href}
                        to={item.href}
                        onClick={onItemClick}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            active
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        )}
                        data-testid={dataTestId}
                    >
                        <Icon className="h-4 w-4" />
                        {item.title}
                    </Link>
                )
            })}
        </nav>
    )
}
