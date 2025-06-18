import { useState } from "react"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover"
import { Filter } from "lucide-react"
import { FilterTags } from "./filter-tags"
import { useDebounce } from "../../../hooks/use-debounce"
import { useEffect } from "react"

interface RecommendationsFiltersProps {
    searchTerm: string
    onSearchChange: (search: string) => void
}

export function RecommendationsFilters({ searchTerm, onSearchChange }: RecommendationsFiltersProps) {
    const [localSearch, setLocalSearch] = useState(searchTerm)
    const debouncedSearch = useDebounce(localSearch, 300)

    useEffect(() => {
        onSearchChange(debouncedSearch)
    }, [debouncedSearch, onSearchChange])

    useEffect(() => {
        setLocalSearch(searchTerm)
    }, [searchTerm])

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
                <Input
                    placeholder="Search recommendations..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    data-testid="search-input"
                />
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" data-testid="filter-button">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                    <FilterTags />
                </PopoverContent>
            </Popover>
        </div>
    )
}
