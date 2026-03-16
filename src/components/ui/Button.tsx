import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-zora-ink)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-widest",
          {
            "bg-[var(--color-zora-ink)] text-[var(--color-zora-oat)] hover:bg-[var(--color-zora-ink)]/90 shadow-sm": variant === "default",
            "bg-[var(--color-zora-clay)] text-[var(--color-zora-ink)] hover:bg-[var(--color-zora-clay)]/80 shadow-sm": variant === "secondary",
            "border-2 border-[var(--color-zora-ink)] bg-transparent hover:bg-[var(--color-zora-blush)] text-[var(--color-zora-ink)] hover:border-[var(--color-zora-blush)]": variant === "outline",
            "hover:bg-[var(--color-zora-blush)] text-[var(--color-zora-ink)]": variant === "ghost",
            "text-[var(--color-zora-ink)] underline-offset-4 hover:underline": variant === "link",
            "h-12 px-8 py-2": size === "default",
            "h-9 px-4": size === "sm",
            "h-14 px-10 text-base": size === "lg",
            "h-12 w-12": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
