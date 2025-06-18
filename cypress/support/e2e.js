// Import commands.js using ES2015 syntax:
import "./commands"
import { Cypress } from "cypress"

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
Cypress.on("window:before:load", (win) => {
    const originalFetch = win.fetch
    win.fetch = function (...args) {
        return originalFetch.apply(this, args)
    }
})
