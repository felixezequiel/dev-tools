import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { DefaultCsvParser } from '@builder/data'
import { CodeEditor } from '@/components/common/ui/CodeEditor'
import type { ResultRendererProps } from '@/types/converter'
type CsvProps = Omit<ResultRendererProps, 'config' | 'input' | 'inputType'>
import { Check, Copy, Download, Eye, EyeOff } from 'lucide-react'

export function CsvResult({ result, onCopy, onDownload, version, updatedAt, justUpdated }: CsvProps) {
    const [view, setView] = useState<'table' | 'raw'>('table')
    const [copied, setCopied] = useState(false)

    const csv = typeof result?.data === 'string' ? result.data : ''

    const rows = useMemo(() => {
        try {
            const parser = new DefaultCsvParser()
            return parser.parse(csv)
        } catch {
            return []
        }
    }, [csv])

    const headers = rows[0] ?? []
    const dataRows = rows.slice(1)

    if (!(result?.success)) return null

    return (
        <Card className={"p-2 " + (justUpdated ? 'ring-1 ring-primary/40 rounded-md transition-shadow shadow-[0_0_0_3px_rgba(59,130,246,0.15)]' : '')}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Badge variant="success">Sucesso</Badge>
                    {result.executionTime && <span className="text-xs text-muted-foreground">{result.executionTime.toFixed(2)}ms</span>}
                    <span className="text-[10px] uppercase text-muted-foreground">v{version}</span>
                    {updatedAt && <span className="text-[10px] text-muted-foreground">{new Date(updatedAt).toLocaleTimeString()}</span>}
                    {justUpdated && <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary">Atualizado</span>}
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant={view === 'table' ? 'default' : 'outline'} onClick={() => setView('table')}>Tabela</Button>
                    <Button size="sm" variant={view === 'raw' ? 'default' : 'outline'} onClick={() => setView('raw')}>Bruto</Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                            await onCopy()
                            setCopied(true)
                            setTimeout(() => setCopied(false), 2000)
                        }}
                        title="Copiar CSV"
                    >
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={onDownload} title="Baixar CSV">
                        <Download className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setView(v => (v === 'table' ? 'raw' : 'table'))}>
                        {view === 'table' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
            {view === 'table' ? (
                <div className="overflow-auto border rounded">
                    <table className="w-full border-collapse text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                {headers.map((h, idx) => (
                                    <th key={idx} className="border px-2 py-1 text-left font-medium whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {dataRows.length === 0 ? (
                                <tr>
                                    <td className="px-2 py-2 text-muted-foreground" colSpan={Math.max(1, headers.length)}>Sem dados</td>
                                </tr>
                            ) : (
                                dataRows.map((row, rIdx) => (
                                    <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                                        {row.map((cell, cIdx) => (
                                            <td key={cIdx} className="border px-2 py-1 whitespace-pre">{cell}</td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <CodeEditor value={csv} onChange={() => {}} readOnly language="plaintext" height={320} />
            )}
        </Card>
    )
}

export default CsvResult
