import { useState } from 'react'
import type { ResultRendererProps } from '@/types/converter'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { Check, Copy, Database, Eye, EyeOff } from 'lucide-react'
import { AdSlot } from '@/components/ads/AdSlot'

export function FormDataResult({ result, onCopy, version, updatedAt, justUpdated }: ResultRendererProps) {
    const [showPreview, setShowPreview] = useState(false)
    const [copied, setCopied] = useState(false)

    const getFormDataPreview = (formData: FormData) => {
        const entries: Array<[string, any]> = []
        formData.forEach((value, key) => {
            entries.push([key, value])
        })
        return entries
    }

    if (!(result?.success)) return null

    return (
        <div className={"space-y-4 " + (justUpdated ? 'ring-1 ring-primary/40 rounded-md transition-shadow shadow-[0_0_0_3px_rgba(59,130,246,0.15)]' : '')}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Badge variant="success">Sucesso</Badge>
                    {result.executionTime && (
                        <span className="text-sm text-muted-foreground">{result.executionTime.toFixed(2)}ms</span>
                    )}
                    <span className="text-xs text-muted-foreground">v{version}</span>
                    {updatedAt && (
                        <span className="text-xs text-muted-foreground">{new Date(updatedAt).toLocaleTimeString()}</span>
                    )}
                    {justUpdated && (
                        <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">Atualizado agora</span>
                    )}
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setShowPreview(v => !v)}>
                        {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    {showPreview && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                                await onCopy()
                                setCopied(true)
                                setTimeout(() => setCopied(false), 2000)
                            }}
                        >
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    )}
                </div>
            </div>

            {!showPreview ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center h-[200px] rounded-md border border-dashed bg-gradient-to-br from-primary/5 to-primary/10"
                >
                    <div className="text-center space-y-3">
                        <div className="relative">
                            <Database className="mx-auto h-16 w-16 text-primary/60" />
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <Check className="h-3 w-3 text-white" />
                            </div>
                        </div>
                        <div>
                            <p className="text-lg font-medium text-primary">FormData criado com sucesso!</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {getFormDataPreview(result.data as FormData).length} campos processados
                            </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setShowPreview(true)} className="mt-4">
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar Conteúdo
                        </Button>
                    </div>
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-medium">Conteúdo do FormData</h4>
                            <Badge variant="secondary" className="text-xs">
                                {getFormDataPreview(result.data as FormData).length} campos
                            </Badge>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPreview(false)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <EyeOff className="h-3 w-3 mr-1" />
                            Ocultar
                        </Button>
                    </div>

                    <div className="rounded-md border bg-muted/30 p-4 max-h-[400px] overflow-y-auto">
                        <div className="space-y-3">
                            {getFormDataPreview(result.data as FormData).map(([key, value], index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-start space-x-3 p-3 rounded-lg bg-background border hover:shadow-sm transition-shadow"
                                >
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                                        <span className="text-xs font-medium text-primary">{index + 1}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="font-mono text-sm font-medium text-primary">{key}</span>
                                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                                {typeof value === 'string' ? 'string' : typeof value}
                                            </span>
                                        </div>
                                        <div className="font-mono text-sm text-muted-foreground break-all bg-muted/50 p-2 rounded">
                                            {String(value)}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg">
                        <span> Total: {getFormDataPreview(result.data as FormData).length} entradas </span>
                        <span>
                            Tamanho estimado: ~{new Blob([Array.from((result.data as FormData).entries()).map(([k, v]) => `${k}=${v}`).join('&')]).size} bytes
                        </span>
                    </div>
                </motion.div>
            )}

            <AdSlot slot="converter_output_footer" />
        </div>
    )
}

export default FormDataResult


