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
import { downloadFile, copyToClipboard } from '@/lib/utils'
import { Table, Download, Copy, Check, AlertCircle, Zap, Code, Database, FileText } from 'lucide-react'

export function CsvConverterPage() {
    const [input, setInput] = useState('')
    const [inputType, setInputType] = useState<'key-value' | 'json' | 'csv'>('json')
    const [copied, setCopied] = useState(false)
    const { isBuilding, result, buildToCsv } = useDataBuilder()

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
            await buildToCsv(entrySource)
        } catch (error) {
            console.error('Erro ao criar EntrySource:', error)
        }
    }

    const handleCopy = async () => {
        if (result?.data) {
            await copyToClipboard(result.data)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleDownload = () => {
        if (result?.data) {
            downloadFile(result.data, 'converted-data.csv', 'text/csv')
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Conversor CSV"
                description="Transforma dados estruturados em arquivos CSV"
                breadcrumbs={[
                    { label: 'Página Inicial', path: '/' },
                    { label: 'Conversor CSV', isActive: true }
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
                                    {inputValidation.hasErrors ? "Corrigir Erros" : "Converter para CSV"}
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
                                        <Table className="h-5 w-5" />
                                        <span>Resultado CSV</span>
                                    </CardTitle>
                                    <CardDescription>
                                        CSV estruturado gerado a partir dos dados de entrada
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
                                        <pre className="text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                                            {result.data}
                                        </pre>
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
                                        <Table className="mx-auto h-12 w-12 mb-2 opacity-50" />
                                        <p>Insira dados e clique em "Converter para CSV" para ver o resultado</p>
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
