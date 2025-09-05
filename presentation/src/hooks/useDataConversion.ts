import { useState, useCallback } from 'react'
import type { ConversionResult, FileUpload } from '@/types'

export function useDataConversion() {
    const [isConverting, setIsConverting] = useState(false)
    const [result, setResult] = useState<ConversionResult | null>(null)
    const [uploadedFile, setUploadedFile] = useState<FileUpload | null>(null)

    const convert = useCallback(async (
        converter: (data: any) => Promise<any> | any,
        data: any
    ): Promise<ConversionResult> => {
        setIsConverting(true)
        setResult(null)

        const startTime = performance.now()

        try {
            const convertedData = await converter(data)
            const executionTime = performance.now() - startTime

            const successResult: ConversionResult = {
                success: true,
                data: convertedData,
                executionTime
            }

            setResult(successResult)
            return successResult
        } catch (error) {
            const executionTime = performance.now() - startTime

            const errorResult: ConversionResult = {
                success: false,
                error: error instanceof Error ? error.message : 'Erro desconhecido',
                executionTime
            }

            setResult(errorResult)
            return errorResult
        } finally {
            setIsConverting(false)
        }
    }, [])

    const handleFileUpload = useCallback((file: File) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const content = e.target?.result as string
            setUploadedFile({
                file,
                content,
                size: file.size,
                type: file.type
            })
        }
        reader.readAsText(file)
    }, [])

    const clearResult = useCallback(() => {
        setResult(null)
    }, [])

    const clearFile = useCallback(() => {
        setUploadedFile(null)
    }, [])

    return {
        isConverting,
        result,
        uploadedFile,
        convert,
        handleFileUpload,
        clearResult,
        clearFile
    }
}
