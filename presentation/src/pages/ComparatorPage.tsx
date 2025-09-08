import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/Card'
import { DiffCodeEditor } from '@/components/common/ui/DiffCodeEditor'
import { Button } from '@/components/ui/Button'
import { useComparators } from '@/hooks/useComparators'
import { useTranslation } from '@/lib/i18n'
import { AdSlot } from '@/components/ads/AdSlot'

export function ComparatorPage() {
    const { t } = useTranslation()
    const { jsonDiff, textDiff } = useComparators()

    const [mode, setMode] = useState<'json' | 'text'>('json')
    const [left, setLeft] = useState('')
    const [right, setRight] = useState('')

    const result = useMemo(() => {
        if (mode === 'json') {
            try {
                const l = left ? JSON.parse(left) : null
                const r = right ? JSON.parse(right) : null
                return { type: 'json', diffs: jsonDiff(l, r) } as const
            } catch (e) {
                return { type: 'error', message: t('jsonInvalidError') } as const
            }
        }
        return { type: 'text', res: textDiff(left, right) } as const
    }, [mode, left, right, jsonDiff, textDiff])

    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                <Button variant={mode === 'json' ? 'default' : 'secondary'} onClick={() => setMode('json')}>{t('json')}</Button>
                <Button variant={mode === 'text' ? 'default' : 'secondary'} onClick={() => setMode('text')}>{t('text')}</Button>
            </div>

            <div className="grid gap-4">
                <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{t('diffEditor')}</h3>
                    </div>
                    <DiffCodeEditor
                        original={left}
                        modified={right}
                        onChangeOriginal={setLeft}
                        onChangeModified={setRight}
                        language={mode === 'json' ? 'json' : 'plaintext'}
                        height={420}
                    />
                </Card>
                {/* Mid content ad after editor */}
                <AdSlot slot="comparator_mid" />
            </div>

            <Card className="p-4">
                <h3 className="font-semibold mb-3">{t('result')}</h3>
                {result.type === 'error' && (
                    <div className="text-red-500 text-sm">{result.message}</div>
                )}
                {result.type === 'json' && (
                    <div className="space-y-1 text-sm">
                        {result.diffs.length === 0 ? (
                            <div className="text-muted-foreground">{t('noDifferences')}</div>
                        ) : result.diffs.map((d, idx) => (
                            <div key={idx} className="grid grid-cols-4 gap-2">
                                <span className="col-span-1 font-mono text-xs uppercase">{d.kind}</span>
                                <span className="col-span-1 font-mono break-all">{d.path || '(root)'}</span>
                                <span className="col-span-1 truncate" title={d.left !== undefined ? String(d.left) : ''}>{d.left === undefined ? '' : String(d.left)}</span>
                                <span className="col-span-1 truncate" title={d.right !== undefined ? String(d.right) : ''}>{d.right === undefined ? '' : String(d.right)}</span>
                            </div>
                        ))}
                    </div>
                )}
                {result.type === 'text' && (
                    <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">+{result.res.summary.added} −{result.res.summary.removed} ~{result.res.summary.changed}</div>
                        <div className="text-sm font-mono overflow-auto max-h-96 border rounded">
                            {result.res.lines.map((line) => (
                                <div key={line.lineNumber} className={
                                    line.kind === 'added' ? 'bg-green-500/10' :
                                        line.kind === 'removed' ? 'bg-red-500/10' :
                                            line.kind === 'changed' ? 'bg-yellow-500/10' : ''
                                }>
                                    <div className="px-2 py-1 grid grid-cols-8 gap-2 items-start">
                                        <span className="text-xs text-muted-foreground col-span-1">{line.lineNumber}</span>
                                        <span className="col-span-3 whitespace-pre-wrap">{line.left ?? ''}</span>
                                        <span className="col-span-3 whitespace-pre-wrap">{line.right ?? ''}</span>
                                        <span className="col-span-1 text-[10px] text-muted-foreground">
                                            {line.issues?.map((i, idx) => (
                                                <span key={idx} title={`${i.name} (${i.codePoint}) @${i.index}`} className="inline-block px-1">{i.codePoint}</span>
                                            ))}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Card>
        </div>
    )
}

export default ComparatorPage
