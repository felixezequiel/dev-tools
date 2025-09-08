import { useMemo, useState } from 'react'
import type { ResultRendererProps } from '@/types/converter'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Copy, Check, Download, Database } from 'lucide-react'
import { formatSql } from '@/lib/sqlFormatter'
import { AdSlot } from '@/components/ads/AdSlot'

function tryParseJson<T = any>(value: unknown): T | null {
    if (typeof value === 'string') {
        try { return JSON.parse(value) } catch { return null }
    }
    if (typeof value === 'object' && value !== null) return value as T
    return null
}

function dedupe(sql: string): string {
    const parts = sql.split(/;\s*/).map(s => s.trim()).filter(Boolean)
    const seen = new Set<string>()
    const ordered: string[] = []
    for (const p of parts) {
        const key = p.replace(/\s+/g, ' ').toLowerCase()
        if (!seen.has(key)) {
            seen.add(key)
            ordered.push(p)
        }
    }
    return ordered.join(';\n') + (ordered.length ? ';' : '')
}

export function DBMigrationResult({ result, onDownload, version, updatedAt, justUpdated }: ResultRendererProps) {
    const [tab, setTab] = useState<'up' | 'down' | 'json'>('up')
    const [copied, setCopied] = useState(false)

    const data = useMemo(() => {
        const parsed = tryParseJson(result?.data)
        if (parsed && typeof parsed === 'object') return parsed as any
        return { up: String(result?.data ?? ''), down: '' }
    }, [result]) as any

    const upScript: string = formatSql(dedupe(String(data?.up ?? '')))
    const downScript: string = formatSql(dedupe(String(data?.down ?? '')))
    const jsonPretty = useMemo(() => JSON.stringify(data, null, 2), [data])

    const content = tab === 'up' ? upScript : tab === 'down' ? downScript : jsonPretty

    const lines = useMemo(() => content.split('\n').length, [content])
    const statements = useMemo(() => (content.match(/;\s*$/gm) || []).length, [content])
    const size = useMemo(() => new Blob([content]).size, [content])

    const copyCurrent = async () => {
        await navigator.clipboard.writeText(content)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    return (
        <div className={"space-y-4 " + (justUpdated ? 'ring-1 ring-primary/40 rounded-md transition-shadow shadow-[0_0_0_3px_rgba(59,130,246,0.15)]' : '')}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Badge variant="success">Sucesso</Badge>
                    {result.executionTime && (
                        <span className="text-sm text-muted-foreground">{result.executionTime.toFixed(2)}ms</span>
                    )}
                    <span className="text-xs text-muted-foreground">v{version}</span>
                    {updatedAt && (
                        <span className="text-xs text-muted-foreground">{new Date(updatedAt).toLocaleTimeString()}</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <div className="inline-flex rounded-md border bg-muted/40 p-0.5">
                        <Button size="sm" variant={tab === 'up' ? 'default' : 'ghost'} onClick={() => setTab('up')}>UP</Button>
                        <Button size="sm" variant={tab === 'down' ? 'default' : 'ghost'} onClick={() => setTab('down')} disabled={!downScript}>DOWN</Button>
                        <Button size="sm" variant={tab === 'json' ? 'default' : 'ghost'} onClick={() => setTab('json')}>JSON</Button>
                    </div>
                    <Button variant="outline" size="sm" onClick={copyCurrent}>
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={onDownload}>
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="rounded-md border bg-muted/50 p-4 overflow-x-auto">
                {content.trim() ? (
                    <pre className="text-sm font-mono whitespace-pre min-w-full">{content}</pre>
                ) : (
                    <div className="flex h-[180px] items-center justify-center text-muted-foreground">
                        <div className="text-center space-y-2">
                            <Database className="mx-auto h-10 w-10 opacity-50" />
                            <div>Nenhum conteúdo para mostrar</div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg">
                <span>{lines} linhas • {statements} comandos</span>
                <span>~{size} bytes</span>
            </div>

            <AdSlot slot="converter_output_footer" />
        </div>
    )
}

export default DBMigrationResult


