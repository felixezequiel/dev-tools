import { useState, useEffect } from 'react'
import type { Theme } from '@/types'

const THEME_KEY = 'devtools-theme'

export function useTheme() {
    const [theme, setTheme] = useState<Theme['mode']>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(THEME_KEY)
            if (stored === 'light' || stored === 'dark') {
                return stored
            }
            // Detect system preference
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        return 'light'
    })

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')

        const applyTheme = (themeToApply: 'light' | 'dark') => {
            root.classList.remove('light', 'dark')
            root.classList.add(themeToApply)
        }

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            const systemTheme = mediaQuery.matches ? 'dark' : 'light'
            applyTheme(systemTheme)

            // Listen for system theme changes
            const handleChange = (e: MediaQueryListEvent) => {
                const newSystemTheme = e.matches ? 'dark' : 'light'
                applyTheme(newSystemTheme)
            }

            mediaQuery.addEventListener('change', handleChange)
            return () => mediaQuery.removeEventListener('change', handleChange)
        } else {
            applyTheme(theme)
        }
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => {
            const next = prev === 'light' ? 'dark' : 'light'
            localStorage.setItem(THEME_KEY, next)
            return next
        })
    }

    const setThemeMode = (mode: Theme['mode']) => {
        setTheme(mode)
        localStorage.setItem(THEME_KEY, mode)
    }

    return {
        theme,
        toggleTheme,
        setThemeMode,
        isDark: theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
}
