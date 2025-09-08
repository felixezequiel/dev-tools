import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import { Home, FileText, ChevronDown } from 'lucide-react'
import { getTranslatedToolsFor } from '@/config/tools'
import { useTranslation } from '@/lib/i18n'

interface SidebarProps {
    className?: string
}

export function Sidebar({ className }: SidebarProps) {
    const location = useLocation()
    const { t } = useTranslation()
    const [open, setOpen] = useState<{ converters: boolean; comparators: boolean; generators: boolean }>({ converters: true, comparators: false, generators: true })

    const homeNav = { title: t('homePage'), href: '/', Icon: Home }
    const tools = getTranslatedToolsFor(t)

    return (
        <div className={cn('flex h-full flex-col bg-sidebar border-r', className)}>
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

                    <div className="px-2 pt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{t('tools')}</div>

                    {/* Conversores (Accordion) */}
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            className="w-full justify-between min-w-0 h-8 px-2 text-xs rounded-md"
                            onClick={() => setOpen(state => ({ ...state, converters: !state.converters }))}
                        >
                            <span className="font-medium text-muted-foreground">{t('dataConverters')}</span>
                            <ChevronDown className={cn('h-4 w-4 transition-transform', open.converters ? 'rotate-180' : 'rotate-0')} />
                        </Button>
                        <div className={cn('mt-1 space-y-1 pl-2', !open.converters && 'hidden')}>
                            {tools.filter(tl => tl.category === 'converter').map(tl => {
                                const href = tl.path
                                const isActive = location.pathname === href
                                const Icon = tl.icon as any
                                return (
                                    <Link key={tl.id} to={href}>
                                        <Button
                                            variant={isActive ? 'secondary' : 'ghost'}
                                            className={cn('w-full justify-start min-w-0 h-9 px-3 text-sm gap-3 rounded-md transition-colors', isActive && 'bg-sidebar-accent text-sidebar-accent-foreground')}
                                        >
                                            {Icon ? <Icon className="h-4 w-4 flex-shrink-0" /> : <div className="h-4 w-4 flex-shrink-0" />}
                                            <span className="truncate">{tl.name}</span>
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
                            <span className="font-medium text-muted-foreground">{t('comparators')}</span>
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
                                            <span className="truncate">{t('dataComparator')}</span>
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
                            <span className="font-medium text-muted-foreground">{t('generators')}</span>
                            <ChevronDown className={cn('h-4 w-4 transition-transform', open.generators ? 'rotate-180' : 'rotate-0')} />
                        </Button>
                        <div className={cn('mt-1 space-y-1 pl-2', !open.generators && 'hidden')}>
                            {tools.filter(tl => tl.category === 'generator').map(tl => {
                                const href = tl.path
                                const isActive = location.pathname === href
                                const Icon = tl.icon as any
                                return (
                                    <Link key={tl.id} to={href}>
                                        <Button
                                            variant={isActive ? 'secondary' : 'ghost'}
                                            className={cn('w-full justify-start min-w-0 h-9 px-3 text-sm gap-3 rounded-md transition-colors', isActive && 'bg-sidebar-accent text-sidebar-accent-foreground')}
                                        >
                                            {Icon ? <Icon className="h-4 w-4 flex-shrink-0" /> : <div className="h-4 w-4 flex-shrink-0" />}
                                            <span className="truncate">{tl.name}</span>
                                        </Button>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}
