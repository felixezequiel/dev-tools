export interface Tool {
    id: string
    name: string
    description: string
    icon?: string
    iconComponent?: any
    path: string
    category: 'converter' | 'formatter' | 'validator'
}

export interface ConversionResult {
    success: boolean
    data?: any
    error?: string
    executionTime?: number
}

export interface FileUpload {
    file: File
    content: string
    size: number
    type: string
}

export interface Theme {
    mode: 'light' | 'dark' | 'system'
}

export interface BreadcrumbItem {
    label: string
    path?: string
    isActive?: boolean
}

export interface NavItem {
    title: string
    href: string
    icon?: string
    iconComponent?: any
    badge?: string
    children?: NavItem[]
}

export interface PageHeaderProps {
    title: string
    description?: string
    breadcrumbs?: BreadcrumbItem[]
    actions?: React.ReactNode
}

export interface ToolCardProps {
    tool: Tool
    onClick?: () => void
    className?: string
}
