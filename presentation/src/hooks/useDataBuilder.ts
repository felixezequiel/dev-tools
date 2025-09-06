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

    const buildToXml = useCallback(async <TKey, TValue>(
        source: EntrySource<TKey, TValue>,
        options?: DataBuilderOptions
    ): Promise<DataBuilderResult> => {
        setIsBuilding(true)
        setResult(null)

        const startTime = performance.now()

        try {
            const pipeline = dataBuilder.rebuildFrom(source, options?.keySelector, options?.valueSelector)
            const xml = pipeline.toXml()
            const executionTime = performance.now() - startTime
            const successResult: DataBuilderResult = { success: true, data: xml, executionTime }
            setResult(successResult)
            return successResult
        } catch (error) {
            const executionTime = performance.now() - startTime
            const errorResult: DataBuilderResult = { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido', executionTime }
            setResult(errorResult)
            return errorResult
        } finally {
            setIsBuilding(false)
        }
    }, [dataBuilder])

    const buildToYaml = useCallback(async <TKey, TValue>(
        source: EntrySource<TKey, TValue>,
        options?: DataBuilderOptions
    ): Promise<DataBuilderResult> => {
        setIsBuilding(true)
        setResult(null)

        const startTime = performance.now()

        try {
            const pipeline = dataBuilder.rebuildFrom(source, options?.keySelector, options?.valueSelector)
            const yaml = pipeline.toYaml()
            const executionTime = performance.now() - startTime
            const successResult: DataBuilderResult = { success: true, data: yaml, executionTime }
            setResult(successResult)
            return successResult
        } catch (error) {
            const executionTime = performance.now() - startTime
            const errorResult: DataBuilderResult = { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido', executionTime }
            setResult(errorResult)
            return errorResult
        } finally {
            setIsBuilding(false)
        }
    }, [dataBuilder])

    const buildToSqlInsert = useCallback(async <TKey, TValue>(
        source: EntrySource<TKey, TValue>,
        options?: DataBuilderOptions & { tableName?: string }
    ): Promise<DataBuilderResult> => {
        setIsBuilding(true)
        setResult(null)

        const startTime = performance.now()

        try {
            const pipeline = dataBuilder.rebuildFrom(source, options?.keySelector, options?.valueSelector)
            const sql = pipeline.toSqlInsert({ tableName: options?.tableName ?? 'table' })
            const executionTime = performance.now() - startTime
            const successResult: DataBuilderResult = { success: true, data: sql, executionTime }
            setResult(successResult)
            return successResult
        } catch (error) {
            const executionTime = performance.now() - startTime
            const errorResult: DataBuilderResult = { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido', executionTime }
            setResult(errorResult)
            return errorResult
        } finally {
            setIsBuilding(false)
        }
    }, [dataBuilder])

    const buildToSqlUpdate = useCallback(async <TKey, TValue>(
        source: EntrySource<TKey, TValue>,
        options?: DataBuilderOptions & { tableName?: string; primaryKey?: string; whereClause?: string }
    ): Promise<DataBuilderResult> => {
        setIsBuilding(true)
        setResult(null)

        const startTime = performance.now()

        try {
            const pipeline = dataBuilder.rebuildFrom(source, options?.keySelector, options?.valueSelector)
            const sql = pipeline.toSqlUpdate({
                tableName: options?.tableName ?? 'table',
                primaryKey: options?.primaryKey ?? 'id',
                whereClause: options?.whereClause ?? '1=1'
            })
            const executionTime = performance.now() - startTime
            const successResult: DataBuilderResult = { success: true, data: sql, executionTime }
            setResult(successResult)
            return successResult
        } catch (error) {
            const executionTime = performance.now() - startTime
            const errorResult: DataBuilderResult = { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido', executionTime }
            setResult(errorResult)
            return errorResult
        } finally {
            setIsBuilding(false)
        }
    }, [dataBuilder])

    const buildToSqlCreateTable = useCallback(async <TKey, TValue>(
        source: EntrySource<TKey, TValue>,
        options?: DataBuilderOptions & { tableName?: string }
    ): Promise<DataBuilderResult> => {
        setIsBuilding(true)
        setResult(null)

        const startTime = performance.now()

        try {
            const pipeline = dataBuilder.rebuildFrom(source, options?.keySelector, options?.valueSelector)
            const sql = pipeline.toSqlCreateTable({ tableName: options?.tableName ?? 'table' })
            const executionTime = performance.now() - startTime
            const successResult: DataBuilderResult = { success: true, data: sql, executionTime }
            setResult(successResult)
            return successResult
        } catch (error) {
            const executionTime = performance.now() - startTime
            const errorResult: DataBuilderResult = { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido', executionTime }
            setResult(errorResult)
            return errorResult
        } finally {
            setIsBuilding(false)
        }
    }, [dataBuilder])

    const buildToOpenApi = useCallback(async <TKey, TValue>(
        source: EntrySource<TKey, TValue>,
        options?: DataBuilderOptions & { title?: string; endpoint?: string; method?: string }
    ): Promise<DataBuilderResult> => {
        setIsBuilding(true)
        setResult(null)

        const startTime = performance.now()

        try {
            const pipeline = dataBuilder.rebuildFrom(source, options?.keySelector, options?.valueSelector)
            const spec = pipeline.toOpenApiSpec({ title: options?.title ?? 'API', endpoint: options?.endpoint ?? '/endpoint', method: (options?.method as any) ?? 'POST' })
            const executionTime = performance.now() - startTime
            const successResult: DataBuilderResult = { success: true, data: spec, executionTime }
            setResult(successResult)
            return successResult
        } catch (error) {
            const executionTime = performance.now() - startTime
            const errorResult: DataBuilderResult = { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido', executionTime }
            setResult(errorResult)
            return errorResult
        } finally {
            setIsBuilding(false)
        }
    }, [dataBuilder])

    const buildToJsonSchema = useCallback(async <TKey, TValue>(
        source: EntrySource<TKey, TValue>,
        options?: DataBuilderOptions
    ): Promise<DataBuilderResult> => {
        setIsBuilding(true)
        setResult(null)

        const startTime = performance.now()

        try {
            const pipeline = dataBuilder.rebuildFrom(source, options?.keySelector, options?.valueSelector)
            const schema = pipeline.toJsonSchema()
            const executionTime = performance.now() - startTime
            const successResult: DataBuilderResult = { success: true, data: schema, executionTime }
            setResult(successResult)
            return successResult
        } catch (error) {
            const executionTime = performance.now() - startTime
            const errorResult: DataBuilderResult = { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido', executionTime }
            setResult(errorResult)
            return errorResult
        } finally {
            setIsBuilding(false)
        }
    }, [dataBuilder])

    const buildToDatabaseMigration = useCallback(async <TKey, TValue>(
        source: EntrySource<TKey, TValue>,
        options?: DataBuilderOptions & { tableName?: string; includeData?: boolean }
    ): Promise<DataBuilderResult> => {
        setIsBuilding(true)
        setResult(null)

        const startTime = performance.now()

        try {
            const pipeline = dataBuilder.rebuildFrom(source, options?.keySelector, options?.valueSelector)
            const migration = pipeline.toDatabaseMigration({ tableName: options?.tableName ?? 'table', includeData: options?.includeData ?? true })
            const executionTime = performance.now() - startTime
            const successResult: DataBuilderResult = { success: true, data: migration, executionTime }
            setResult(successResult)
            return successResult
        } catch (error) {
            const executionTime = performance.now() - startTime
            const errorResult: DataBuilderResult = { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido', executionTime }
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
        buildToXml,
        buildToYaml,
        buildToSqlInsert,
        buildToSqlUpdate,
        buildToSqlCreateTable,
        buildToOpenApi,
        buildToJsonSchema,
        buildToDatabaseMigration,
        clearResult
    }
}
