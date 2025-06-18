import { describe, beforeEach, it } from "mocha"
import { cy } from "cypress"

describe("Recommendations Dashboard", () => {
    const mockRecommendation = {
        recommendationId: "rec-001",
        title: "Test Recommendation",
        description: "This is a test recommendation",
        score: 85,
        provider: [1], // AWS
        frameworks: [{ name: "CIS AWS", section: "1", subsection: "1.1" }],
        reasons: ["Security improvement"],
        furtherReading: [{ name: "AWS Guide", href: "https://example.com" }],
        totalHistoricalViolations: 150,
        affectedResources: [{ name: "resource-1" }],
        impactAssessment: {
            totalViolations: 50,
            mostImpactedScope: { name: "test-scope", type: "EC2 Instance", count: 25 },
        },
        class: 1, // COMPUTE_RECOMMENDATION
    }

    beforeEach(() => {
        cy.login()
        cy.mockRecommendations([mockRecommendation])
    })

    it("should display recommendations list", () => {
        cy.visit("/recommendations")
        cy.wait("@getRecommendations")

        cy.get('[data-testid="recommendation-card"]').should("have.length", 1)
        cy.contains("Test Recommendation").should("be.visible")
    })

    it("should search recommendations", () => {
        cy.visit("/recommendations")
        cy.wait("@getRecommendations")

        cy.get('[data-testid="search-input"]').type("test")
        cy.get('[data-testid="recommendation-card"]').should("be.visible")
    })

    it("should filter recommendations", () => {
        cy.visit("/recommendations")
        cy.wait("@getRecommendations")

        cy.get('[data-testid="filter-button"]').click()
        cy.get('[data-testid="filter-checkbox-CIS AWS"]').check()
        cy.get('[data-testid="recommendation-card"]').should("be.visible")
    })

    it("should open recommendation modal", () => {
        cy.visit("/recommendations")
        cy.wait("@getRecommendations")

        cy.get('[data-testid="recommendation-card"]').click()
        cy.get('[data-testid="recommendation-modal"]').should("be.visible")
        cy.contains("Test Recommendation").should("be.visible")
    })

    it("should archive recommendation", () => {
        cy.mockArchive()
        cy.visit("/recommendations")
        cy.wait("@getRecommendations")

        cy.get('[data-testid="recommendation-card"]').click()
        cy.get('[data-testid="archive-button"]').click()
        cy.wait("@archiveRecommendation")

        cy.contains("archived successfully").should("be.visible")
    })

    it("should navigate to archived recommendations", () => {
        cy.visit("/recommendations")
        cy.get('[data-testid="archive-link"]').click()
        cy.url().should("include", "/recommendations/archive")
    })

    it("should load more recommendations on scroll", () => {
        const moreRecommendations = Array.from({ length: 20 }, (_, i) => ({
            ...mockRecommendation,
            recommendationId: `rec-${i + 2}`,
            title: `Recommendation ${i + 2}`,
        }))

        cy.mockRecommendations([mockRecommendation, ...moreRecommendations])
        cy.visit("/recommendations")
        cy.wait("@getRecommendations")

        cy.scrollTo("bottom")
        cy.get('[data-testid="recommendation-card"]').should("have.length.greaterThan", 1)
    })
})
