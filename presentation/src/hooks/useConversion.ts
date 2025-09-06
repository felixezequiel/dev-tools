import { useCallback, useRef, useState } from 'react'
import type { EntrySource } from '@builder/data'
import { useDataBuilder } from '@/hooks/useDataBuilder'
import { copyToClipboard, downloadFile } from '@/lib/utils'
import type { DataConverterConfig } from '@/types/converter'
import { formatSql } from '@/lib/sqlFormatter'

type SqlMode = 'insert' | 'update' | 'create-table'

export function useConversion(config: DataConverterConfig) {
    const [sqlMode, setSqlMode] = useState<SqlMode>('insert')
    const lastEntrySourceRef = useRef<EntrySource<any, any> | null>(null)

    const {
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
        buildToDatabaseMigration
    } = useDataBuilder()

    const convert = useCallback(async (entrySource: EntrySource<any, any>) => {
        lastEntrySourceRef.current = entrySource
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
            case 'xml':
                await buildToXml(entrySource)
                break
            case 'yaml':
                await buildToYaml(entrySource)
                break
            case 'sql':
                if (sqlMode === 'insert') await buildToSqlInsert(entrySource)
                else if (sqlMode === 'update') await buildToSqlUpdate(entrySource)
                else await buildToSqlCreateTable(entrySource)
                break
            case 'sql-insert':
                await buildToSqlInsert(entrySource)
                break
            case 'sql-update':
                await buildToSqlUpdate(entrySource)
                break
            case 'sql-create-table':
                await buildToSqlCreateTable(entrySource)
                break
            case 'openapi':
                await buildToOpenApi(entrySource)
                break
            case 'json-schema':
                await buildToJsonSchema(entrySource)
                break
            case 'db-migration':
                await buildToDatabaseMigration(entrySource)
                break
        }
    }, [config.outputFormat, sqlMode, buildFromSource, buildToCsv, buildToFormData, buildToXml, buildToYaml, buildToSqlInsert, buildToSqlUpdate, buildToSqlCreateTable, buildToOpenApi, buildToJsonSchema, buildToDatabaseMigration])

    const regenerateSql = useCallback(async (mode: SqlMode, entrySource?: EntrySource<any, any>) => {
        setSqlMode(mode)
        const src = entrySource ?? lastEntrySourceRef.current
        if (!src) return
        if (mode === 'insert') await buildToSqlInsert(src)
        else if (mode === 'update') await buildToSqlUpdate(src)
        else await buildToSqlCreateTable(src)
    }, [buildToSqlInsert, buildToSqlUpdate, buildToSqlCreateTable])

    const getCopyContent = useCallback((): string | null => {
        if (!result?.success || result.data == null) return null

        switch (config.outputFormat) {
            case 'json':
            case 'openapi':
            case 'json-schema':
                return typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
            case 'csv':
                return typeof result.data === 'string' ? result.data : String(result.data)
            case 'sql':
            case 'sql-insert':
            case 'sql-update':
            case 'sql-create-table':
                return formatSql(typeof result.data === 'string' ? result.data : String(result.data))
            case 'xml':
            case 'yaml':
            case 'db-migration':
                return typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
            case 'formdata':
                if (result.data instanceof FormData) {
                    return Array.from(result.data.entries()).map(([k, v]) => `${k}=${v}`).join('\n')
                }
                return String(result.data)
            default:
                return typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
        }
    }, [config.outputFormat, result])

    const copy = useCallback(async () => {
        const content = getCopyContent()
        if (content) await copyToClipboard(content)
    }, [getCopyContent])

    const download = useCallback(() => {
        if (!result?.success || result.data == null) return
        let content: string = ''
        let filename = 'converted-data.txt'
        let mimeType = 'text/plain'

        switch (config.outputFormat) {
            case 'json':
                content = typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
                filename = 'converted-data.json'
                mimeType = 'application/json'
                break
            case 'csv':
                content = typeof result.data === 'string' ? result.data : String(result.data)
                filename = 'converted-data.csv'
                mimeType = 'text/csv'
                break
            case 'formdata':
                if (result.data instanceof FormData) {
                    content = Array.from(result.data.entries()).map(([k, v]) => `${k}=${v}`).join('\n')
                } else {
                    content = String(result.data)
                }
                filename = 'converted-data.txt'
                mimeType = 'text/plain'
                break
            case 'sql':
            case 'sql-insert':
            case 'sql-update':
            case 'sql-create-table':
                content = typeof result.data === 'string' ? result.data : String(result.data)
                content = formatSql(content)
                filename = 'converted-data.sql'
                mimeType = 'text/sql'
                break
            case 'xml':
                content = typeof result.data === 'string' ? result.data : String(result.data)
                filename = 'converted-data.xml'
                mimeType = 'application/xml'
                break
            case 'yaml':
                content = typeof result.data === 'string' ? result.data : String(result.data)
                filename = 'converted-data.yaml'
                mimeType = 'text/yaml'
                break
            case 'openapi':
            case 'json-schema':
                content = typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
                filename = 'converted-data.json'
                mimeType = 'application/json'
                break
            case 'db-migration':
                content = typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
                filename = 'migration.txt'
                mimeType = 'text/plain'
                break
            default:
                content = typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
                filename = 'converted-data.txt'
                mimeType = 'text/plain'
        }

        downloadFile(content, filename, mimeType)
    }, [config.outputFormat, result])

    return {
        // state
        isBuilding,
        result,
        sqlMode,
        setSqlMode,
        // actions
        convert,
        regenerateSql,
        copy,
        download
    }
}


