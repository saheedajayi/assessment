import { render, screen, fireEvent } from "@testing-library/react"
import { RecommendationCard } from "../../../../features/recommendations/components/recommendation-card"
import { CloudProvider, RecommendationClass } from "../../../../types/recommendations"
import type { Recommendation } from "../../../../types/recommendations"


const mockRecommendation: Recommendation = {
    tenantId: "tenant-001",
    recommendationId: "rec-001",
    title: "Test Recommendation",
    slug: "test-recommendation",
    description: "This is a test recommendation for unit testing",
    score: 85,
    provider: [CloudProvider.AWS],
    frameworks: [
        { name: "CIS AWS", section: "1", subsection: "1.1" },
        { name: "NIST 800-53", section: "AC", subsection: "AC-1" },
    ],
    reasons: ["Security improvement", "Compliance requirement"],
    furtherReading: [{ name: "AWS Guide", href: "https://example.com" }],
    totalHistoricalViolations: 150,
    affectedResources: [{ name: "resource-1" }, { name: "resource-2" }],
    impactAssessment: {
        totalViolations: 50,
        mostImpactedScope: {
            name: "test-scope",
            type: "EC2 Instance",
            count: 25,
        },
    },
    class: RecommendationClass.COMPUTE_RECOMMENDATION,
}

describe("RecommendationCard", () => {
    const mockOnClick = jest.fn()
    const mockOnQuickArchive = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("renders recommendation information correctly", () => {
        render(<RecommendationCard recommendation={mockRecommendation} onClick={mockOnClick} />)

        expect(screen.getByText("Test Recommendation")).toBeInTheDocument()
        expect(screen.getByText("This is a test recommendation for unit testing")).toBeInTheDocument()
        expect(screen.getByText("CIS AWS")).toBeInTheDocument()
        expect(screen.getByText("NIST 800-53")).toBeInTheDocument()
        expect(screen.getByText("~50 violations/month")).toBeInTheDocument()
    })

    it("calls onClick when card is clicked", () => {
        render(<RecommendationCard recommendation={mockRecommendation} onClick={mockOnClick} />)

        fireEvent.click(screen.getByTestId("recommendation-card"))
        expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it("shows archive button for non-archived recommendations", () => {
        render(
            <RecommendationCard
                recommendation={mockRecommendation}
                onClick={mockOnClick}
                onQuickArchive={mockOnQuickArchive}
                archived={false}
            />,
        )

        expect(screen.getByTestId("quick-archive-button")).toBeInTheDocument()
    })

    it("does not show archive button for archived recommendations", () => {
        render(<RecommendationCard recommendation={mockRecommendation} onClick={mockOnClick} archived={true} />)

        expect(screen.queryByTestId("quick-archive-button")).not.toBeInTheDocument()
    })

    it("calls onQuickArchive when archive button is clicked", () => {
        render(
            <RecommendationCard
                recommendation={mockRecommendation}
                onClick={mockOnClick}
                onQuickArchive={mockOnQuickArchive}
            />,
        )

        fireEvent.click(screen.getByTestId("quick-archive-button"))
        expect(mockOnQuickArchive).toHaveBeenCalledWith("rec-001")
        expect(mockOnClick).not.toHaveBeenCalled() // Should not trigger card click
    })

    it("displays correct number of frameworks with overflow indicator", () => {
        const recommendationWithManyFrameworks = {
            ...mockRecommendation,
            frameworks: [
                { name: "Framework 1", section: "1", subsection: "1.1" },
                { name: "Framework 2", section: "2", subsection: "2.1" },
                { name: "Framework 3", section: "3", subsection: "3.1" },
                { name: "Framework 4", section: "4", subsection: "4.1" },
            ],
        }

        render(<RecommendationCard recommendation={recommendationWithManyFrameworks} onClick={mockOnClick} />)

        expect(screen.getByText("Framework 1")).toBeInTheDocument()
        expect(screen.getByText("Framework 2")).toBeInTheDocument()
        expect(screen.getByText("+2")).toBeInTheDocument() // Shows overflow indicator
    })

    it("applies archived styling when archived prop is true", () => {
        render(<RecommendationCard recommendation={mockRecommendation} onClick={mockOnClick} archived={true} />)

        const iconSection = document.querySelector(".bg-muted")
        expect(iconSection).toBeInTheDocument()
    })
})
