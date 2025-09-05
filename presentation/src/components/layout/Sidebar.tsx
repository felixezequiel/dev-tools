import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
    Home,
    FileText,
    Table,
    Database,
    Settings,
    Moon,
    Sun,
    Monitor
} from 'lucide-react'
import { useThemeContext } from '@/components/common/ThemeProvider'
import type { NavItem } from '@/types'

const navigationItems: NavItem[] = [
    {
        title: 'Página Inicial',
        href: '/',
        icon: 'Home'
    },
    {
        title: 'Conversor JSON',
        href: '/json-converter',
        icon: 'FileText',
        badge: 'Novo'
    },
    {
        title: 'Conversor CSV',
        href: '/csv-converter',
        icon: 'Table'
    },
    {
        title: 'Conversor FormData',
        href: '/formdata-converter',
        icon: 'Database'
    }
]

const iconMap = {
    Home,
    FileText,
    Table,
    Database,
    Settings
}

interface SidebarProps {
    className?: string
}

export function Sidebar({ className }: SidebarProps) {
    const location = useLocation()
    const { theme, setThemeMode } = useThemeContext()

    return (
        <div className={cn('flex h-full flex-col bg-sidebar border-r', className)}>
            {/* Logo/Brand */}
            <div className="flex h-16 items-center border-b px-6">
                <Link to="/" className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <FileText className="h-4 w-4" />
                    </div>
                    <span className="text-lg font-semibold">DevTools</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4">
                {navigationItems.map((item) => {
                    const Icon = iconMap[item.icon as keyof typeof iconMap]
                    const isActive = location.pathname === item.href

                    return (
                        <Link key={item.href} to={item.href}>
                            <Button
                                variant={isActive ? 'secondary' : 'ghost'}
                                className={cn(
                                    'w-full justify-start',
                                    isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
                                )}
                            >
                                {Icon && <Icon className="mr-3 h-4 w-4" />}
                                {item.title}
                                {item.badge && (
                                    <Badge variant="secondary" className="ml-auto">
                                        {item.badge}
                                    </Badge>
                                )}
                            </Button>
                        </Link>
                    )
                })}
            </nav>

            {/* Theme Toggle */}
            <div className="border-t p-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tema</span>
                    <div className="flex space-x-1">
                        <Button
                            variant={theme === 'light' ? 'secondary' : 'ghost'}
                            size="icon"
                            onClick={() => setThemeMode('light')}
                            className="h-8 w-8"
                        >
                            <Sun className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={theme === 'dark' ? 'secondary' : 'ghost'}
                            size="icon"
                            onClick={() => setThemeMode('dark')}
                            className="h-8 w-8"
                        >
                            <Moon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={theme === 'system' ? 'secondary' : 'ghost'}
                            size="icon"
                            onClick={() => setThemeMode('system')}
                            className="h-8 w-8"
                        >
                            <Monitor className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
