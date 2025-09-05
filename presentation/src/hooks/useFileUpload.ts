import { useState, useCallback } from 'react'
import type { FileUpload } from '@/types'

export interface FileUploadResult {
    success: boolean
    file?: FileUpload
    error?: string
}

export function useFileUpload() {
    const [uploadedFile, setUploadedFile] = useState<FileUpload | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    const uploadFile = useCallback(async (file: File): Promise<FileUploadResult> => {
        setIsUploading(true)

        try {
            // Validar tamanho do arquivo (máximo 10MB)
            const maxSize = 10 * 1024 * 1024 // 10MB
            if (file.size > maxSize) {
                return {
                    success: false,
                    error: `Arquivo muito grande. Máximo permitido: ${formatFileSize(maxSize)}`
                }
            }

            // Validar tipo do arquivo
            const allowedTypes = [
                'text/plain',
                'application/json',
                'text/csv',
                'text/tab-separated-values',
                'text/x-typescript',
                'application/typescript'
            ]

            const allowedExtensions = ['.txt', '.json', '.csv', '.tsv', '.ts']
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

            const isValidType = allowedTypes.includes(file.type) ||
                allowedExtensions.includes(fileExtension) ||
                file.type.startsWith('text/')

            if (!isValidType) {
                return {
                    success: false,
                    error: 'Tipo de arquivo não suportado. Use: .txt, .json, .csv, .tsv, .ts'
                }
            }

            // Ler conteúdo do arquivo
            const content = await file.text()

            const fileUpload: FileUpload = {
                file,
                content,
                size: file.size,
                type: file.type || 'text/plain'
            }

            setUploadedFile(fileUpload)

            return {
                success: true,
                file: fileUpload
            }
        } catch (error) {
            console.error('Erro ao fazer upload do arquivo:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erro desconhecido ao fazer upload'
            }
        } finally {
            setIsUploading(false)
        }
    }, [])

    const removeFile = useCallback(() => {
        setUploadedFile(null)
    }, [])

    const clearUpload = useCallback(() => {
        setUploadedFile(null)
        setIsUploading(false)
    }, [])

    // Função utilitária para formatar tamanho de arquivo
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return {
        uploadedFile,
        isUploading,
        uploadFile,
        removeFile,
        clearUpload,
        formatFileSize
    }
}
