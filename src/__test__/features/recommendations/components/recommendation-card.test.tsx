"use client"

import { render, screen, fireEvent } from "@testing-library/react"
import { RecommendationCard } from "../../../../features/recommendations/components/recommendation-card"
import { RecommendationFactory } from "../../../factories/recommendation-factory"
import { jest } from "@jest/globals"

describe("RecommendationCard", () => {
    const mockOnClick = jest.fn()
    const mockOnQuickArchive = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("renders recommendation information correctly", () => {
        const recommendation = RecommendationFactory.create({
            title: "Test Recommendation",
            description: "This is a test recommendation for unit testing",
            impactAssessment: {
                totalViolations: 50,
                mostImpactedScope: {
                    name: "test-scope",
                    type: "EC2 Instance",
                    count: 25,
                },
            },
        })

        render(<RecommendationCard recommendation={recommendation} onClick={mockOnClick} />)

        expect(screen.getByText("Test Recommendation")).toBeInTheDocument()
        expect(screen.getByText("This is a test recommendation for unit testing")).toBeInTheDocument()
        expect(screen.getByText("~50 violations/month")).toBeInTheDocument()
    })

    it("calls onClick when card is clicked", () => {
        const recommendation = RecommendationFactory.create()

        render(<RecommendationCard recommendation={recommendation} onClick={mockOnClick} />)

        fireEvent.click(screen.getByTestId("recommendation-card"))
        expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it("shows archive button for non-archived recommendations", () => {
        const recommendation = RecommendationFactory.create()

        render(
            <RecommendationCard
                recommendation={recommendation}
                onClick={mockOnClick}
                onQuickArchive={mockOnQuickArchive}
                archived={false}
            />,
        )

        expect(screen.getByTestId("quick-archive-button")).toBeInTheDocument()
    })

    it("does not show archive button for archived recommendations", () => {
        const recommendation = RecommendationFactory.createArchived()

        render(<RecommendationCard recommendation={recommendation} onClick={mockOnClick} archived={true} />)

        expect(screen.queryByTestId("quick-archive-button")).not.toBeInTheDocument()
    })

    it("calls onQuickArchive when archive button is clicked", () => {
        const recommendation = RecommendationFactory.create()

        render(
            <RecommendationCard recommendation={recommendation} onClick={mockOnClick} onQuickArchive={mockOnQuickArchive} />,
        )

        fireEvent.click(screen.getByTestId("quick-archive-button"))
        expect(mockOnQuickArchive).toHaveBeenCalledWith(recommendation.recommendationId)
        expect(mockOnClick).not.toHaveBeenCalled() // Should not trigger card click
    })

    it("displays correct number of frameworks with overflow indicator", () => {
        const recommendation = RecommendationFactory.create({
            frameworks: [
                { name: "Framework 1", section: "1", subsection: "1.1" },
                { name: "Framework 2", section: "2", subsection: "2.1" },
                { name: "Framework 3", section: "3", subsection: "3.1" },
                { name: "Framework 4", section: "4", subsection: "4.1" },
            ],
        })

        render(<RecommendationCard recommendation={recommendation} onClick={mockOnClick} />)

        expect(screen.getByText("Framework 1")).toBeInTheDocument()
        expect(screen.getByText("Framework 2")).toBeInTheDocument()
        expect(screen.getByText("+2")).toBeInTheDocument()
    })

    it("applies archived styling when archived prop is true", () => {
        const recommendation = RecommendationFactory.createArchived()

        render(<RecommendationCard recommendation={recommendation} onClick={mockOnClick} archived={true} />)

        const iconSection = document.querySelector(".bg-muted")
        expect(iconSection).toBeInTheDocument()
    })

    it("handles high-score recommendations correctly", () => {
        const recommendation = RecommendationFactory.createHighScore()

        render(<RecommendationCard recommendation={recommendation} onClick={mockOnClick} />)

        // Should display the recommendation without errors
        expect(screen.getByTestId("recommendation-card")).toBeInTheDocument()
    })

    it("handles AWS-specific recommendations", () => {
        const recommendation = RecommendationFactory.createAWS({
            title: "AWS Security Recommendation",
        })

        render(<RecommendationCard recommendation={recommendation} onClick={mockOnClick} />)

        expect(screen.getByText("AWS Security Recommendation")).toBeInTheDocument()
        expect(screen.getByText("CIS AWS")).toBeInTheDocument()
    })
})

