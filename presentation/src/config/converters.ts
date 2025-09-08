import type { InputType } from '@/config/data-support'
import type { DataConverterConfig } from '@/types/converter'
import { FormDataResult } from '@/components/common/results/FormDataResult'
import { CsvResult } from '@/components/common/results/CsvResult'
import { DBMigrationResult } from '@/components/common/results/DBMigrationResult'
import { FileText, Table, Database, FileCode, FileJson, FileSpreadsheet } from 'lucide-react'
import { translations } from '@/lib/i18n'

// Helper function to get translated tool names at runtime
export const getTranslatedToolName = (key: string): string => {
    if (typeof window !== 'undefined') {
        const lang = localStorage.getItem('language') || 'pt_BR'
        return translations[lang as keyof typeof translations]?.[key as keyof typeof translations[keyof typeof translations]] as string || key
    }
    return translations.pt_BR?.[key as keyof typeof translations.pt_BR] as string || key
}

// For static config, use Portuguese as default
const getToolName = (key: string): string => {
    return translations.pt_BR?.[key as keyof typeof translations.pt_BR] as string || key
}

export const converterConfigs: Record<string, DataConverterConfig> = {
    json: {
        title: getToolName('convertToJson'),
        description: getToolName('convertToJson_desc'),
        inputTypes: ['formdata', 'curl', 'json', 'csv', 'yaml', 'xml', 'openapi', 'json-schema', 'sql'] as InputType[],
        defaultInputType: 'json' as InputType,
        outputFormat: 'json',
        outputDescription: 'JSON',
        acceptedFileTypes: ['.json', '.csv', '.yaml', '.yml', '.xml', '.sql', '.txt', '.tsv', '.ts'],
        placeholder: 'dropFileHere',
        icon: FileText,
        usage: {
            summary: 'json_usage_summary',
            useCases: [
                {
                    title: 'json_usecase_centralize_title',
                    description: 'json_usecase_centralize_desc',
                    exampleInput: 'user.name=John\nuser.age=30',
                    exampleOutput: '{\n  "user.name": "John",\n  "user.age": "30"\n}'
                }
            ]
        }
    },
    csv: {
        title: getToolName('convertToCsv'),
        description: getToolName('convertToCsv_desc'),
        inputTypes: ['formdata', 'curl', 'json', 'csv', 'yaml', 'xml', 'openapi', 'json-schema', 'sql'] as InputType[],
        defaultInputType: 'json' as InputType,
        outputFormat: 'csv',
        outputDescription: 'CSV',
        acceptedFileTypes: ['.json', '.csv', '.yaml', '.yml', '.xml', '.sql', '.txt', '.tsv', '.ts'],
        placeholder: 'dropFileHere',
        icon: Table,
        ResultComponent: CsvResult as any,
        usage: {
            summary: 'csv_usage_summary',
            useCases: [
                {
                    title: 'csv_usecase_export_title',
                    description: 'csv_usecase_export_desc',
                    exampleInput: '{"name":"John","age":30}',
                    exampleOutput: 'name,age\nJohn,30'
                }
            ]
        }
    },
    formdata: {
        title: getToolName('convertToFormData'),
        description: getToolName('convertToFormData_desc'),
        inputTypes: ['formdata', 'curl', 'json', 'csv', 'yaml', 'xml', 'openapi', 'json-schema', 'sql'] as InputType[],
        defaultInputType: 'json' as InputType,
        outputFormat: 'formdata',
        outputDescription: 'FormData',
        acceptedFileTypes: ['.json', '.csv', '.yaml', '.yml', '.xml', '.sql', '.txt', '.tsv', '.ts'],
        placeholder: 'dropFileHere',
        icon: Database,
        ResultComponent: FormDataResult,
        usage: {
            summary: 'formdata_usage_summary',
            useCases: [
                {
                    title: 'formdata_usecase_simulate_title',
                    description: 'formdata_usecase_simulate_desc',
                    exampleInput: '{"user.name":"John","user.age":30}',
                    exampleOutput: 'user.name=John\nuser.age=30'
                }
            ]
        }
    },
    xml: {
        title: getToolName('convertToXml'),
        description: getToolName('convertToXml_desc'),
        inputTypes: ['formdata', 'curl', 'json', 'csv', 'yaml', 'xml', 'openapi', 'json-schema', 'sql'] as InputType[],
        defaultInputType: 'json' as InputType,
        outputFormat: 'xml',
        outputDescription: 'XML',
        acceptedFileTypes: ['.json', '.csv', '.yaml', '.yml', '.xml', '.sql', '.txt', '.tsv', '.ts'],
        placeholder: 'dropFileHere',
        icon: FileCode,
        usage: {
            summary: 'xml_usage_summary',
            useCases: [
                {
                    title: 'xml_usecase_legacy_title',
                    description: 'xml_usecase_legacy_desc',
                    exampleInput: '{"user":{"name":"John","age":30}}',
                    exampleOutput: '<user>\n  <name>John</name>\n  <age>30</age>\n</user>'
                }
            ]
        }
    },
    yaml: {
        title: getToolName('convertToYaml'),
        description: getToolName('convertToYaml_desc'),
        inputTypes: ['formdata', 'curl', 'json', 'csv', 'yaml', 'xml', 'openapi', 'json-schema', 'sql'] as InputType[],
        defaultInputType: 'json' as InputType,
        outputFormat: 'yaml',
        outputDescription: 'YAML',
        acceptedFileTypes: ['.json', '.csv', '.yaml', '.yml', '.xml', '.sql', '.txt', '.tsv', '.ts'],
        placeholder: 'dropFileHere',
        icon: FileCode,
        usage: {
            summary: 'yaml_usage_summary',
            useCases: [
                {
                    title: 'yaml_usecase_configs_title',
                    description: 'yaml_usecase_configs_desc',
                    exampleInput: '{"service":{"replicas":2}}',
                    exampleOutput: 'service:\n  replicas: 2'
                }
            ]
        }
    },
    'json-schema': {
        title: getToolName('convertToJsonSchema'),
        description: getToolName('convertToJsonSchema_desc'),
        inputTypes: ['formdata', 'curl', 'json', 'csv', 'yaml', 'xml', 'openapi', 'json-schema', 'sql'] as InputType[],
        defaultInputType: 'json' as InputType,
        outputFormat: 'json-schema',
        outputDescription: 'JSON Schema',
        acceptedFileTypes: ['.json', '.csv', '.yaml', '.yml', '.xml', '.sql', '.txt', '.tsv', '.ts'],
        placeholder: 'dropFileHere',
        icon: FileJson,
        usage: {
            summary: 'jsonschema_usage_summary',
            useCases: [
                {
                    title: 'jsonschema_usecase_ci_title',
                    description: 'jsonschema_usecase_ci_desc',
                    exampleInput: '{"id": 1, "name": "John"}',
                    exampleOutput: '{\n  "$schema": "https://json-schema.org/draft/2020-12/schema",\n  "type": "object",\n  "properties": {"id": {"type": "number"}, "name": {"type": "string"}}\n}'
                }
            ]
        }
    },
    openapi: {
        title: getToolName('convertToOpenApi'),
        description: getToolName('convertToOpenApi_desc'),
        inputTypes: ['formdata', 'curl', 'json', 'csv', 'yaml', 'xml', 'openapi', 'json-schema', 'sql'] as InputType[],
        defaultInputType: 'json' as InputType,
        outputFormat: 'openapi',
        outputDescription: 'OpenAPI',
        acceptedFileTypes: ['.json', '.csv', '.yaml', '.yml', '.xml', '.sql', '.txt', '.tsv', '.ts'],
        placeholder: 'dropFileHere',
        icon: FileJson,
        usage: {
            summary: 'openapi_usage_summary',
            useCases: [
                {
                    title: 'openapi_usecase_docs_title',
                    description: 'openapi_usecase_docs_desc',
                    exampleInput: '{"GET /users": {"200": [{"id":1}]}}',
                    exampleOutput: '{"openapi":"3.0.0","paths":{"/users":{"get":{"responses":{"200":{"content":{"application/json":{"schema":{"type":"array"}}}}}}}}}'
                }
            ]
        }
    },
    sql: {
        title: getToolName('convertToSql'),
        description: getToolName('convertToSql_desc'),
        inputTypes: ['formdata', 'curl', 'json', 'csv', 'yaml', 'xml', 'openapi', 'json-schema', 'sql'] as InputType[],
        defaultInputType: 'json' as InputType,
        outputFormat: 'sql',
        outputDescription: 'SQL',
        acceptedFileTypes: ['.json', '.csv', '.yaml', '.yml', '.xml', '.sql', '.txt', '.tsv', '.ts'],
        placeholder: 'dropFileHere',
        icon: FileSpreadsheet,
        usage: {
            summary: 'sql_usage_summary',
            useCases: [
                {
                    title: 'sql_usecase_seed_title',
                    description: 'sql_usecase_seed_desc',
                    exampleInput: '{"users":[{"id":1,"name":"John"}]}',
                    exampleOutput: 'INSERT INTO users (id,name) VALUES (1,\'John\');'
                }
            ]
        }
    },
    'database-migration': {
        title: getToolName('convertToDatabaseMigration'),
        description: getToolName('convertToDatabaseMigration_desc'),
        inputTypes: ['formdata', 'curl', 'json', 'csv', 'yaml', 'xml', 'openapi', 'json-schema', 'sql'] as InputType[],
        defaultInputType: 'json' as InputType,
        outputFormat: 'db-migration',
        outputDescription: 'Database Migration',
        acceptedFileTypes: ['.json', '.csv', '.yaml', '.yml', '.xml', '.sql', '.txt', '.tsv', '.ts'],
        placeholder: 'dropFileHere',
        icon: Database,
        ResultComponent: DBMigrationResult,
        usage: {
            summary: 'dbmig_usage_summary',
            useCases: [
                {
                    title: 'dbmig_usecase_skeleton_title',
                    description: 'dbmig_usecase_skeleton_desc',
                    exampleInput: '{"users":[{"id":1,"name":"John"}]}',
                    exampleOutput: '-- up\nCREATE TABLE users (id INT, name TEXT);\n-- down\nDROP TABLE users;'
                }
            ]
        }
    }
}

export const getConverterConfig = (type: keyof typeof converterConfigs): DataConverterConfig => {
    return converterConfigs[type]
}
