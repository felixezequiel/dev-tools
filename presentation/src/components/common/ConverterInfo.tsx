import { useState } from 'react'
import type { ConverterUsage } from '@/types/converter'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { ChevronDown, ChevronRight, Info } from 'lucide-react'

interface ConverterInfoProps {
    usage?: ConverterUsage
}

export function ConverterInfo({ usage }: ConverterInfoProps) {
    const [open, setOpen] = useState(false)
    if (!usage) return null

    return (
        <div className="mb-2">
            <Button variant="ghost" size="sm" onClick={() => setOpen(o => !o)} className="text-muted-foreground">
                <Info className="h-4 w-4 mr-2" />
                <span>{open ? 'Ocultar detalhes' : 'Ver para que serve este conversor'}</span>
                {open ? <ChevronDown className="h-4 w-4 ml-2" /> : <ChevronRight className="h-4 w-4 ml-2" />}
            </Button>
            {open && (
                <Card className="mt-2">
                    <CardContent className="space-y-3 pt-4">
                        <p className="text-sm text-muted-foreground">{usage.summary}</p>
                        <div className="space-y-3">
                            {usage.useCases.map((uc, i) => (
                                <div key={i} className="rounded-md border p-3">
                                    <div className="font-medium text-sm">{uc.title}</div>
                                    <p className="text-sm text-muted-foreground mt-1">{uc.description}</p>
                                    {(uc.exampleInput || uc.exampleOutput) && (
                                        <div className="grid gap-3 md:grid-cols-2 mt-3 text-xs font-mono">
                                            {uc.exampleInput && (
                                                <div className="rounded bg-muted/50 p-2 overflow-auto">
                                                    <div className="text-[10px] uppercase text-muted-foreground mb-1">Exemplo de entrada</div>
                                                    <pre className="whitespace-pre-wrap">{uc.exampleInput}</pre>
                                                </div>
                                            )}
                                            {uc.exampleOutput && (
                                                <div className="rounded bg-muted/50 p-2 overflow-auto">
                                                    <div className="text-[10px] uppercase text-muted-foreground mb-1">Exemplo de saída</div>
                                                    <pre className="whitespace-pre-wrap">{uc.exampleOutput}</pre>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default ConverterInfo


