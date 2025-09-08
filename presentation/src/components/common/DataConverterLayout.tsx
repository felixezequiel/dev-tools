import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TextareaWithValidation } from '@/components/ui/TextareaWithValidation'
import { CodeEditor } from '@/components/common/ui/CodeEditor'
import { SqlResult } from '@/components/common/results/SqlResult'
import { JsonResult } from '@/components/common/results/JsonResult'
import { FileDropzone } from '@/components/common/FileDropzone'
import { Badge } from '@/components/ui/Badge'
import { useConversion } from '@/hooks/useConversion'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useInputValidationByType } from '@/hooks/useInputValidation'
import { createEntrySource, inputFormats } from '@/lib/entrySources'
import type { InputType } from '@/config/data-support'
// removed SyntaxHighlighterWrapper (using Monaco editor now)
// yaml rendering handled via dynamic require inside render to avoid type issues
// ResultRendererProps é usado apenas para tipos no ResultComponent
import { InputModeToggle } from '@/components/common/ui/InputModeToggle'
import { InputTypeButtons } from '@/components/common/ui/InputTypeButtons'
import { ConverterInfo } from '@/components/common/ConverterInfo'
import { SectionHeading } from '@/components/common/ui/SectionHeading'
import type { DataConverterConfig } from '@/types/converter'
import { FileText, Download, Copy, Check, AlertCircle, Zap } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { AdSlot } from '@/components/ads/AdSlot'

// DataConverterConfig movido para '@/types/converter'

interface DataConverterLayoutProps {
    config: DataConverterConfig
}

export function DataConverterLayout({ config }: DataConverterLayoutProps) {
    const { t } = useTranslation()
    const [input, setInput] = useState('')
    const [inputType, setInputType] = useState<InputType>(config.defaultInputType)
    const [inputMode, setInputMode] = useState<'manual' | 'file'>('manual')
    const [copied, setCopied] = useState(false)
    const { isBuilding, result, sqlMode, regenerateSql, copy, download, convert } = useConversion(config)
    const [version, setVersion] = useState(0)
    const [updatedAt, setUpdatedAt] = useState<number | null>(null)
    const [justUpdated, setJustUpdated] = useState(false)
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
            let detectedType: InputType = config.defaultInputType

            switch (extension) {
                case 'json':
                    if (config.inputTypes.includes('json')) detectedType = 'json'
                    break
                case 'csv':
                case 'tsv':
                    if (config.inputTypes.includes('csv')) detectedType = 'csv'
                    break
                case 'yaml':
                case 'yml':
                    if (config.inputTypes.includes('yaml')) detectedType = 'yaml'
                    break
                case 'xml':
                    if (config.inputTypes.includes('xml')) detectedType = 'xml'
                    break
                case 'sql':
                    if (config.inputTypes.includes('sql')) detectedType = 'sql'
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
            await convert(entrySource)
            setVersion(v => v + 1)
            const now = Date.now()
            setUpdatedAt(now)
            setJustUpdated(true)
            setTimeout(() => setJustUpdated(false), 1500)
        } catch (error) {
            console.error('Erro ao criar EntrySource:', error)
        }
    }

    const handleCopy = async () => {
        await copy()
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        download()
    }

    return (
        <div className="space-y-6">
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
                                        <span>{t('inputData')}</span>
                                    </CardTitle>
                                    <CardDescription>
                                        {t('inputSectionDescription')}
                                    </CardDescription>
                                    <div className="mt-2">
                                        <ConverterInfo usage={config.usage} />
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Passo 1: Tipo de entrada */}
                                <div className="space-y-2">
                                    <SectionHeading step={1} title={t('chooseDataType')} description={t('chooseDataTypeDesc')} />
                                    <InputTypeButtons allowedTypes={config.inputTypes} current={inputType} onChange={handleInputTypeChange} />
                                </div>

                                {/* Passo 2: Modo */}
                                <div className="space-y-2">
                                    <SectionHeading step={2} title={t('chooseHowToInsert')} description={t('chooseHowToInsertDesc')} />
                                    <InputModeToggle mode={inputMode} onChange={handleInputModeChange} />
                                </div>

                                {/* Dica do formato atual */}
                                <div className="text-xs text-muted-foreground">
                                    <p>{inputFormats[inputType].description}</p>
                                </div>

                                {/* Passo 3: Inserção de dados */}
                                <div className="space-y-2">
                                    <SectionHeading step={3} title={t('insertData')} description={t('insertDataDesc')} />
                                    {inputMode === 'manual' ? (
                                        <>
                                            <div className="space-y-2">
                                                <CodeEditor
                                                    value={input}
                                                    onChange={handleInputChange}
                                                    language={inputType === 'json' ? 'json' : inputType === 'yaml' ? 'yaml' : inputType === 'xml' ? 'xml' : 'plaintext'}
                                                    height={320}
                                                />
                                                <TextareaWithValidation
                                                    placeholder={inputFormats[inputType].placeholder}
                                                    value={input}
                                                    onChange={handleInputChange}
                                                    onValidate={validateInput}
                                                    successMessage={t('validFormat')}
                                                    className="hidden"
                                                />
                                            </div>
                                            <Button variant="outline" size="sm" onClick={() => setInput(inputFormats[inputType].example)}>
                                                {t('loadExample')}
                                            </Button>
                                        </>
                                    ) : (
                                        <FileDropzone
                                            onFileSelect={handleFileSelect}
                                            onFileRemove={handleFileRemove}
                                            acceptedFileTypes={config.acceptedFileTypes}
                                            placeholder={t(config.placeholder)}
                                        />
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground">
                                            {input.split('\n').filter(line => line.trim()).length} {t('lines')}
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
                                                    ? t('conversionError')
                                                    : (!input.trim() && !uploadedFile)
                                                        ? '—'
                                                        : `${t('convertTo')} ${config.outputFormat.toUpperCase()}`
                                            }
                                        </Button>
                                    </div>
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
                    className="space-y-4"
                >
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center space-x-2">
                                        <config.icon className="h-5 w-5" />
                                        <span>{t('result')} {config.outputFormat.toUpperCase()}</span>
                                    </CardTitle>
                                    <CardDescription>
                                        {config.outputDescription}
                                    </CardDescription>
                                </div>
                                {result?.success && !config.ResultComponent && !(config.outputFormat === 'sql' || config.outputFormat === 'sql-insert' || config.outputFormat === 'sql-update' || config.outputFormat === 'sql-create-table' || config.outputFormat === 'json') && (
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
                        <CardContent className="space-y-4">
                            {result?.success ? (
                                config.ResultComponent ? (
                                    <config.ResultComponent
                                        config={config}
                                        result={result}
                                        onCopy={handleCopy}
                                        onDownload={handleDownload}
                                        input={input}
                                        inputType={inputType}
                                        version={version}
                                        updatedAt={updatedAt}
                                        justUpdated={justUpdated}
                                    />
                                ) : (
                                    <div className="space-y-4">
                                        {!(config.outputFormat === 'sql' || config.outputFormat === 'sql-insert' || config.outputFormat === 'sql-update' || config.outputFormat === 'sql-create-table' || config.outputFormat === 'json') && (
                                            <div className="flex items-center space-x-2">
                                                <Badge variant="success">{t('success')}</Badge>
                                                {result.executionTime && (
                                                    <span className="text-sm text-muted-foreground">
                                                        {result.executionTime.toFixed(2)}ms
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        {config.outputFormat === 'sql' && (
                                            <div className="flex flex-wrap gap-2">
                                                <Button
                                                    variant={sqlMode === 'insert' ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={async () => {
                                                        await regenerateSql('insert', createEntrySource(input, inputType))
                                                    }}
                                                >
                                                    INSERT
                                                </Button>
                                                <Button
                                                    variant={sqlMode === 'update' ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={async () => {
                                                        await regenerateSql('update', createEntrySource(input, inputType))
                                                    }}
                                                >
                                                    UPDATE
                                                </Button>
                                                <Button
                                                    variant={sqlMode === 'create-table' ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={async () => {
                                                        await regenerateSql('create-table', createEntrySource(input, inputType))
                                                    }}
                                                >
                                                    CREATE TABLE
                                                </Button>
                                            </div>
                                        )}
                                        <div className="rounded-md border bg-muted/50 p-2">
                                            {(() => {
                                                if (config.outputFormat === 'json') {
                                                    return (
                                                        <JsonResult
                                                            result={result}
                                                            onCopy={handleCopy}
                                                            onDownload={handleDownload}
                                                            version={version}
                                                            updatedAt={updatedAt}
                                                            justUpdated={justUpdated}
                                                        />
                                                    )
                                                }
                                                if (config.outputFormat === 'yaml') {
                                                    const code = typeof result?.data === 'string' ? result.data : (require('js-yaml') as any).dump(result?.data ?? {}, { indent: 2, lineWidth: 120 })
                                                    return <CodeEditor value={code} onChange={() => { }} readOnly language="yaml" height={360} />
                                                }
                                                if (config.outputFormat === 'xml') {
                                                    const code = typeof result?.data === 'string' ? result.data : String(result?.data ?? '')
                                                    return <CodeEditor value={code} onChange={() => { }} readOnly language="xml" height={360} />
                                                }
                                                if (config.outputFormat === 'sql' || config.outputFormat === 'sql-insert' || config.outputFormat === 'sql-update' || config.outputFormat === 'sql-create-table') {
                                                    return (
                                                        <SqlResult
                                                            result={result}
                                                            onCopy={handleCopy}
                                                            onDownload={handleDownload}
                                                            version={version}
                                                            updatedAt={updatedAt}
                                                            justUpdated={justUpdated}
                                                        />
                                                    )
                                                }
                                                const code = typeof result?.data === 'string' ? result.data : JSON.stringify(result?.data ?? {}, null, 2)
                                                return <CodeEditor value={code} onChange={() => { }} readOnly language="plaintext" height={360} />
                                            })()}
                                        </div>
                                    </div>
                                )
                            ) : result?.error ? (
                                <div className="flex items-center space-x-2 rounded-md border border-destructive/50 bg-destructive/5 p-4">
                                    <AlertCircle className="h-5 w-5 text-destructive" />
                                    <div>
                                        <p className="font-medium text-destructive">{t('conversionError')}</p>
                                        <p className="text-sm text-muted-foreground">{result.error}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed text-muted-foreground">
                                    <div className="text-center">
                                        <config.icon className="mx-auto h-12 w-12 mb-2 opacity-50" />
                                        <p>{t('insertDataConvertSeeResult')}</p>
                                    </div>
                                </div>
                            )}
                            {/* Output footer ad */}
                            <AdSlot slot="converter_output_footer" />
                        </CardContent>

                    </Card>

                    <AdSlot slot="converter_output_footer" />
                </motion.div>
            </div>
        </div>
    )
}

// SyntaxHighlighterWrapper agora vem de '@/components/common/ui/SyntaxHighlighterWrapper'
