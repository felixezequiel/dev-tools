import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TextareaWithValidation } from '@/components/ui/TextareaWithValidation'
import { FileDropzone } from '@/components/common/FileDropzone'
import { Badge } from '@/components/ui/Badge'
import { useDataBuilder } from '@/hooks/useDataBuilder'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useInputValidationByType } from '@/hooks/useInputValidation'
import { InputModeToggle } from '@/components/common/ui/InputModeToggle'
import { InputTypeButtons } from '@/components/common/ui/InputTypeButtons'
import { SectionHeading } from '@/components/common/ui/SectionHeading'
import { createEntrySource, inputFormats } from '@/lib/entrySources'
import type { InputType } from '@/config/data-support'
import { copyToClipboard } from '@/lib/utils'
import { FileText, Copy, Check, AlertCircle, Zap, Eye, EyeOff, Database } from 'lucide-react'

interface FormDataConverterLayoutProps {
    breadcrumbs: Array<{ label: string; path?: string; isActive?: boolean }>
}

export function FormDataConverterLayout({ breadcrumbs }: FormDataConverterLayoutProps) {
    const [input, setInput] = useState('')
    const [inputType, setInputType] = useState<InputType>('json')
    const [inputMode, setInputMode] = useState<'manual' | 'file'>('manual')
    const [showPreview, setShowPreview] = useState(false)
    const [copied, setCopied] = useState(false)

    const { isBuilding, result, buildToFormData } = useDataBuilder()
    const { uploadedFile, uploadFile, removeFile } = useFileUpload()

    const { validation: inputValidation, validateInput } = useInputValidationByType(inputType)

    // validateInput fornecido por hook centralizado

    // Handler para mudança de input com validação
    const handleInputChange = useCallback((value: string) => {
        setInput(value)
    }, [])

    // Handler para mudança de tipo de entrada
    const handleInputTypeChange = useCallback((type: InputType) => {
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
            let detectedType: InputType = 'json'

            switch (extension) {
                case 'json':
                    detectedType = 'json'
                    break
                case 'csv':
                case 'tsv':
                    detectedType = 'csv'
                    break
                case 'yaml':
                case 'yml':
                    detectedType = 'yaml'
                    break
                case 'xml':
                    detectedType = 'xml'
                    break
                case 'sql':
                    detectedType = 'sql'
                    break
                default:
                    detectedType = 'json'
            }

            setInputType(detectedType)
            setInput(content)
        }
    }, [uploadFile])

    // Handler para remoção de arquivo
    const handleFileRemove = useCallback(() => {
        removeFile()
        setInput('')
    }, [removeFile])

    const handleConvert = async () => {
        if (!input.trim() && !uploadedFile) return

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

    const togglePreview = () => {
        setShowPreview(!showPreview)
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Converter para FormData"
                description="Escolha o modo de entrada (Digitar ou Arquivo) e o tipo de formato abaixo para inserir seus dados e gerar um FormData com preview."
                breadcrumbs={breadcrumbs}
            />

            <div className="grid gap-8 lg:grid-cols-2">
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
                                        Escolha o modo de entrada (Digitar ou Arquivo) e o tipo de formato abaixo para inserir seus dados.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                            {/* Passo 1: Tipo de entrada */}
                            <SectionHeading step={1} title="Escolha o tipo de dados" description="Selecione o formato que melhor representa seus dados." />
                            <div className="space-y-2">
                                <InputTypeButtons
                                    allowedTypes={['key-value', 'json', 'csv', 'yaml', 'xml', 'openapi', 'json-schema', 'sql'] as any}
                                    current={inputType}
                                    onChange={handleInputTypeChange}
                                />
                            </div>

                            {/* Passo 2: Modo */}
                            <SectionHeading step={2} title="Escolha como inserir" description="Digite manualmente ou envie um arquivo." />
                            <div className="space-y-2">
                                <InputModeToggle mode={inputMode} onChange={handleInputModeChange} />
                            </div>

                            {/* Dica do formato atual */}
                            <div className="text-xs text-muted-foreground"><p>{inputFormats[inputType].description}</p></div>

                            {/* Passo 3: Inserção de dados */}
                            <SectionHeading step={3} title="Insira os dados" description="Cole ou digite os dados conforme o formato selecionado." />
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
                                    <Button variant="outline" size="sm" onClick={() => setInput(inputFormats[inputType].example)}>
                                        Carregar Exemplo
                                    </Button>
                                </>
                            ) : (
                                <FileDropzone
                                    onFileSelect={handleFileSelect}
                                    onFileRemove={handleFileRemove}
                                    acceptedFileTypes={['.json', '.csv', '.yaml', '.yml', '.xml', '.sql', '.txt', '.tsv', '.ts']}
                                    placeholder="Arraste um arquivo JSON, CSV, YAML, XML, SQL ou TXT aqui"
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
                                                : "Converter para FormData"
                                    }
                                </Button>
                            </div>
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
                                            onClick={togglePreview}
                                        >
                                            {showPreview ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
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
                                                    <p className="text-lg font-medium text-primary">
                                                        FormData criado com sucesso!
                                                    </p>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {getFormDataPreview(result.data as FormData).length} campos processados
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={togglePreview}
                                                    className="mt-4"
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Visualizar Conteúdo
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-4"
                                        >
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
                                                    onClick={togglePreview}
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
                                                                <span className="text-xs font-medium text-primary">
                                                                    {index + 1}
                                                                </span>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center space-x-2 mb-1">
                                                                    <span className="font-mono text-sm font-medium text-primary">
                                                                        {key}
                                                                    </span>
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
                                                <span>
                                                    Total: {getFormDataPreview(result.data as FormData).length} entradas
                                                </span>
                                                <span>
                                                    Tamanho estimado: ~{new Blob([Array.from((result.data as FormData).entries()).map(([k, v]) => `${k}=${v}`).join('&')]).size} bytes
                                                </span>
                                            </div>
                                        </motion.div>
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
