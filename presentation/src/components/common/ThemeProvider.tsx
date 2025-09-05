import { createContext, useContext, ReactNode } from 'react'
import { useTheme } from '@/hooks/useTheme'
import type { Theme } from '@/types'

interface ThemeContextType {
    theme: Theme['mode']
    toggleTheme: () => void
    setThemeMode: (mode: Theme['mode']) => void
    isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
    children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const themeValues = useTheme()

    return (
        <ThemeContext.Provider value={themeValues}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useThemeContext() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useThemeContext must be used within a ThemeProvider')
    }
    return context
}
