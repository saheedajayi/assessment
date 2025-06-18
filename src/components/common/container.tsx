import type React from "react"
import { cn } from "../../lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
}

export function Container({ className, maxWidth = "2xl", children, ...props }: ContainerProps) {
    const maxWidthClasses = {
        sm: "max-w-screen-sm",
        md: "max-w-screen-md",
        lg: "max-w-screen-lg",
        xl: "max-w-screen-xl",
        "2xl": "max-w-[2480px]",
        full: "max-w-full",
    }

    return (
        <div className={cn("w-full mx-auto p-5", maxWidthClasses[maxWidth], className)} {...props}>
            {children}
        </div>
    )
}
