import { useState, useCallback, Suspense } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TextareaWithValidation } from '@/components/ui/TextareaWithValidation'
import { FileDropzone } from '@/components/common/FileDropzone'
import { Badge } from '@/components/ui/Badge'
import { useDataBuilder } from '@/hooks/useDataBuilder'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useValidation, validationRules } from '@/hooks/useValidation'
import { createEntrySource, inputFormats } from '@/lib/entrySources'
import { downloadFile, copyToClipboard } from '@/lib/utils'
import {
    FileText,
    Download,
    Copy,
    Check,
    AlertCircle,
    Zap,
    Loader2,
    Code,
    Database,
    Table,
    Upload
} from 'lucide-react'

export interface DataConverterConfig {
    title: string
    description: string
    inputTypes: ('key-value' | 'json' | 'csv')[]
    defaultInputType: 'key-value' | 'json' | 'csv'
    outputFormat: 'json' | 'csv' | 'formdata'
    outputDescription: string
    acceptedFileTypes: string[]
    placeholder: string
    icon: any
}

interface DataConverterLayoutProps {
    config: DataConverterConfig
    breadcrumbs: Array<{ label: string; path?: string; isActive?: boolean }>
}

export function DataConverterLayout({ config, breadcrumbs }: DataConverterLayoutProps) {
    const [input, setInput] = useState('')
    const [inputType, setInputType] = useState<'key-value' | 'json' | 'csv'>(config.defaultInputType)
    const [inputMode, setInputMode] = useState<'manual' | 'file'>('manual')
    const [copied, setCopied] = useState(false)

    const { isBuilding, result, buildFromSource, buildToCsv, buildToFormData } = useDataBuilder()
    const { uploadedFile, uploadFile, removeFile } = useFileUpload()

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
                return [validationRules.keyValueFormat()]
        }
    }, [inputType])

    const inputValidation = useValidation(getValidationRules())

    // Função de validação em tempo real
    const validateInput = useCallback((value: string) => {
        return inputValidation.validateField(value)
    }, [inputValidation])

    // Handler para mudança de input com validação
    const handleInputChange = useCallback((value: string) => {
        setInput(value)
    }, [])

    // Handler para mudança de tipo de entrada
    const handleInputTypeChange = useCallback((type: 'key-value' | 'json' | 'csv') => {
        setInputType(type)
        setInput('')
        removeFile()
    }, [removeFile])

    // Handler para mudança de modo de entrada
    const handleInputModeChange = useCallback((mode: 'manual' | 'file') => {
        setInputMode(mode)
        if (mode === 'file') {
            setInput('')
        } else {
            removeFile()
        }
    }, [removeFile])

    // Handler para upload de arquivo
    const handleFileSelect = useCallback(async (file: File, content: string) => {
        const result = await uploadFile(file)
        if (result.success && result.file) {
            // Auto-detectar tipo baseado na extensão do arquivo
            const extension = file.name.split('.').pop()?.toLowerCase()
            let detectedType: 'key-value' | 'json' | 'csv' = config.defaultInputType

            switch (extension) {
                case 'json':
                    if (config.inputTypes.includes('json')) detectedType = 'json'
                    break
                case 'csv':
                case 'tsv':
                    if (config.inputTypes.includes('csv')) detectedType = 'csv'
                    break
                default:
                    detectedType = config.defaultInputType
            }

            setInputType(detectedType)
            setInput(content)
        }
    }, [uploadFile, config.inputTypes, config.defaultInputType])

    // Handler para remoção de arquivo
    const handleFileRemove = useCallback(() => {
        removeFile()
        setInput('')
    }, [removeFile])

    const handleConvert = async () => {
        if (!input.trim() && !uploadedFile) return

        try {
            const entrySource = createEntrySource(input, inputType)

            switch (config.outputFormat) {
                case 'json':
                    await buildFromSource(entrySource)
                    break
                case 'csv':
                    await buildToCsv(entrySource)
                    break
                case 'formdata':
                    await buildToFormData(entrySource)
                    break
            }
        } catch (error) {
            console.error('Erro ao criar EntrySource:', error)
        }
    }

    const handleCopy = async () => {
        if (result?.data) {
            let contentToCopy = result.data
            if (config.outputFormat === 'formdata' && result.data instanceof FormData) {
                contentToCopy = Array.from(result.data.entries())
                    .map(([key, value]) => `${key}=${value}`)
                    .join('\n')
            }
            await copyToClipboard(typeof contentToCopy === 'string' ? contentToCopy : JSON.stringify(contentToCopy, null, 2))
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleDownload = () => {
        if (result?.data) {
            let content = result.data
            let filename: string
            let mimeType: string

            switch (config.outputFormat) {
                case 'json':
                    content = JSON.stringify(result.data, null, 2)
                    filename = 'converted-data.json'
                    mimeType = 'application/json'
                    break
                case 'csv':
                    filename = 'converted-data.csv'
                    mimeType = 'text/csv'
                    break
                case 'formdata':
                    content = Array.from((result.data as FormData).entries())
                        .map(([key, value]) => `${key}=${value}`)
                        .join('\n')
                    filename = 'converted-data.txt'
                    mimeType = 'text/plain'
                    break
                default:
                    content = JSON.stringify(result.data, null, 2)
                    filename = 'converted-data.json'
                    mimeType = 'application/json'
            }

            downloadFile(content as string, filename, mimeType)
        }
    }

    const getSyntaxHighlighter = () => {
        if (config.outputFormat === 'json' && typeof result?.data === 'object') {
            return (
                <Suspense fallback={<div className="flex items-center justify-center h-[200px]"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
                    <SyntaxHighlighterWrapper code={JSON.stringify(result.data, null, 2)} />
                </Suspense>
            )
        }

        if (config.outputFormat === 'formdata' && result?.data instanceof FormData) {
            const entries = Array.from(result.data.entries())
            const formattedEntries = entries
                .map(([key, value]) => `${key}=${value}`)
                .join('\n')

            return (
                <pre className="text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                    {formattedEntries}
                </pre>
            )
        }

        return (
            <pre className="text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                {typeof result?.data === 'string' ? result.data : JSON.stringify(result?.data, null, 2)}
            </pre>
        )
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={config.title}
                description={config.description}
                breadcrumbs={breadcrumbs}
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
                            {/* Seletor de modo de entrada */}
                            <div className="flex space-x-2">
                                <Button
                                    variant={inputMode === 'manual' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleInputModeChange('manual')}
                                    className="flex items-center space-x-1"
                                >
                                    <FileText className="h-3 w-3" />
                                    <span>Digitar</span>
                                </Button>
                                <Button
                                    variant={inputMode === 'file' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleInputModeChange('file')}
                                    className="flex items-center space-x-1"
                                >
                                    <Upload className="h-3 w-3" />
                                    <span>Arquivo</span>
                                </Button>
                            </div>

                            {/* Seletor de tipo de entrada */}
                            <div className="flex space-x-2">
                                {config.inputTypes.map((type) => {
                                    const format = inputFormats[type]
                                    return (
                                        <Button
                                            key={type}
                                            variant={inputType === type ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => handleInputTypeChange(type)}
                                            className="flex items-center space-x-1"
                                        >
                                            {type === 'key-value' && <Code className="h-3 w-3" />}
                                            {type === 'json' && <Database className="h-3 w-3" />}
                                            {type === 'csv' && <Table className="h-3 w-3" />}
                                            <span>{format.name}</span>
                                        </Button>
                                    )
                                })}
                            </div>

                            {/* Descrição do formato atual */}
                            <div className="text-sm text-muted-foreground">
                                <p>{inputFormats[inputType].description}</p>
                            </div>

                            {inputMode === 'manual' ? (
                                <>
                                    <TextareaWithValidation
                                        placeholder={inputFormats[inputType].placeholder}
                                        value={input}
                                        onChange={handleInputChange}
                                        onValidate={validateInput}
                                        successMessage="Formato válido"
                                        className="min-h-[300px] font-mono text-sm"
                                    />

                                    {/* Botão para carregar exemplo */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setInput(inputFormats[inputType].example)}
                                    >
                                        Carregar Exemplo
                                    </Button>
                                </>
                            ) : (
                                <FileDropzone
                                    onFileSelect={handleFileSelect}
                                    onFileRemove={handleFileRemove}
                                    acceptedFileTypes={config.acceptedFileTypes}
                                    placeholder={config.placeholder}
                                />
                            )}

                            <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    {input.split('\n').filter(line => line.trim()).length} linhas
                                </div>
                                <Button
                                    onClick={handleConvert}
                                    disabled={
                                        (!input.trim() && !uploadedFile) ||
                                        isBuilding ||
                                        (inputMode === 'manual' && inputValidation.hasErrors)
                                    }
                                    loading={isBuilding}
                                    variant={
                                        (inputMode === 'manual' && inputValidation.hasErrors) ||
                                            (!input.trim() && !uploadedFile)
                                            ? "destructive"
                                            : "default"
                                    }
                                >
                                    <Zap className="mr-2 h-4 w-4" />
                                    {
                                        inputMode === 'manual' && inputValidation.hasErrors
                                            ? "Corrigir Erros"
                                            : (!input.trim() && !uploadedFile)
                                                ? "Selecione Dados"
                                                : `Converter para ${config.outputFormat.toUpperCase()}`
                                    }
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
                                        <config.icon className="h-5 w-5" />
                                        <span>Resultado {config.outputFormat.toUpperCase()}</span>
                                    </CardTitle>
                                    <CardDescription>
                                        {config.outputDescription}
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
                                        {getSyntaxHighlighter()}
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
                                        <config.icon className="mx-auto h-12 w-12 mb-2 opacity-50" />
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

// SyntaxHighlighter wrapper (simplified for this component)
function SyntaxHighlighterWrapper({ code }: { code: string }) {
    return (
        <pre className="text-sm font-mono whitespace-pre-wrap overflow-x-auto">
            {code}
        </pre>
    )
}
