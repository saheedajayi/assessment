import { Link } from "react-router-dom"
import { Container } from "../../../components/common/container"
import { Button } from "../../../components/ui/button"
import { ArrowRight } from "lucide-react"

interface DashboardPageProps {
    title: string
}

export default function DashboardPage({ title }: DashboardPageProps) {
    return (
        <Container>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">{title}</h1>
                    <p className="text-muted-foreground mt-2">Welcome to your security management dashboard</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="p-6 border border-border rounded-lg">
                        <h5 className="font-semibold mb-2">Quick Actions</h5>
                        <p className="text-sm text-muted-foreground mb-4">Get started with the most common tasks</p>
                        <Button asChild>
                            <Link to="/recommendations">
                                View Recommendations
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="p-6 border border-border rounded-lg">
                        <h5 className="font-semibold mb-2">Recent Activity</h5>
                        <p className="text-sm text-muted-foreground">No recent activity to display</p>
                    </div>

                    <div className="p-6 border border-border rounded-lg">
                        <h5 className="font-semibold mb-2">System Status</h5>
                        <p className="text-sm text-muted-foreground">All systems operational</p>
                    </div>
                </div>
            </div>
        </Container>
    )
}
