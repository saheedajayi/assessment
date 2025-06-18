import React, { Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ProtectedRoute } from "./protected-route"
import { LoadingSpinner } from "../common/loading-spinner"

// Lazy load pages
const LoginPage = React.lazy(() => import("../../features/auth/pages/login-page"))
const DashboardPage = React.lazy(() => import("../../features/dashboard/pages/dashboard-page"))
const RecommendationsPage = React.lazy(() => import("../../features/recommendations/pages/recommendations-page"))
const Layout = React.lazy(() => import("../layout/main-layout"))

export function AppRouter() {
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<DashboardPage title="Dashboard" />} />
                        <Route path="policies" element={<DashboardPage title="Policies" />} />
                        <Route path="events" element={<DashboardPage title="Events" />} />
                        <Route path="waivers" element={<DashboardPage title="Waivers" />} />
                        <Route path="recommendations" element={<RecommendationsPage />} />
                        <Route path="recommendations/archive" element={<RecommendationsPage archived />} />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}
