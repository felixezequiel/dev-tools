import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BreadcrumbItem, PageHeaderProps } from '@/types'

interface BreadcrumbProps {
    items: BreadcrumbItem[]
}

function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Link
                to="/"
                className="flex items-center hover:text-foreground transition-colors"
            >
                <Home className="h-4 w-4" />
            </Link>
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    <ChevronRight className="h-4 w-4 mx-1" />
                    {item.path && !item.isActive ? (
                        <Link
                            to={item.path}
                            className="hover:text-foreground transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className={cn(item.isActive && 'text-foreground font-medium')}>
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    )
}

export function PageHeader({
    title,
    description,
    breadcrumbs,
    actions,
    className
}: PageHeaderProps & { className?: string }) {
    return (
        <div className={cn('space-y-4 pb-6', className)}>
            {breadcrumbs && <Breadcrumb items={breadcrumbs} />}

            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    {description && (
                        <p className="text-muted-foreground">{description}</p>
                    )}
                </div>

                {actions && (
                    <div className="flex items-center space-x-2">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    )
}
