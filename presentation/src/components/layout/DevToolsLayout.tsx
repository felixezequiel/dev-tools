import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/common/ThemeToggle'

interface DevToolsLayoutProps {
    className?: string
}

export function DevToolsLayout({ className }: DevToolsLayoutProps) {
    return (
        <div className={cn('flex h-screen bg-background', className)}>
            {/* Sidebar */}
            <div className="hidden md:flex md:w-64 md:flex-col">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mx-auto max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Floating Theme Toggle */}
            <ThemeToggle variant="floating" />
        </div>
    )
}
