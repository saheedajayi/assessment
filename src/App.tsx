import { AppProviders } from "./providers/app-providers"
import { AppRouter } from "./components/routing/app-router"

function App() {
    return (
        <AppProviders>
            <AppRouter />
        </AppProviders>
    )
}

export default App
