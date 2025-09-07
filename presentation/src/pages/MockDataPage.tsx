import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CodeEditor } from '@/components/common/ui/CodeEditor'
import { MockDataService } from '@builder/data'
import { CsvResult } from '@/components/common/results/CsvResult'

export function MockDataPage() {
    const service = useMemo(() => new MockDataService(), [])
    const [specType, setSpecType] = useState<'json-schema' | 'openapi'>('json-schema')
    const [spec, setSpec] = useState('')
    const [seed, setSeed] = useState('demo')
    const [count, setCount] = useState(10)
    const [tableName, setTableName] = useState('data')
    const [json, setJson] = useState<any[] | null>(null)
    const [csv, setCsv] = useState('')
    const [sql, setSql] = useState('')
    const [error, setError] = useState<string | null>(null)

    const sampleJsonSchema = useMemo(() => JSON.stringify({
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        type: 'object',
        properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            active: { type: 'boolean' },
            tags: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 4 },
            profile: {
                type: 'object',
                properties: {
                    website: { type: 'string', format: 'uri' },
                    uuid: { type: 'string', format: 'uuid' }
                }
            }
        },
        required: ['id', 'name', 'email']
    }, null, 2), [])

    const sampleOpenApi = useMemo(() => JSON.stringify({
        openapi: '3.0.3',
        info: { title: 'Sample', version: '1.0.0' },
        paths: {},
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        created_at: { type: 'string', format: 'date-time' }
                    },
                    required: ['id', 'name', 'email']
                }
            }
        }
    }, null, 2), [])

    const handleGenerate = () => {
        try {
            setError(null)
            const parsed = spec ? JSON.parse(spec) : {}
            const result = specType === 'json-schema'
                ? service.generateFromJsonSchema(parsed, { seed, count, tableName })
                : service.generateFromOpenApi(parsed, { seed, count, tableName })
            setJson(result.json)
            setCsv(result.csv)
            setSql(result.sql)
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Erro ao gerar')
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader title="Mock/Data" description="Gere dados fake a partir de JSON Schema ou OpenAPI" />
            <div className="grid gap-6 lg:grid-cols-12">
                {/* Left: Spec + Options stacked */}
                <div className="space-y-6 lg:col-span-7">
                <Card className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <Button variant={specType === 'json-schema' ? 'default' : 'outline'} size="sm" onClick={() => setSpecType('json-schema')}>JSON Schema</Button>
                            <Button variant={specType === 'openapi' ? 'default' : 'outline'} size="sm" onClick={() => setSpecType('openapi')}>OpenAPI</Button>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => setSpec(specType === 'json-schema' ? sampleJsonSchema : sampleOpenApi)}>Exemplo</Button>
                            <Button size="sm" variant="outline" onClick={() => setSpec('')}>Limpar</Button>
                        </div>
                    </div>
                    <CodeEditor value={spec} onChange={setSpec} language="json" height={480} />
                    {error && <div className="text-sm text-red-500">{error}</div>}
                </Card>

                {/* Options (moved below input) */}
                <Card className="p-4 space-y-3">
                    <h3 className="font-semibold">Opções</h3>
                    <div className="grid gap-3 text-sm">
                        <label className="grid gap-1">
                            <span>Seed</span>
                            <input className="rounded border px-2 py-1 bg-background" value={seed} onChange={e => setSeed(e.target.value)} />
                            <span className="text-xs text-muted-foreground">Usado para geração determinística. A mesma seed gera os mesmos dados.</span>
                        </label>
                        <label className="grid gap-1">
                            <span>Quantidade (N)</span>
                            <input className="rounded border px-2 py-1 bg-background" type="number" min={1} max={5000} value={count} onChange={e => setCount(parseInt(e.target.value || '1'))} />
                            <span className="text-xs text-muted-foreground">Número de registros a serem gerados.</span>
                        </label>
                        <label className="grid gap-1">
                            <span>Nome da Tabela (SQL)</span>
                            <input className="rounded border px-2 py-1 bg-background" value={tableName} onChange={e => setTableName(e.target.value)} />
                            <span className="text-xs text-muted-foreground">Nome usado nos comandos INSERT gerados.</span>
                        </label>
                        <div className="pt-2">
                            <Button onClick={handleGenerate}>Gerar</Button>
                        </div>
                    </div>
                </Card>
                </div>

                {/* Right: Output */}
                <div className="space-y-4 lg:col-span-5">
                    <Card className="p-3">
                        <h3 className="font-semibold mb-2">JSON</h3>
                        <CodeEditor value={JSON.stringify(json ?? [], null, 2)} onChange={() => {}} readOnly language="json" height={300} />
                    </Card>
                    <Card className="p-3">
                        <h3 className="font-semibold mb-2">CSV</h3>
                        <CsvResult result={{ success: true, data: csv }} onCopy={async () => navigator.clipboard.writeText(csv)} onDownload={() => {
                            const blob = new Blob([csv], { type: 'text/csv' })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = 'data.csv'
                            a.click()
                            URL.revokeObjectURL(url)
                        }} version={1} updatedAt={Date.now()} justUpdated={false} />
                    </Card>
                    <Card className="p-3 space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">SQL</h3>
                            <div className="flex gap-2 text-xs text-muted-foreground">
                                <span>Dica: aumente o batch para juntar INSERTs</span>
                            </div>
                        </div>
                        <CodeEditor value={sql} onChange={() => {}} readOnly language="sql" height={300} />
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default MockDataPage


