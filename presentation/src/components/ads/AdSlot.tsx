import React from 'react'
import { adsConfig, isAdEnabled, getAdUnitKey, type AdPlacement } from '@/config/ads'
import { cn } from '@/lib/utils'

interface AdSlotProps {
    slot: AdPlacement
    className?: string
    style?: React.CSSProperties
}

function useAdVisibility(slot: AdPlacement) {
    const [visible, setVisible] = React.useState<boolean>(() => isAdEnabled(slot))

    React.useEffect(() => {
        setVisible(isAdEnabled(slot))
        const handler = () => setVisible(isAdEnabled(slot))
        window.addEventListener('resize', handler)
        return () => window.removeEventListener('resize', handler)
    }, [slot])

    const dismiss = React.useCallback(() => {
        // Hide only during current mount/session
        setVisible(false)
    }, [])

    return { visible, dismiss }
}

function DummyAd({ slot, onClick }: { slot: AdPlacement; onClick?: () => void }) {
    return (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault()
                onClick?.()
            }}
            className="group block w-full"
            aria-label={`Advertisement ${slot}`}
        >
            <div className="relative overflow-hidden rounded-md border bg-muted/40 hover:bg-muted transition-colors">
                <div className="p-3 flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-gradient-to-br from-primary/20 to-primary/40" />
                    <div className="flex-1 min-w-0">
                        <div className="text-xs uppercase tracking-wide text-muted-foreground">Publicidade</div>
                        <div className="text-sm font-medium truncate">Conteúdo patrocinado</div>
                        <div className="text-xs text-muted-foreground truncate">Clique para saber mais</div>
                    </div>
                </div>
            </div>
        </a>
    )
}

export function AdSlot({ slot, className, style }: AdSlotProps) {
    const adsEnabled = adsConfig.enabled
    const { visible, dismiss } = useAdVisibility(slot)
    const containerRef = React.useRef<HTMLDivElement | null>(null)
    const insRef = React.useRef<HTMLModElement | null>(null)
    const [collapsed, setCollapsed] = React.useState<boolean>(false)

    const handleClick = () => {
        try {
            // Basic click tracking hook (no external dependency)
            window.dispatchEvent(new CustomEvent('ad:click', { detail: { slot, provider: adsConfig.provider } }))
        } catch { }
    }

    // Collapse placeholder if ad doesn't render shortly (prevents blank space when no fill)
    React.useEffect(() => {
        if (!visible || !adsEnabled) return
        if (adsConfig.provider !== 'adsense') return
        const timer = window.setTimeout(() => {
            const h = insRef.current?.clientHeight ?? 0
            if (h < 20) setCollapsed(true)
        }, 2500)
        let observer: MutationObserver | null = null
        if (typeof MutationObserver !== 'undefined' && insRef.current) {
            observer = new MutationObserver(() => {
                const h = insRef.current?.clientHeight ?? 0
                if (h >= 20) setCollapsed(false)
            })
            observer.observe(insRef.current, { childList: true, subtree: true })
        }
        return () => {
            window.clearTimeout(timer)
            observer?.disconnect()
        }
    }, [slot, visible, adsEnabled])

    // Initialize AdSense rendering once per mount for configured slots
    React.useEffect(() => {
        if (!visible || !adsEnabled) return
        if (adsConfig.provider !== 'adsense') return
        const client = adsConfig.adsense?.clientId
        const slotId = adsConfig.adsense?.slots[slot]
        if (!client || !slotId) return
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch { }
    }, [visible, adsEnabled, slot])

    if (!visible || !adsEnabled) return null

    // If provider is AdSense, render official ins tag and push
    if (adsConfig.provider === 'adsense' && typeof window !== 'undefined') {
        const client = adsConfig.adsense?.clientId
        const slotId = adsConfig.adsense?.slots[slot]
        // Render nothing if slot not configured yet
        const configured = Boolean(client && slotId)
        // Ensure script is present once (skip if global exists)
        const SCRIPT_ID = 'adsense-script'
        // @ts-ignore
        const hasGlobal = typeof window.adsbygoogle !== 'undefined'
        if (!document.getElementById(SCRIPT_ID) && !hasGlobal) {
            const s = document.createElement('script')
            s.id = SCRIPT_ID
            s.async = true
            s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`
            s.crossOrigin = 'anonymous'
            document.head.appendChild(s)
        }

        // Create ins element per render. No minimum height reserved; hide if not filled
        return (
            <div
                ref={containerRef}
                className={cn('relative', className)}
                style={{ ...(collapsed ? { display: 'none' } : {}), ...style }}
                data-ad-slot={slot}
                data-ad-unit-key={getAdUnitKey(slot)}
            >
                <button
                    type="button"
                    aria-label="Fechar anúncio"
                    className="absolute right-1 top-1 z-10 rounded p-1 text-xs text-muted-foreground hover:text-foreground"
                    onClick={dismiss}
                >
                    ×
                </button>
                {configured && (
                    <ins
                        ref={insRef as any}
                        className="adsbygoogle block"
                        style={{ display: 'block' }}
                        data-ad-client={client}
                        data-ad-slot={slotId}
                        data-ad-format="auto"
                        data-full-width-responsive="true"
                        {...(typeof window !== 'undefined' && /^(localhost|127\\.0\\.0\\.1)$/.test(window.location.hostname) ? { 'data-adtest': 'on' } : {})}
                    />
                )}
            </div>
        )
    }

    return (
        <div className={cn('relative', className)} style={style} data-ad-slot={slot} data-ad-unit-key={getAdUnitKey(slot)}>
            {/* Close/dismiss button */}
            <button
                type="button"
                aria-label="Fechar anúncio"
                className="absolute right-1 top-1 z-10 rounded p-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={dismiss}
            >
                ×
            </button>

            {adsConfig.provider === 'dummy' && <DummyAd slot={slot} onClick={handleClick} />}
            {/* Future: render real providers here (AdSense/GPT) */}
        </div>
    )
}

export default AdSlot


