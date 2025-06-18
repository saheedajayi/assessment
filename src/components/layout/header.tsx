import { Button } from "../ui/button"
import { Menu, Sun, Moon } from "lucide-react"
import { useTheme } from "../../providers/theme-provider"

interface HeaderProps {
    onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
    const { isDarkMode, toggleDarkMode } = useTheme()

    return (
        <header className="flex items-center justify-between py-5 pl-5 pr-5 border-b border-border">
            <Button
                variant="ghost"
                size="icon"
                onClick={onMenuClick}
                className="lg:hidden"
                aria-label="Open menu"
                data-testid="mobile-menu-button"
            >
                <Menu className="h-6 w-6" />
            </Button>

            <div className="ml-auto">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleDarkMode}
                    aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                    data-testid="theme-toggle"
                >
                    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
            </div>
        </header>
    )
}
