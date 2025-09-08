import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CodeEditor } from '@/components/common/ui/CodeEditor'
import type { ResultRendererProps } from '@/types/converter'
type SqlProps = Omit<ResultRendererProps, 'config' | 'input' | 'inputType'>
import { Check, Copy, Download } from 'lucide-react'
import { useState } from 'react'
import { AdSlot } from '@/components/ads/AdSlot'

export function SqlResult({ result, onCopy, onDownload, version, updatedAt, justUpdated }: SqlProps) {
    const [copied, setCopied] = useState(false)
    const sql = typeof result?.data === 'string' ? result.data : String(result?.data ?? '')
    if (!result?.success) return null

    return (
        <div className={"space-y-3 " + (justUpdated ? 'ring-1 ring-primary/40 rounded-md transition-shadow shadow-[0_0_0_3px_rgba(59,130,246,0.15)]' : '')}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Badge variant="success">Sucesso</Badge>
                    {result.executionTime && <span className="text-xs text-muted-foreground">{result.executionTime.toFixed(2)}ms</span>}
                    <span className="text-[10px] uppercase text-muted-foreground">v{version}</span>
                    {updatedAt && <span className="text-[10px] text-muted-foreground">{new Date(updatedAt).toLocaleTimeString()}</span>}
                    {justUpdated && <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary">Atualizado</span>}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                            await onCopy()
                            setCopied(true)
                            setTimeout(() => setCopied(false), 2000)
                        }}
                        title="Copiar SQL"
                    >
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={onDownload} title="Baixar SQL">
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <CodeEditor value={sql} onChange={() => { }} readOnly language="sql" height={360} />

            <AdSlot slot="converter_output_footer" />
        </div>
    )
}

export default SqlResult


