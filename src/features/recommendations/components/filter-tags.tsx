import { useState } from "react"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Checkbox } from "../../../components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion"
import { useFilter } from "../../../providers/filter-provider"
import { LoadingSpinner } from "../../../components/common/loading-spinner"
import {useAvailableTags} from "../hooks/use-available-tags";

export function FilterTags() {
    const [searchTerm, setSearchTerm] = useState("")
    const { selectedTags, addTag, removeTag, clearTags } = useFilter()
    const { data: availableTags, isLoading } = useAvailableTags()

    const handleTagToggle = (tag: string) => {
        if (selectedTags.includes(tag)) {
            removeTag(tag)
        } else {
            addTag(tag)
        }
    }

    const filterTags = (tags: string[]) => {
        if (!searchTerm) return tags
        return tags.filter((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (isLoading) {
        return <LoadingSpinner size="sm" text="Loading filters..." />
    }

    if (!availableTags) {
        return <div className="text-center text-muted-foreground">No filters available</div>
    }

    const tagCategories = [
        { key: "frameworks", label: "Frameworks", tags: availableTags.frameworks },
        { key: "providers", label: "Providers", tags: availableTags.providers },
        { key: "classes", label: "Classes", tags: availableTags.classes },
        { key: "reasons", label: "Reasons", tags: availableTags.reasons },
    ]

    return (
        <div className="space-y-4">
            <div>
                <p className="font-medium mb-2">Filter ({selectedTags.length} selected)</p>
                <Input placeholder="Search tags..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="max-h-60 overflow-y-auto">
                <Accordion type="multiple" defaultValue={tagCategories.map((cat) => cat.key)}>
                    {tagCategories.map((category) => {
                        const filteredTags = filterTags(category.tags)
                        if (filteredTags.length === 0) return null

                        return (
                            <AccordionItem key={category.key} value={category.key}>
                                <AccordionTrigger className="text-sm">
                                    {category.label} ({filteredTags.length})
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-2">
                                        {filteredTags.map((tag) => (
                                            <div key={tag} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`tag-${tag}`}
                                                    checked={selectedTags.includes(tag)}
                                                    onCheckedChange={() => handleTagToggle(tag)}
                                                />
                                                <label
                                                    htmlFor={`tag-${tag}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                    {tag}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
            </div>

            <div className="pt-2 border-t">
                <Button
                    variant="ghost"
                    onClick={() => {
                        clearTags()
                        setSearchTerm("")
                    }}
                    className="w-full"
                >
                    Clear All Filters
                </Button>
            </div>
        </div>
    )
}
