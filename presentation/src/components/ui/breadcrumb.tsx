import * as React from 'react'

import { cn } from '@/lib/utils'

export function Breadcrumb({ className, ...props }: React.ComponentProps<'nav'>) {
    return (
        <nav aria-label="breadcrumb" className={cn('w-full', className)} {...props} />
    )
}

export function BreadcrumbList({ className, ...props }: React.ComponentProps<'ol'>) {
    return (
        <ol className={cn('flex items-center text-sm text-muted-foreground', className)} {...props} />
    )
}

export function BreadcrumbItem({ className, ...props }: React.ComponentProps<'li'>) {
    return <li className={cn('inline-flex items-center gap-1', className)} {...props} />
}

export function BreadcrumbLink({ className, ...props }: React.ComponentProps<'a'>) {
    return (
        <a className={cn('hover:text-foreground transition-colors', className)} {...props} />
    )
}

export function BreadcrumbPage({ className, ...props }: React.ComponentProps<'span'>) {
    return <span className={cn('font-medium text-foreground', className)} {...props} />
}

export function BreadcrumbSeparator({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span role="presentation" aria-hidden="true" className={cn('mx-1 text-muted-foreground', className)} {...props}>
            /
        </span>
    )
}

export function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span className={cn('mx-1', className)} {...props}>
            …
        </span>
    )
}


