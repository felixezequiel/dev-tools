import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CodeEditor } from '@/components/common/ui/CodeEditor'
import { MockDataService } from '@builder/data'
import { CsvResult } from '@/components/common/results/CsvResult'
import { SqlResult } from '@/components/common/results/SqlResult'
import { Button as UIButton } from '@/components/ui/Button'
import { Check, Copy } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export function MockDataPage() {
    const { t } = useTranslation()
    const service = useMemo(() => new MockDataService(), [])
    const [specType, setSpecType] = useState<'json-schema' | 'openapi'>('json-schema')
    const [spec, setSpec] = useState('')
    const [seed, setSeed] = useState('demo')
    const [count, setCount] = useState(10)
    const [tableName, setTableName] = useState('data')
    const [batchSize, setBatchSize] = useState(1000)
    const [locale, setLocale] = useState('en')
    const [json, setJson] = useState<any[] | null>(null)
    const [csv, setCsv] = useState('')
    const [sql, setSql] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [copiedJson, setCopiedJson] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)

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

    const handleGenerate = async () => {
        try {
            setIsGenerating(true)
            setError(null)

            const parsed = spec ? JSON.parse(spec) : {}
            const result = specType === 'json-schema'
                ? service.generateFromJsonSchema(parsed, { seed, count, tableName, batchSize, locale })
                : service.generateFromOpenApi(parsed, { seed, count, tableName, batchSize, locale })

            setJson(result.json)
            setCsv(result.csv)
            setSql(result.sql)
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Erro ao gerar')
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-12">
                {/* Left: Spec + Options stacked */}
                <div className="space-y-6 lg:col-span-7">
                    <Card className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                <Button variant={specType === 'json-schema' ? 'default' : 'outline'} size="sm" onClick={() => setSpecType('json-schema')}>{t('jsonSchema')}</Button>
                                <Button variant={specType === 'openapi' ? 'default' : 'outline'} size="sm" onClick={() => setSpecType('openapi')}>{t('openApi')}</Button>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => setSpec(specType === 'json-schema' ? sampleJsonSchema : sampleOpenApi)}>{t('example')}</Button>
                                <Button size="sm" variant="outline" onClick={() => setSpec('')}>{t('clear')}</Button>
                            </div>
                        </div>
                        <CodeEditor value={spec} onChange={setSpec} language="json" height={480} />
                        {error && <div className="text-sm text-red-500">{error}</div>}
                    </Card>

                    {/* Options (moved below input) */}
                    <Card className="p-4 space-y-3">
                        <h3 className="font-semibold">{t('options')}</h3>
                        <div className="grid gap-3 text-sm">
                            <label className="grid gap-1">
                                <span>{t('seed')}</span>
                                <input className="rounded border px-2 py-1 bg-background" value={seed} onChange={e => setSeed(e.target.value)} />
                                <span className="text-xs text-muted-foreground">{t('seedDescription')}</span>
                            </label>
                            <label className="grid gap-1">
                                <span>{t('locale')}</span>
                                <select className="rounded border px-2 py-1 bg-background" value={locale} onChange={e => setLocale(e.target.value)}>
                                    <option value="en">English (en)</option>
                                    <option value="pt_BR">Portuguese Brazil (pt_BR)</option>
                                    <option value="es">Spanish (es)</option>
                                    <option value="fr">French (fr)</option>
                                    <option value="de">German (de)</option>
                                    <option value="it">Italian (it)</option>
                                    <option value="ja">Japanese (ja)</option>
                                    <option value="ko">Korean (ko)</option>
                                    <option value="zh_CN">Chinese Simplified (zh_CN)</option>
                                    <option value="ar">Arabic (ar)</option>
                                </select>
                                <span className="text-xs text-muted-foreground">{t('localeDescription')}</span>
                            </label>
                            <label className="grid gap-1">
                                <span>{t('quantity')}</span>
                                <input className="rounded border px-2 py-1 bg-background" type="number" min={1} max={10000} value={count} onChange={e => setCount(parseInt(e.target.value || '1'))} />
                                <span className="text-xs text-muted-foreground">{t('quantityDescription')}</span>
                                {count > 5000 && (
                                    <span className="text-xs text-yellow-600 dark:text-yellow-400">
                                        {t('largeDatasetWarning')}
                                    </span>
                                )}
                            </label>
                            <label className="grid gap-1">
                                <span>{t('batchSize')}</span>
                                <input className="rounded border px-2 py-1 bg-background" type="number" min={1} max={10000} value={batchSize} onChange={e => setBatchSize(parseInt(e.target.value || '1000'))} />
                                <span className="text-xs text-muted-foreground">{t('batchSizeDescription')}</span>
                            </label>
                            <label className="grid gap-1">
                                <span>{t('tableName')}</span>
                                <input className="rounded border px-2 py-1 bg-background" value={tableName} onChange={e => setTableName(e.target.value)} />
                                <span className="text-xs text-muted-foreground">{t('tableNameDescription')}</span>
                            </label>
                            <div className="pt-2">
                                <Button onClick={handleGenerate} disabled={isGenerating}>
                                    {isGenerating ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            {t('generating')}
                                        </>
                                    ) : (
                                        <>
                                            {t('generate')}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right: Output */}
                <div className="space-y-4 lg:col-span-5">
                    <Card className="p-3 space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{t('json')}</h3>
                            <UIButton
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                    await navigator.clipboard.writeText(JSON.stringify(json ?? [], null, 2))
                                    setCopiedJson(true)
                                    setTimeout(() => setCopiedJson(false), 1500)
                                }}
                                title={t('copyJson')}
                            >
                                {copiedJson ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </UIButton>
                        </div>
                        <CodeEditor value={JSON.stringify(json ?? [], null, 2)} onChange={() => { }} readOnly language="json" height={300} />
                    </Card>
                    <Card className="p-3">
                        <h3 className="font-semibold mb-2">{t('csv')}</h3>
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
                            <h3 className="font-semibold">{t('sql')}</h3>
                            <div className="flex gap-2 text-xs text-muted-foreground">
                                <span>{t('sqlBatchTip')}</span>
                            </div>
                        </div>
                        <SqlResult
                            result={{ success: true, data: sql }}
                            onCopy={async () => navigator.clipboard.writeText(sql)}
                            onDownload={() => {
                                const blob = new Blob([sql], { type: 'text/sql' })
                                const url = URL.createObjectURL(blob)
                                const a = document.createElement('a')
                                a.href = url
                                a.download = 'data.sql'
                                a.click()
                                URL.revokeObjectURL(url)
                            }}
                            version={1}
                            updatedAt={Date.now()}
                            justUpdated={false}
                        />
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default MockDataPage


