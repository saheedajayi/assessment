// Custom commands for the application

// Import Cypress
const Cypress = require("cypress")

// Login command
Cypress.Commands.add("login", (username = "admin", password = "password") => {
    const cy = Cypress.cy // Declare cy variable
    cy.visit("/login")
    cy.get('[data-testid="username-input"]').type(username)
    cy.get('[data-testid="password-input"]').type(password)
    cy.get('[data-testid="login-button"]').click()
    cy.url().should("not.include", "/login")
})

// Mock API responses
Cypress.Commands.add("mockRecommendations", (recommendations = []) => {
    const cy = Cypress.cy // Declare cy variable
    cy.intercept("GET", "/recommendations*", {
        statusCode: 200,
        body: {
            data: recommendations,
            pagination: {
                cursor: { next: null },
                totalItems: recommendations.length,
            },
            availableTags: {
                frameworks: ["CIS AWS", "NIST 800-53"],
                providers: ["AWS", "AZURE"],
                classes: ["COMPUTE_RECOMMENDATION"],
                reasons: ["Security improvement"],
            },
        },
    }).as("getRecommendations")
})

// Archive recommendation
Cypress.Commands.add("mockArchive", () => {
    const cy = Cypress.cy // Declare cy variable
    cy.intercept("POST", "/recommendations/*/archive", {
        statusCode: 200,
        body: { success: true },
    }).as("archiveRecommendation")
})

// Unarchive recommendation
Cypress.Commands.add("mockUnarchive", () => {
    const cy = Cypress.cy // Declare cy variable
    cy.intercept("POST", "/recommendations/*/unarchive", {
        statusCode: 200,
        body: { success: true },
    }).as("unarchiveRecommendation")
})
