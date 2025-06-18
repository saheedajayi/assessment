import { describe, beforeEach, it } from "mocha"
import { cy } from "cypress"
import Cypress from "cypress"

describe("Authentication", () => {
    beforeEach(() => {
        // Mock login endpoint
        cy.intercept("POST", "/login", {
            statusCode: 200,
            body: { token: "mock-jwt-token" },
        }).as("login")
    })

    it("should display login form", () => {
        cy.visit("/login")
        cy.get('[data-testid="username-input"]').should("be.visible")
        cy.get('[data-testid="password-input"]').should("be.visible")
        cy.get('[data-testid="login-button"]').should("be.visible")
    })

    it("should login successfully with valid credentials", () => {
        cy.visit("/login")
        cy.get('[data-testid="username-input"]').type("admin")
        cy.get('[data-testid="password-input"]').type("password")
        cy.get('[data-testid="login-button"]').click()

        cy.wait("@login")
        cy.url().should("eq", Cypress.config().baseUrl + "/")
    })

    it("should show error with invalid credentials", () => {
        cy.intercept("POST", "/login", {
            statusCode: 401,
            body: { error: "Invalid credentials" },
        }).as("loginError")

        cy.visit("/login")
        cy.get('[data-testid="username-input"]').type("wrong")
        cy.get('[data-testid="password-input"]').type("wrong")
        cy.get('[data-testid="login-button"]').click()

        cy.wait("@loginError")
        cy.contains("Invalid credentials").should("be.visible")
    })

    it("should redirect to login when not authenticated", () => {
        cy.visit("/")
        cy.url().should("include", "/login")
    })

    it("should logout successfully", () => {
        cy.login()
        cy.get('[data-testid="logout-button"]').click()
        cy.url().should("include", "/login")
    })
})
