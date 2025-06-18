import { useState, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

export default function MainLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false)
    }, [location.pathname])

    return (
        <div className="h-screen bg-background overflow-hidden">
            <div className="grid lg:grid-cols-[225px_1fr] h-full">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="flex flex-col h-full overflow-hidden">
                    <Header onMenuClick={() => setSidebarOpen(true)} />
                    <div className="flex-1 overflow-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}