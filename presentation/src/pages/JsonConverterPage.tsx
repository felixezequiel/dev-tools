import { useState, useCallback, Suspense, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TextareaWithValidation } from '@/components/ui/TextareaWithValidation'
import { Badge } from '@/components/ui/Badge'
import { useDataConversion } from '@/hooks/useDataConversion'
import { useValidation, validationRules } from '@/hooks/useValidation'
import { downloadFile, copyToClipboard } from '@/lib/utils'
import { FileText, Download, Copy, Check, AlertCircle, Zap, Loader2 } from 'lucide-react'
import { useThemeContext } from '@/components/common/ThemeProvider'

// SyntaxHighlighter será carregado dinamicamente no componente wrapper

const sampleInput = `user.name=John
user.age=30
user.email=john@example.com
address.street=Main St
address.city=New York
address.zip=10001`

// Componente de loading para SyntaxHighlighter
function SyntaxHighlighterLoader() {
    return (
        <div className="flex items-center justify-center h-[200px] bg-muted/50 rounded-md">
            <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Carregando syntax highlighter...</span>
            </div>
        </div>
    )
}

// Wrapper component para SyntaxHighlighter com lazy loading
function SyntaxHighlighterWrapper({ code, isDark }: { code: string; isDark: boolean }) {
    const [Highlighter, setHighlighter] = useState<any>(null)
    const [style, setStyle] = useState<any>(null)

    useEffect(() => {
        // Carregar componentes de forma assíncrona
        Promise.all([
            import('react-syntax-highlighter').then(module => module.Prism),
            isDark
                ? import('react-syntax-highlighter/dist/esm/styles/prism').then(module => module.oneDark)
                : import('react-syntax-highlighter/dist/esm/styles/prism').then(module => module.oneLight)
        ]).then(([highlighterModule, styleModule]) => {
            setHighlighter(() => highlighterModule)
            setStyle(styleModule)
        })
    }, [isDark])

    if (!Highlighter || !style) {
        return <SyntaxHighlighterLoader />
    }

    const Component = Highlighter
    return (
        <Component
            language="json"
            style={style}
            customStyle={{
                margin: 0,
                padding: 0,
                background: 'transparent',
                fontSize: '0.875rem'
            }}
        >
            {code}
        </Component>
    )
}

export function JsonConverterPage() {
    const [input, setInput] = useState('')
    const [copied, setCopied] = useState(false)
    const { isConverting, result, convert } = useDataConversion()
    const { isDark } = useThemeContext()

    // Validação para o campo de entrada
    const inputValidation = useValidation([
        validationRules.keyValueFormat()
    ])

    // Função de validação em tempo real
    const validateInput = useCallback((value: string) => {
        return inputValidation.validateField(value)
    }, [inputValidation])

    // Handler para mudança de input com validação
    const handleInputChange = useCallback((value: string) => {
        setInput(value)
        // Limpar resultado anterior quando o input muda
        if (result) {
            // Opcional: podemos adicionar um clearResult no hook useDataConversion
        }
    }, [result])

    const handleConvert = async () => {
        // Validar antes de converter
        const validation = inputValidation.validateField(input)
        if (!validation.isValid || !input.trim()) return

        // Aqui você integraria com a lógica real do backend
        // Por enquanto, vamos simular uma conversão
        await convert(async (data: string) => {
            // Simulação de conversão - em produção, isso seria feito pelo backend
            const lines = data.split('\n').filter(line => line.trim())
            const json: any = {}

            lines.forEach(line => {
                const [key, value] = line.split('=')
                if (key && value) {
                    const path = key.split('.')
                    let current = json

                    path.forEach((part, index) => {
                        if (index === path.length - 1) {
                            current[part] = value
                        } else {
                            current[part] = current[part] || {}
                            current = current[part]
                        }
                    })
                }
            })

            return json
        }, input)
    }

    const handleCopy = async () => {
        if (result?.data) {
            await copyToClipboard(JSON.stringify(result.data, null, 2))
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleDownload = () => {
        if (result?.data) {
            downloadFile(
                JSON.stringify(result.data, null, 2),
                'converted-data.json',
                'application/json'
            )
        }
    }

    const handleLoadSample = () => {
        setInput(sampleInput)
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Conversor JSON"
                description="Converte dados estruturados em formato chave-valor para JSON"
                breadcrumbs={[
                    { label: 'Página Inicial', path: '/' },
                    { label: 'Conversor JSON', isActive: true }
                ]}
            />

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Input Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center space-x-2">
                                        <FileText className="h-5 w-5" />
                                        <span>Dados de Entrada</span>
                                    </CardTitle>
                                    <CardDescription>
                                        Insira os dados no formato chave=valor (um por linha)
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm" onClick={handleLoadSample}>
                                    Carregar Exemplo
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <TextareaWithValidation
                                placeholder="user.name=John&#10;user.age=30&#10;user.email=john@example.com"
                                value={input}
                                onChange={handleInputChange}
                                onValidate={validateInput}
                                successMessage="Formato válido"
                                className="min-h-[300px] font-mono text-sm"
                            />
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    {input.split('\n').filter(line => line.trim()).length} linhas
                                </div>
                                <Button
                                    onClick={handleConvert}
                                    disabled={!input.trim() || isConverting || inputValidation.hasErrors}
                                    loading={isConverting}
                                    variant={inputValidation.hasErrors ? "destructive" : "default"}
                                >
                                    <Zap className="mr-2 h-4 w-4" />
                                    {inputValidation.hasErrors ? "Corrigir Erros" : "Converter"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Output Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center space-x-2">
                                        <FileText className="h-5 w-5" />
                                        <span>Resultado JSON</span>
                                    </CardTitle>
                                    <CardDescription>
                                        JSON estruturado gerado a partir dos dados de entrada
                                    </CardDescription>
                                </div>
                                {result?.success && (
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm" onClick={handleCopy}>
                                            {copied ? (
                                                <Check className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={handleDownload}>
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {result?.success ? (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="success">Sucesso</Badge>
                                        {result.executionTime && (
                                            <span className="text-sm text-muted-foreground">
                                                {result.executionTime.toFixed(2)}ms
                                            </span>
                                        )}
                                    </div>
                                    <div className="rounded-md border bg-muted/50 p-4">
                                        <Suspense fallback={<SyntaxHighlighterLoader />}>
                                            <SyntaxHighlighterWrapper
                                                code={JSON.stringify(result.data, null, 2)}
                                                isDark={isDark}
                                            />
                                        </Suspense>
                                    </div>
                                </div>
                            ) : result?.error ? (
                                <div className="flex items-center space-x-2 rounded-md border border-destructive/50 bg-destructive/5 p-4">
                                    <AlertCircle className="h-5 w-5 text-destructive" />
                                    <div>
                                        <p className="font-medium text-destructive">Erro na conversão</p>
                                        <p className="text-sm text-muted-foreground">{result.error}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed text-muted-foreground">
                                    <div className="text-center">
                                        <FileText className="mx-auto h-12 w-12 mb-2 opacity-50" />
                                        <p>Insira dados e clique em "Converter" para ver o resultado</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
