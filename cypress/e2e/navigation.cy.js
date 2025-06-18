import { describe, beforeEach, it } from "mocha"
import { cy } from "cypress"
import Cypress from "cypress"

describe("Navigation", () => {
    beforeEach(() => {
        cy.login()
    })

    it("should navigate between pages", () => {
        cy.visit("/")

        // Test dashboard
        cy.contains("Dashboard").should("be.visible")

        // Navigate to recommendations
        cy.get('[data-testid="nav-recommendations"]').click()
        cy.url().should("include", "/recommendations")

        // Navigate to policies
        cy.get('[data-testid="nav-policies"]').click()
        cy.url().should("include", "/policies")

        // Navigate back to dashboard
        cy.get('[data-testid="nav-dashboard"]').click()
        cy.url().should("eq", Cypress.config().baseUrl + "/")
    })

    it("should toggle sidebar on mobile", () => {
        cy.viewport("iphone-x")
        cy.visit("/")

        cy.get('[data-testid="mobile-menu-button"]').click()
        cy.get('[data-testid="sidebar"]').should("be.visible")

        cy.get('[data-testid="sidebar-close"]').click()
        cy.get('[data-testid="sidebar"]').should("not.be.visible")
    })

    it("should toggle dark mode", () => {
        cy.visit("/")
        cy.get('[data-testid="theme-toggle"]').click()
        cy.get("html").should("have.class", "dark")

        cy.get('[data-testid="theme-toggle"]').click()
        cy.get("html").should("not.have.class", "dark")
    })
})
