
export function sanitizeHtml(html: string): string {

    const temp = document.createElement("div")
    temp.innerHTML = html


    const scripts = temp.querySelectorAll("script")
    scripts.forEach((script) => script.remove())


    const dangerousAttributes = ["onclick", "onload", "onerror", "onmouseover", "onfocus", "onblur"]
    const allElements = temp.querySelectorAll("*")

    allElements.forEach((element) => {
        dangerousAttributes.forEach((attr) => {
            if (element.hasAttribute(attr)) {
                element.removeAttribute(attr)
            }
        })


        const href = element.getAttribute("href")
        if (href && href.toLowerCase().startsWith("javascript:")) {
            element.removeAttribute("href")
        }

        const src = element.getAttribute("src")
        if (src && src.toLowerCase().startsWith("javascript:")) {
            element.removeAttribute("src")
        }
    })

    return temp.innerHTML
}


export function sanitizeText(text: string): string {
    const temp = document.createElement("div")
    temp.textContent = text
    return temp.innerHTML
}


export function sanitizeUrl(url: string): string {
    try {
        const parsed = new URL(url)


        const allowedProtocols = ["http:", "https:", "mailto:"]
        if (!allowedProtocols.includes(parsed.protocol)) {
            return "#"
        }

        return parsed.toString()
    } catch {

        return "#"
    }
}


export function sanitizeCss(css: string): string {

    const dangerous = [
        "expression",
        "javascript:",
        "vbscript:",
        "data:",
        "@import",
        "behavior:",
        "-moz-binding",
        "binding:",
    ]

    let sanitized = css
    dangerous.forEach((danger) => {
        const regex = new RegExp(danger, "gi")
        sanitized = sanitized.replace(regex, "")
    })

    return sanitized
}

export function sanitizeJson<T>(data: unknown): T | null {
    try {

        const jsonString = JSON.stringify(data)
        return JSON.parse(jsonString) as T
    } catch {
        return null
    }
}
