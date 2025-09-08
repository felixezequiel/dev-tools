import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CodeEditor } from '@/components/common/ui/CodeEditor'
import { Button as UIButton } from '@/components/ui/Button'
import { Copy, Check } from 'lucide-react'
import { TypesGeneratorService } from '@builder/data'
import { useTranslation } from '@/lib/i18n'

export function TypesZodPage() {
    const { t } = useTranslation()
    const [input, setInput] = useState('')
    const [tsCode, setTsCode] = useState('')
    const [zodCode, setZodCode] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [copiedTs, setCopiedTs] = useState(false)
    const [copiedZod, setCopiedZod] = useState(false)

    const gen = useMemo(() => new TypesGeneratorService(), [])

    const handleGenerate = () => {
        try {
            setError(null)
            const json = input.trim() ? JSON.parse(input) : {}
            const { ts, zod } = gen.generateAll(json, { rootName: 'Data' })
            setTsCode(ts)
            setZodCode(zod)
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Erro ao gerar tipos')
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{t('jsonInput')}</h3>
                        <Button onClick={() => setInput('{"id":1, "name":"John", "email":"john@example.com", "tags":["a","b"]}')}>{t('example')}</Button>
                    </div>
                    <CodeEditor value={input} onChange={setInput} language="json" height={360} />
                    <div className="flex justify-end">
                        <Button onClick={handleGenerate}>{t('generate')}</Button>
                    </div>
                    {error && <div className="text-sm text-red-500">{error}</div>}
                </Card>
                <div className="space-y-6">
                    <Card className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">TypeScript</h3>
                            <UIButton
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                    await navigator.clipboard.writeText(tsCode)
                                    setCopiedTs(true)
                                    setTimeout(() => setCopiedTs(false), 1500)
                                }}
                                disabled={!tsCode}
                                title={t('copyTypescript')}
                            >
                                {copiedTs ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </UIButton>
                        </div>
                        <CodeEditor value={tsCode} onChange={() => { }} readOnly language="typescript" height={240} />
                    </Card>
                    <Card className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Zod</h3>
                            <UIButton
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                    await navigator.clipboard.writeText(zodCode)
                                    setCopiedZod(true)
                                    setTimeout(() => setCopiedZod(false), 1500)
                                }}
                                disabled={!zodCode}
                                title={t('copyZod')}
                            >
                                {copiedZod ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </UIButton>
                        </div>
                        <CodeEditor value={zodCode} onChange={() => { }} readOnly language="typescript" height={240} />
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default TypesZodPage


