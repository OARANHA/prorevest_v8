import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    // Definindo classes base
    let baseClasses = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
    
    // Adicionando variantes
    if (variant === 'default') {
      baseClasses += " bg-orange-600 text-white hover:bg-orange-700"
    } else if (variant === 'destructive') {
      baseClasses += " bg-destructive text-destructive-foreground hover:bg-destructive/90"
    } else if (variant === 'outline') {
      baseClasses += " border border-input hover:bg-accent hover:text-accent-foreground"
    } else if (variant === 'secondary') {
      baseClasses += " bg-secondary text-secondary-foreground hover:bg-secondary/80"
    } else if (variant === 'ghost') {
      baseClasses += " hover:bg-accent hover:text-accent-foreground"
    } else if (variant === 'link') {
      baseClasses += " underline-offset-4 hover:underline text-primary"
    }
    
    // Adicionando tamanhos
    if (size === 'default') {
      baseClasses += " h-10 py-2 px-4"
    } else if (size === 'sm') {
      baseClasses += " h-9 px-3 rounded-md"
    } else if (size === 'lg') {
      baseClasses += " h-11 px-8 rounded-lg"
    } else if (size === 'icon') {
      baseClasses += " h-10 w-10"
    }
    
    // Combinando classes
    const combinedClasses = `${baseClasses} ${className || ''}`
    
    return (
      <button
        className={combinedClasses}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }