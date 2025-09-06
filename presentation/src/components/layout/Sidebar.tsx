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
    Monitor,
    FileCode,
    FileJson,
    FileSpreadsheet
} from 'lucide-react'
import { useThemeContext } from '@/components/common/ThemeProvider'
import type { NavItem } from '@/types'
import { converterConfigs } from '@/config/converters'

const navigationItems: NavItem[] = [
    {
        title: 'Página Inicial',
        href: '/',
        icon: 'Home'
    },
    ...Object.entries(converterConfigs).map(([key, config]) => ({
        title: config.title,
        href: `/${key}-converter`,
        iconComponent: config.icon
    }))
]

const iconMap = {
    Home,
    FileText,
    Table,
    Database,
    Settings,
    FileCode,
    FileJson,
    FileSpreadsheet
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
            <nav className="flex-1 p-4">
                {(() => {
                    const homeItem = navigationItems[0]
                    const toolItems = navigationItems.slice(1)
                    const HomeIcon = iconMap[homeItem.icon as keyof typeof iconMap]
                    return (
                        <div className="space-y-3">
                            <Link key={homeItem.href} to={homeItem.href}>
                                <Button
                                    variant={location.pathname === homeItem.href ? 'secondary' : 'ghost'}
                                    className={cn('w-full justify-start min-w-0 h-10 px-4 text-sm gap-3 rounded-md', location.pathname === homeItem.href && 'bg-sidebar-accent text-sidebar-accent-foreground')}
                                >
                                    {HomeIcon ? <HomeIcon className="h-4 w-4 flex-shrink-0" /> : <div className="h-4 w-4 flex-shrink-0" />}
                                    <span className="truncate">{homeItem.title}</span>
                                </Button>
                            </Link>

                            <div className="px-2 pt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Ferramentas</div>

                            <div className="space-y-2">
                                {toolItems.map((item) => {
                                    const Icon = (item.iconComponent as any) || iconMap[item.icon as keyof typeof iconMap]
                                    const isActive = location.pathname === item.href
                                    return (
                                        <Link key={item.href} to={item.href}>
                                            <Button
                                                variant={isActive ? 'secondary' : 'ghost'}
                                                className={cn('w-full justify-start min-w-0 h-10 px-4 text-sm gap-3 rounded-md transition-colors', isActive && 'bg-sidebar-accent text-sidebar-accent-foreground')}
                                            >
                                                {Icon ? <Icon className="h-4 w-4 flex-shrink-0" /> : <div className="h-4 w-4 flex-shrink-0" />}
                                                <span className="truncate">{item.title}</span>
                                                {item.badge && (
                                                    <Badge variant="secondary" className="ml-auto">{item.badge}</Badge>
                                                )}
                                            </Button>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })()}
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
