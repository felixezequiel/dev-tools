import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ArrowRight, FileText, Table, Database } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ToolCardProps } from '@/types'

const iconMap = {
    'FileText': FileText,
    'Table': Table,
    'Database': Database
}

export function ToolCard({ tool, onClick, className }: ToolCardProps) {
    const Icon = tool.iconComponent || iconMap[tool.icon as keyof typeof iconMap]

    const content = (
        <Card className={cn('group cursor-pointer transition-all hover:shadow-lg', className)}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {Icon && (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Icon className="h-5 w-5" />
                            </div>
                        )}
                        <div>
                            <CardTitle className="text-lg">{tool.name}</CardTitle>
                            <Badge variant="secondary" className="text-xs">
                                {tool.category}
                            </Badge>
                        </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-sm">
                    {tool.description}
                </CardDescription>
            </CardContent>
        </Card>
    )

    if (onClick) {
        return (
            <div onClick={onClick}>
                {content}
            </div>
        )
    }

    return (
        <Link to={tool.path}>
            {content}
        </Link>
    )
}
