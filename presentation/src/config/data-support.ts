// Tipos centrais para entradas e saídas suportadas

export type InputType = 'formdata' | 'json' | 'csv' | 'yaml' | 'xml' | 'openapi' | 'json-schema' | 'sql'

export const INPUT_TYPES: Array<{ key: InputType; label: string; extensions: string[] }> = [
    { key: 'json', label: 'JSON', extensions: ['.json'] },
    { key: 'yaml', label: 'YAML', extensions: ['.yaml', '.yml'] },
    { key: 'xml', label: 'XML', extensions: ['.xml'] },
    { key: 'csv', label: 'CSV', extensions: ['.csv', '.tsv'] },
    { key: 'formdata', label: 'FormData (chave=valor)', extensions: ['.txt'] },
    { key: 'openapi', label: 'OpenAPI', extensions: ['.json', '.yaml', '.yml'] },
    { key: 'json-schema', label: 'JSON Schema', extensions: ['.json', '.yaml', '.yml'] },
    { key: 'sql', label: 'SQL', extensions: ['.sql'] }
]

export type OutputType = 'json' | 'csv' | 'formdata' | 'xml' | 'yaml' | 'sql-insert' | 'sql-update' | 'sql-create-table' | 'openapi' | 'json-schema' | 'db-migration'

export const OUTPUT_TYPES: Array<{ key: OutputType; label: string }> = [
    { key: 'json', label: 'JSON' },
    { key: 'csv', label: 'CSV' },
    { key: 'formdata', label: 'FormData' },
    { key: 'sql-insert', label: 'SQL INSERT' },
    { key: 'sql-update', label: 'SQL UPDATE' },
    { key: 'sql-create-table', label: 'SQL CREATE TABLE' },
    { key: 'xml', label: 'XML' },
    { key: 'yaml', label: 'YAML' },
    { key: 'json-schema', label: 'JSON Schema' },
    { key: 'openapi', label: 'OpenAPI' },
    { key: 'db-migration', label: 'Database Migration' }
]

export const allAcceptedExtensions = Array.from(new Set(INPUT_TYPES.flatMap(i => i.extensions)))


