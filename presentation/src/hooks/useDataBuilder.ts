import { useState, useCallback } from 'react'
import { DataReBuilder } from '@builder/data'
import type { EntrySource } from '@builder/data'

export interface DataBuilderResult {
    success: boolean
    data?: any
    error?: string
    executionTime?: number
}

export interface DataBuilderOptions {
    keySelector?: (key: any) => string
    valueSelector?: (value: any) => unknown
}

export function useDataBuilder() {
    const [isBuilding, setIsBuilding] = useState(false)
    const [result, setResult] = useState<DataBuilderResult | null>(null)

    const dataBuilder = new DataReBuilder()

    const buildFromSource = useCallback(async <TKey, TValue>(
        source: EntrySource<TKey, TValue>,
        options?: DataBuilderOptions
    ): Promise<DataBuilderResult> => {
        setIsBuilding(true)
        setResult(null)

        const startTime = performance.now()

        try {
            const pipeline = dataBuilder.rebuildFrom(source, options?.keySelector, options?.valueSelector)
            const json = pipeline.toJSON()

            const executionTime = performance.now() - startTime

            const successResult: DataBuilderResult = {
                success: true,
                data: json,
                executionTime
            }

            setResult(successResult)
            return successResult
        } catch (error) {
            const executionTime = performance.now() - startTime

            const errorResult: DataBuilderResult = {
                success: false,
                error: error instanceof Error ? error.message : 'Erro desconhecido',
                executionTime
            }

            setResult(errorResult)
            return errorResult
        } finally {
            setIsBuilding(false)
        }
    }, [dataBuilder])

    const buildToCsv = useCallback(async <TKey, TValue>(
        source: EntrySource<TKey, TValue>,
        options?: DataBuilderOptions
    ): Promise<DataBuilderResult> => {
        setIsBuilding(true)
        setResult(null)

        const startTime = performance.now()

        try {
            const pipeline = dataBuilder.rebuildFrom(source, options?.keySelector, options?.valueSelector)
            const csv = pipeline.toCsv()

            const executionTime = performance.now() - startTime

            const successResult: DataBuilderResult = {
                success: true,
                data: csv,
                executionTime
            }

            setResult(successResult)
            return successResult
        } catch (error) {
            const executionTime = performance.now() - startTime

            const errorResult: DataBuilderResult = {
                success: false,
                error: error instanceof Error ? error.message : 'Erro desconhecido',
                executionTime
            }

            setResult(errorResult)
            return errorResult
        } finally {
            setIsBuilding(false)
        }
    }, [dataBuilder])

    const buildToFormData = useCallback(async <TKey, TValue>(
        source: EntrySource<TKey, TValue>,
        options?: DataBuilderOptions
    ): Promise<DataBuilderResult> => {
        setIsBuilding(true)
        setResult(null)

        const startTime = performance.now()

        try {
            const pipeline = dataBuilder.rebuildFrom(source, options?.keySelector, options?.valueSelector)
            const formData = pipeline.toFormData()

            const executionTime = performance.now() - startTime

            const successResult: DataBuilderResult = {
                success: true,
                data: formData,
                executionTime
            }

            setResult(successResult)
            return successResult
        } catch (error) {
            const executionTime = performance.now() - startTime

            const errorResult: DataBuilderResult = {
                success: false,
                error: error instanceof Error ? error.message : 'Erro desconhecido',
                executionTime
            }

            setResult(errorResult)
            return errorResult
        } finally {
            setIsBuilding(false)
        }
    }, [dataBuilder])

    const clearResult = useCallback(() => {
        setResult(null)
    }, [])

    return {
        isBuilding,
        result,
        buildFromSource,
        buildToCsv,
        buildToFormData,
        clearResult
    }
}
