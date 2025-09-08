import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatFileSize } from '@/lib/utils'
import {
    Upload,
    FileText,
    FileJson,
    Table,
    X,
    AlertCircle,
    CheckCircle,
    Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

export interface FileDropzoneProps {
    onFileSelect: (file: File, content: string) => void
    onFileRemove?: () => void
    acceptedFileTypes?: string[]
    maxSize?: number // in bytes
    placeholder?: string
    className?: string
    disabled?: boolean
}

const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()

    switch (extension) {
        case 'json':
            return FileJson
        case 'csv':
        case 'txt':
        case 'tsv':
            return Table
        default:
            return FileText
    }
}

const getFileTypeColor = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()

    switch (extension) {
        case 'json':
            return 'text-blue-600 bg-blue-50 border-blue-200'
        case 'csv':
        case 'txt':
        case 'tsv':
            return 'text-green-600 bg-green-50 border-green-200'
        default:
            return 'text-gray-600 bg-gray-50 border-gray-200'
    }
}

export function FileDropzone({
    onFileSelect,
    onFileRemove,
    acceptedFileTypes = ['.json', '.csv', '.txt', '.tsv'],
    maxSize = 10 * 1024 * 1024, // 10MB
    placeholder = "Arraste e solte um arquivo aqui, ou clique para selecionar",
    className,
    disabled = false
}: FileDropzoneProps) {
    const { t } = useTranslation()
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return

        setIsProcessing(true)
        setError(null)

        try {
            const content = await file.text()
            setSelectedFile(file)
            onFileSelect(file, content)
        } catch (err) {
            setError(t('readFileError'))
            console.error('Erro ao ler arquivo:', err)
        } finally {
            setIsProcessing(false)
        }
    }, [onFileSelect])

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'text/*': acceptedFileTypes,
            'application/json': ['.json'],
            'text/csv': ['.csv'],
            'text/tab-separated-values': ['.tsv']
        },
        maxSize,
        multiple: false,
        disabled
    })

    const handleRemoveFile = () => {
        setSelectedFile(null)
        setError(null)
        onFileRemove?.()
    }

    const FileIcon = selectedFile ? getFileIcon(selectedFile.name) : Upload

    return (
        <div className={cn('space-y-4', className)}>
            <AnimatePresence mode="wait">
                {!selectedFile ? (
                    <motion.div
                        key="dropzone"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card
                            {...getRootProps()}
                            className={cn(
                                'cursor-pointer transition-all duration-200 border-2 border-dashed',
                                isDragActive && !isDragReject && 'border-primary bg-primary/5 scale-105',
                                isDragReject && 'border-destructive bg-destructive/5',
                                disabled && 'cursor-not-allowed opacity-50',
                                'hover:border-primary/50 hover:bg-primary/5'
                            )}
                        >
                            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                                <input {...getInputProps()} />
                                <motion.div
                                    animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FileIcon className="h-12 w-12 text-muted-foreground mb-4" />
                                </motion.div>

                                <div className="space-y-2">
                                    <p className="text-sm font-medium">
                                        {isDragActive
                                            ? isDragReject
                                                ? t('unsupportedFile')
                                                : t('dropHere')
                                            : placeholder
                                        }
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {t('acceptedTypes')}: {acceptedFileTypes.join(', ')}
                                        {' • '} {t('maxSize')}: {formatFileSize(maxSize)}
                                    </p>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mt-4"
                                    disabled={disabled}
                                >
                                    {t('selectFile')}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        key="file-preview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-start space-x-4">
                                    <div className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-lg border',
                                        getFileTypeColor(selectedFile.name)
                                    )}>
                                        {isProcessing ? (
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        ) : (
                                            <FileIcon className="h-6 w-6" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-medium truncate">
                                                {selectedFile.name}
                                            </h4>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={handleRemoveFile}
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                disabled={disabled}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="flex items-center space-x-4 mt-2">
                                            <Badge variant="secondary" className="text-xs">
                                                {formatFileSize(selectedFile.size)}
                                            </Badge>
                                            <Badge variant="outline" className="text-xs">
                                                {selectedFile.type || 'text/plain'}
                                            </Badge>
                                        </div>

                                        {error && (
                                            <div className="flex items-center space-x-2 mt-2 text-destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <span className="text-xs">{error}</span>
                                            </div>
                                        )}

                                        {isProcessing && (
                                            <div className="flex items-center space-x-2 mt-2 text-muted-foreground">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span className="text-xs">{t('processingFile')}</span>
                                            </div>
                                        )}

                                        {!isProcessing && !error && (
                                            <div className="flex items-center space-x-2 mt-2 text-green-600">
                                                <CheckCircle className="h-4 w-4" />
                                                <span className="text-xs">{t('fileLoadedSuccess')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
