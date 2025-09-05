import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useThemeContext } from './ThemeProvider'
import { Moon, Sun, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
    variant?: 'button' | 'floating' | 'icon'
    className?: string
}

export function ThemeToggle({ variant = 'button', className }: ThemeToggleProps) {
    const { theme, setThemeMode } = useThemeContext()

    const getIcon = () => {
        switch (theme) {
            case 'light':
                return <Sun className="h-4 w-4" />
            case 'dark':
                return <Moon className="h-4 w-4" />
            case 'system':
                return <Monitor className="h-4 w-4" />
            default:
                return <Sun className="h-4 w-4" />
        }
    }

    const cycleTheme = () => {
        if (theme === 'light') {
            setThemeMode('dark')
        } else if (theme === 'dark') {
            setThemeMode('system')
        } else {
            setThemeMode('light')
        }
    }

    if (variant === 'floating') {
        return (
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={cn(
                    'fixed bottom-6 right-6 z-50',
                    className
                )}
            >
                <Button
                    onClick={cycleTheme}
                    size="icon"
                    className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                >
                    <motion.div
                        key={theme}
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {getIcon()}
                    </motion.div>
                </Button>
            </motion.div>
        )
    }

    if (variant === 'icon') {
        return (
            <Button
                onClick={cycleTheme}
                variant="ghost"
                size="icon"
                className={className}
            >
                <motion.div
                    key={theme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {getIcon()}
                </motion.div>
            </Button>
        )
    }

    return (
        <Button
            onClick={cycleTheme}
            variant="outline"
            className={cn('gap-2', className)}
        >
            <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                {getIcon()}
            </motion.div>
            <span className="capitalize">{theme}</span>
        </Button>
    )
}
