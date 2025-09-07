import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import { Home, FileText, Moon, Sun, Monitor, ChevronDown } from 'lucide-react'
import { useThemeContext } from '@/components/common/ThemeProvider'
import { converterConfigs } from '@/config/converters'
import { devTools } from '@/config/tools'

const homeNav = { title: 'Página Inicial', href: '/', Icon: Home }

interface SidebarProps {
    className?: string
}

export function Sidebar({ className }: SidebarProps) {
    const location = useLocation()
    const { theme, setThemeMode } = useThemeContext()
    const [open, setOpen] = useState<{ converters: boolean; comparators: boolean; generators: boolean }>({ converters: true, comparators: false, generators: true })

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
                <div className="space-y-3">
                    {/* Home */}
                    <Link to={homeNav.href}>
                        <Button
                            variant={location.pathname === homeNav.href ? 'secondary' : 'ghost'}
                            className={cn('w-full justify-start min-w-0 h-10 px-4 text-sm gap-3 rounded-md', location.pathname === homeNav.href && 'bg-sidebar-accent text-sidebar-accent-foreground')}
                        >
                            <homeNav.Icon className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{homeNav.title}</span>
                        </Button>
                    </Link>

                    <div className="px-2 pt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Ferramentas</div>

                    {/* Conversores (Accordion) */}
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            className="w-full justify-between min-w-0 h-8 px-2 text-xs rounded-md"
                            onClick={() => setOpen(state => ({ ...state, converters: !state.converters }))}
                        >
                            <span className="font-medium text-muted-foreground">Conversores de Dados</span>
                            <ChevronDown className={cn('h-4 w-4 transition-transform', open.converters ? 'rotate-180' : 'rotate-0')} />
                        </Button>
                        <div className={cn('mt-1 space-y-1 pl-2', !open.converters && 'hidden')}>
                            {Object.entries(converterConfigs).map(([key, config]) => {
                                const href = `/${key}-converter`
                                const isActive = location.pathname === href
                                const Icon = config.icon as any
                                return (
                                    <Link key={href} to={href}>
                                        <Button
                                            variant={isActive ? 'secondary' : 'ghost'}
                                            className={cn('w-full justify-start min-w-0 h-9 px-3 text-sm gap-3 rounded-md transition-colors', isActive && 'bg-sidebar-accent text-sidebar-accent-foreground')}
                                        >
                                            {Icon ? <Icon className="h-4 w-4 flex-shrink-0" /> : <div className="h-4 w-4 flex-shrink-0" />}
                                            <span className="truncate">{config.title}</span>
                                        </Button>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {/* Comparadores (Accordion) */}
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            className="w-full justify-between min-w-0 h-8 px-2 text-xs rounded-md"
                            onClick={() => setOpen(state => ({ ...state, comparators: !state.comparators }))}
                        >
                            <span className="font-medium text-muted-foreground">Comparadores</span>
                            <ChevronDown className={cn('h-4 w-4 transition-transform', open.comparators ? 'rotate-180' : 'rotate-0')} />
                        </Button>
                        <div className={cn('mt-1 space-y-1 pl-2', !open.comparators && 'hidden')}>
                            {(() => {
                                const href = '/comparator'
                                const isActive = location.pathname === href
                                return (
                                    <Link to={href}>
                                        <Button
                                            variant={isActive ? 'secondary' : 'ghost'}
                                            className={cn('w-full justify-start min-w-0 h-9 px-3 text-sm gap-3 rounded-md transition-colors', isActive && 'bg-sidebar-accent text-sidebar-accent-foreground')}
                                        >
                                            <FileText className="h-4 w-4 flex-shrink-0" />
                                            <span className="truncate">Comparador de Dados</span>
                                        </Button>
                                    </Link>
                                )
                            })()}
                        </div>
                    </div>

                    {/* Geradores (Accordion) */}
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            className="w-full justify-between min-w-0 h-8 px-2 text-xs rounded-md"
                            onClick={() => setOpen(state => ({ ...state, generators: !state.generators }))}
                        >
                            <span className="font-medium text-muted-foreground">Geradores</span>
                            <ChevronDown className={cn('h-4 w-4 transition-transform', open.generators ? 'rotate-180' : 'rotate-0')} />
                        </Button>
                        <div className={cn('mt-1 space-y-1 pl-2', !open.generators && 'hidden')}>
                            {devTools.filter(t => t.category === 'generator').map(t => {
                                const href = t.path
                                const isActive = location.pathname === href
                                const Icon = t.icon
                                return (
                                    <Link key={t.id} to={href}>
                                        <Button
                                            variant={isActive ? 'secondary' : 'ghost'}
                                            className={cn('w-full justify-start min-w-0 h-9 px-3 text-sm gap-3 rounded-md transition-colors', isActive && 'bg-sidebar-accent text-sidebar-accent-foreground')}
                                        >
                                            {Icon ? <Icon className="h-4 w-4 flex-shrink-0" /> : <div className="h-4 w-4 flex-shrink-0" />}
                                            <span className="truncate">{t.name}</span>
                                        </Button>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
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
