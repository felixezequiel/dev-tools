import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react'

interface HeaderState {
    title: string
    subtitle?: string
    setHeader: (title: string, subtitle?: string) => void
}

const Ctx = createContext<HeaderState | undefined>(undefined)

export function HeaderProvider({ children, defaultTitle, defaultSubtitle }: { children: ReactNode; defaultTitle: string; defaultSubtitle?: string }) {
    const [title, setTitle] = useState(defaultTitle)
    const [subtitle, setSubtitle] = useState<string | undefined>(defaultSubtitle)

    // Keep internal state in sync when defaults change (e.g., language switch)
    useEffect(() => {
        setTitle(defaultTitle)
    }, [defaultTitle])

    useEffect(() => {
        setSubtitle(defaultSubtitle)
    }, [defaultSubtitle])

    const value = useMemo<HeaderState>(() => ({
        title,
        subtitle,
        setHeader: (t: string, s?: string) => {
            setTitle(t)
            setSubtitle(s)
        },
    }), [title, subtitle])

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useHeader() {
    const ctx = useContext(Ctx)
    if (!ctx) throw new Error('useHeader must be used within HeaderProvider')
    return ctx
}
