import { useThemeContext } from './ThemeProvider'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface ThemeSwitchProps {
    className?: string
}

export function ThemeSwitch({ className }: ThemeSwitchProps) {
    const { theme, setThemeMode } = useThemeContext()
    const isDark = theme === 'dark'

    const toggle = () => {
        setThemeMode(isDark ? 'light' : 'dark')
    }

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-pressed={isDark}
            className={cn('relative h-9 w-9 rounded-full', className)}
            title={isDark ? 'Switch to light' : 'Switch to dark'}
        >
            {/* Sun icon (visible in light) */}
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
            {/* Moon icon (visible in dark) */}
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
