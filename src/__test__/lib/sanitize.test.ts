import { sanitizeHtml, sanitizeText, sanitizeUrl, sanitizeCss, sanitizeJson } from "../../lib/sanitize"

describe("Sanitization Utils", () => {
    describe("sanitizeHtml", () => {
        it("removes script tags", () => {
            const input = '<div>Safe content</div><script>alert("xss")</script>'
            const result = sanitizeHtml(input)
            expect(result).toBe("<div>Safe content</div>")
            expect(result).not.toContain("script")
        })

        it("removes dangerous event handlers", () => {
            const input = '<div onclick="alert(\'xss\')" onload="malicious()">Content</div>'
            const result = sanitizeHtml(input)
            expect(result).toBe("<div>Content</div>")
            expect(result).not.toContain("onclick")
            expect(result).not.toContain("onload")
        })

        it("removes javascript: protocols", () => {
            const input = "<a href=\"javascript:alert('xss')\">Link</a>"
            const result = sanitizeHtml(input)
            expect(result).toBe("<a>Link</a>")
        })

        it("preserves safe HTML", () => {
            const input = '<div class="safe"><p>Safe <strong>content</strong></p></div>'
            const result = sanitizeHtml(input)
            expect(result).toContain("Safe")
            expect(result).toContain("strong")
        })
    })

    describe("sanitizeText", () => {
        it("escapes HTML entities", () => {
            const input = '<script>alert("xss")</script>'
            const result = sanitizeText(input)
            expect(result).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;')
        })

        it("handles special characters", () => {
            const input = "Text with & < > \" ' characters"
            const result = sanitizeText(input)
            expect(result).toContain("&amp;")
            expect(result).toContain("&lt;")
            expect(result).toContain("&gt;")
        })
    })

    describe("sanitizeUrl", () => {
        it("allows safe HTTP URLs", () => {
            const input = "https://example.com/path"
            const result = sanitizeUrl(input)
            expect(result).toBe(input)
        })

        it("allows mailto URLs", () => {
            const input = "mailto:test@example.com"
            const result = sanitizeUrl(input)
            expect(result).toBe(input)
        })

        it("blocks javascript: URLs", () => {
            const input = 'javascript:alert("xss")'
            const result = sanitizeUrl(input)
            expect(result).toBe("#")
        })

        it("blocks data: URLs", () => {
            const input = 'data:text/html,<script>alert("xss")</script>'
            const result = sanitizeUrl(input)
            expect(result).toBe("#")
        })

        it("handles invalid URLs", () => {
            const input = "not-a-url"
            const result = sanitizeUrl(input)
            expect(result).toBe("#")
        })
    })

    describe("sanitizeCss", () => {
        it("removes dangerous CSS functions", () => {
            const input = 'color: red; expression(alert("xss")); background: blue;'
            const result = sanitizeCss(input)
            expect(result).not.toContain("expression")
            expect(result).toContain("color: red")
            expect(result).toContain("background: blue")
        })

        it("removes javascript: in CSS", () => {
            const input = 'background: url(javascript:alert("xss"))'
            const result = sanitizeCss(input)
            expect(result).not.toContain("javascript:")
        })

        it("removes @import statements", () => {
            const input = '@import url("malicious.css"); color: red;'
            const result = sanitizeCss(input)
            expect(result).not.toContain("@import")
            expect(result).toContain("color: red")
        })
    })

    describe("sanitizeJson", () => {
        it("sanitizes valid JSON objects", () => {
            const input = { name: "test", value: 123 }
            const result = sanitizeJson(input)
            expect(result).toEqual(input)
        })

        it("removes functions from objects", () => {
            const input = {
                name: "test",
                malicious: () => alert("xss"),
                safe: "value",
            }
            const result = sanitizeJson(input)
            expect(result).toEqual({ name: "test", safe: "value" })
            expect(result).not.toHaveProperty("malicious")
        })

        it("handles invalid JSON", () => {
            const input = { circular: {} }
            input.circular = input // Create circular reference
            const result = sanitizeJson(input)
            expect(result).toBeNull()
        })

        it("handles primitive values", () => {
            expect(sanitizeJson("string")).toBe("string")
            expect(sanitizeJson(123)).toBe(123)
            expect(sanitizeJson(true)).toBe(true)
            expect(sanitizeJson(null)).toBe(null)
        })
    })
})
