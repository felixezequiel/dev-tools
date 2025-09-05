import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TextareaWithValidation } from '@/components/ui/TextareaWithValidation'
import { Badge } from '@/components/ui/Badge'
import { useDataBuilder } from '@/hooks/useDataBuilder'
import { useValidation, validationRules } from '@/hooks/useValidation'
import { createEntrySource, inputFormats } from '@/lib/entrySources'
import { copyToClipboard } from '@/lib/utils'
import { Database, Copy, Check, AlertCircle, Zap, Code, Table, FileText, Eye } from 'lucide-react'

export function FormDataConverterPage() {
    const [input, setInput] = useState('')
    const [inputType, setInputType] = useState<'key-value' | 'json' | 'csv'>('json')
    const [showPreview, setShowPreview] = useState(false)
    const [copied, setCopied] = useState(false)
    const { isBuilding, result, buildToFormData } = useDataBuilder()

    // Validação baseada no tipo de entrada
    const getValidationRules = useCallback(() => {
        switch (inputType) {
            case 'key-value':
                return [validationRules.keyValueFormat()]
            case 'json':
                return [validationRules.jsonFormat()]
            case 'csv':
                return [validationRules.required('Dados CSV')]
            default:
                return [validationRules.jsonFormat()]
        }
    }, [inputType])

    const inputValidation = useValidation(getValidationRules())

    const validateInput = useCallback((value: string) => {
        return inputValidation.validateField(value)
    }, [inputValidation])

    const handleInputChange = useCallback((value: string) => {
        setInput(value)
    }, [])

    const handleInputTypeChange = useCallback((type: 'key-value' | 'json' | 'csv') => {
        setInputType(type)
        setInput('')
    }, [])

    const handleConvert = async () => {
        const validation = inputValidation.validateField(input)
        if (!validation.isValid || !input.trim()) return

        try {
            const entrySource = createEntrySource(input, inputType)
            await buildToFormData(entrySource)
        } catch (error) {
            console.error('Erro ao criar EntrySource:', error)
        }
    }

    const handleCopy = async () => {
        if (result?.data && showPreview) {
            const formDataString = Array.from((result.data as FormData).entries())
                .map(([key, value]) => `${key}=${value}`)
                .join('\n')
            await copyToClipboard(formDataString)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const getFormDataPreview = (formData: FormData) => {
        const entries: Array<[string, any]> = []
        formData.forEach((value, key) => {
            entries.push([key, value])
        })
        return entries
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Conversor FormData"
                description="Converte dados estruturados em FormData para envio de formulários"
                breadcrumbs={[
                    { label: 'Página Inicial', path: '/' },
                    { label: 'Conversor FormData', isActive: true }
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
                                        Selecione o formato e insira os dados para conversão
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Seletor de tipo de entrada */}
                            <div className="flex space-x-2">
                                {Object.entries(inputFormats).map(([key, format]) => (
                                    <Button
                                        key={key}
                                        variant={inputType === key ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => handleInputTypeChange(key as any)}
                                        className="flex items-center space-x-1"
                                    >
                                        {key === 'key-value' && <Code className="h-3 w-3" />}
                                        {key === 'json' && <Database className="h-3 w-3" />}
                                        {key === 'csv' && <Table className="h-3 w-3" />}
                                        <span>{format.name}</span>
                                    </Button>
                                ))}
                            </div>

                            <div className="text-sm text-muted-foreground">
                                <p>{inputFormats[inputType].description}</p>
                            </div>

                            <TextareaWithValidation
                                placeholder={inputFormats[inputType].placeholder}
                                value={input}
                                onChange={handleInputChange}
                                onValidate={validateInput}
                                successMessage="Formato válido"
                                className="min-h-[300px] font-mono text-sm"
                            />

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setInput(inputFormats[inputType].example)}
                            >
                                Carregar Exemplo
                            </Button>

                            <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    {input.split('\n').filter(line => line.trim()).length} linhas
                                </div>
                                <Button
                                    onClick={handleConvert}
                                    disabled={!input.trim() || isBuilding || inputValidation.hasErrors}
                                    loading={isBuilding}
                                    variant={inputValidation.hasErrors ? "destructive" : "default"}
                                >
                                    <Zap className="mr-2 h-4 w-4" />
                                    {inputValidation.hasErrors ? "Corrigir Erros" : "Converter para FormData"}
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
                                        <Database className="h-5 w-5" />
                                        <span>Resultado FormData</span>
                                    </CardTitle>
                                    <CardDescription>
                                        FormData estruturado gerado a partir dos dados de entrada
                                    </CardDescription>
                                </div>
                                {result?.success && (
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowPreview(!showPreview)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        {showPreview && (
                                            <Button variant="outline" size="sm" onClick={handleCopy}>
                                                {copied ? (
                                                    <Check className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                        )}
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

                                    {!showPreview ? (
                                        <div className="flex items-center justify-center h-[200px] rounded-md border border-dashed">
                                            <div className="text-center">
                                                <Database className="mx-auto h-12 w-12 mb-2 opacity-50" />
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    FormData criado com sucesso!
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setShowPreview(true)}
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Visualizar Conteúdo
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-medium">Conteúdo do FormData:</h4>
                                                <Badge variant="secondary">
                                                    {getFormDataPreview(result.data as FormData).length} campos
                                                </Badge>
                                            </div>
                                            <div className="rounded-md border bg-muted/50 p-4 max-h-[300px] overflow-y-auto">
                                                <div className="space-y-2">
                                                    {getFormDataPreview(result.data as FormData).map(([key, value], index) => (
                                                        <div key={index} className="flex items-start space-x-2 text-sm">
                                                            <span className="font-mono text-primary font-medium min-w-0 flex-shrink-0">
                                                                {key}:
                                                            </span>
                                                            <span className="font-mono text-muted-foreground break-all">
                                                                {String(value)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
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
                                        <Database className="mx-auto h-12 w-12 mb-2 opacity-50" />
                                        <p>Insira dados e clique em "Converter para FormData" para ver o resultado</p>
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
