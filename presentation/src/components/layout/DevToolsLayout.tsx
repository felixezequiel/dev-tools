import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home } from 'lucide-react'
import type { BreadcrumbItem as AppBreadcrumbItem } from '@/types'
import {
    Breadcrumb as UIBreadcrumb,
    BreadcrumbList,
    BreadcrumbItem as UIBreadcrumbItem,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Sidebar } from './Sidebar'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { getTranslatedToolsFor } from '@/config/tools'
import { ThemeSwitch } from '@/components/common/ThemeSwitch'
import { LanguageSelector } from '@/components/ui/LanguageSelector'
import { HeaderProvider, useHeader } from './HeaderContext'
import { FileText } from 'lucide-react'
import { AdSlot } from '@/components/ads/AdSlot'

interface DevToolsLayoutProps {
    className?: string
}

function HeaderBar() {
    const { t } = useTranslation()
    const { title, subtitle } = useHeader()
    return (
        <header className="area-header border-b">
            <div className="grid items-stretch grid-cols-1 md:grid-cols-[15rem_minmax(0,1fr)]">
                {/* Left column aligned with sidebar */}
                <div className="hidden md:flex items-center h-16 px-4 md:px-6 lg:px-8 md:border-r">
                    <Link to="/" className="flex items-center space-x-2 min-w-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <FileText className="h-4 w-4" />
                        </div>
                        <span className="text-lg font-semibold truncate">{t('brandName')}</span>
                    </Link>
                </div>
                {/* Right column: page title/subtitle and controls */}
                <div className="flex items-center justify-between h-16 px-6 md:px-8 lg:px-16 min-w-0">
                    <div className="min-w-0">
                        <h1 className="text-lg font-semibold truncate">{title || t('brandName')}</h1>
                        <p className="text-xs text-muted-foreground truncate">{subtitle || t('modernToolsDescription')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeSwitch />
                        <LanguageSelector variant="inline" />
                    </div>
                </div>
            </div>
        </header>
    )
}

function BreadcrumbNav({ items }: { items: AppBreadcrumbItem[] }) {
    if (!items || items.length === 0) return null
    return (
        <UIBreadcrumb className="mb-4">
            <BreadcrumbList>
                <UIBreadcrumbItem>
                    <Link to="/" aria-label="Home" className="hover:text-foreground transition-colors">
                        <Home className="h-4 w-4" />
                    </Link>
                </UIBreadcrumbItem>

                {items.map((item, index) => (
                    <React.Fragment key={`${item.label}-${index}`}>
                        <BreadcrumbSeparator />
                        <UIBreadcrumbItem>
                            {item.path && !item.isActive ? (
                                <Link to={item.path} className="hover:text-foreground transition-colors">{item.label}</Link>
                            ) : (
                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            )}
                        </UIBreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </UIBreadcrumb>
    )
}

function HeaderSync() {
    const location = useLocation()
    const { t } = useTranslation()
    const { setHeader } = useHeader()

    // Sync header with current route for non-converter tools (comparators/generators)
    React.useEffect(() => {
        const tools = getTranslatedToolsFor(t)
        const current = tools.find(tl => tl.path === location.pathname)
        if (current && current.category !== 'converter') {
            setHeader(current.name, current.description)
        }
        // Converters manage their own header inside each page
    }, [location.pathname, t, setHeader])

    return null
}

export function DevToolsLayout({ className }: DevToolsLayoutProps) {
    const { t } = useTranslation()
    const location = useLocation()

    const segments = location.pathname.split('/').filter(Boolean)
    const tools = getTranslatedToolsFor(t)
    const pathToName = new Map<string, string>(tools.map(tool => [tool.path, tool.name]))
    const breadcrumbs: AppBreadcrumbItem[] = segments.map((segment, index) => {
        const path = '/' + segments.slice(0, index + 1).join('/')
        const isLast = index === segments.length - 1
        const translated = pathToName.get(path)
        const label = translated || segment.replace(/[-_]/g, ' ')

        console.log('Breadcrumb - Label:', label, 'Path:', path, 'Is Last:', isLast)

        return { label, path: isLast ? undefined : path, isActive: isLast }
    })

    return (
        <HeaderProvider defaultTitle={t('brandName')} defaultSubtitle={t('modernToolsDescription')}>
            <div className={cn('layout-grid bg-background', className)}>
                {/* Sidebar column */}
                <aside className="area-aside hidden md:block h-full border-r">
                    <Sidebar />
                    {/* Sidebar sticky ad slot */}
                </aside>

                {/* Right column: header + content */}
                <HeaderBar />
                <HeaderSync />
                <main className="area-main overflow-y-auto py-6 px-6 md:px-8 lg:px-16">
                    {/* Header banner ad slot with reserved height to avoid CLS */}

                    <AdSlot slot="header_banner" />

                    {/* Breadcrumb */}
                    <BreadcrumbNav items={breadcrumbs} />

                    <Outlet />
                </main>
            </div>
        </HeaderProvider>
    )
}
