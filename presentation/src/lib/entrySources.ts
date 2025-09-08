// Implementações de EntrySource para diferentes tipos de entrada
import type { EntrySource } from '@builder/data'
import { parseCurlToJson } from '@builder/data'
import yaml from 'js-yaml'
import { XMLParser } from 'fast-xml-parser'

export class KeyValuePairsEntrySource implements EntrySource<string, string> {
    constructor(private pairs: Array<[string, string]>) { }

    *entries(): Iterable<[string, string]> {
        yield* this.pairs
    }
}

export class ObjectEntrySource implements EntrySource<string, any> {
    constructor(private obj: Record<string, any>) {
        this.obj = obj
    }

    *entries(): Iterable<[string, any]> {
        for (const [key, value] of Object.entries(this.obj)) {
            yield [key, value]
        }
    }
}

export class MapEntrySource<TKey, TValue> implements EntrySource<TKey, TValue> {
    constructor(private map: Map<TKey, TValue>) {
        this.map = map
    }

    *entries(): Iterable<[TKey, TValue]> {
        yield* this.map.entries()
    }
}

export class ArrayEntrySource<TValue> implements EntrySource<number, TValue> {
    constructor(private array: TValue[]) {
        this.array = array
    }

    *entries(): Iterable<[number, TValue]> {
        for (let i = 0; i < this.array.length; i++) {
            yield [i, this.array[i]]
        }
    }
}

// Factory function para criar EntrySource baseada na entrada
export function createEntrySource(input: string, type: 'formdata' | 'curl' | 'json' | 'csv' | 'yaml' | 'xml' | 'openapi' | 'json-schema' | 'sql' = 'formdata'): EntrySource<any, any> {
    switch (type) {
        case 'formdata':
            // Check if input is multipart FormData
            if (isMultipartFormData(input)) {
                return createMultipartFormDataEntrySource(input)
            }
            // FormData textual input is treated as chave=valor lines
            return createKeyValueEntrySource(input)
        case 'curl': {
            const parsed = parseCurlToJson(input)
            return new ObjectEntrySource(parsed as any)
        }
        case 'json':
            return createJsonEntrySource(input)
        case 'csv':
            return createCsvEntrySource(input)
        case 'yaml':
            return createYamlEntrySource(input)
        case 'xml':
            return createXmlEntrySource(input)
        case 'openapi':
            return createJsonEntrySource(parseOpenApiToJson(input))
        case 'json-schema':
            return createJsonEntrySource(parseJsonSchemaToJson(input))
        case 'sql':
            return createJsonEntrySource(parseSqlToJson(input))
        default:
            return createKeyValueEntrySource(input)
    }
}

function isMultipartFormData(input: string): boolean {
    // Check if input contains multipart boundary markers
    return input.includes('Content-Disposition: form-data') &&
        input.includes('------') &&
        input.includes('name="')
}

function createMultipartFormDataEntrySource(input: string): KeyValuePairsEntrySource {
    const pairs: Array<[string, string]> = []

    // Split by boundary lines
    const lines = input.split('\n')
    let currentField = ''
    let currentValue = ''


    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()

        // Check for Content-Disposition header
        if (line.startsWith('Content-Disposition: form-data; name=')) {
            // If we were collecting a previous field, save it
            if (currentField && currentValue.trim()) {
                pairs.push([currentField, currentValue.trim()])
            }

            // Extract field name
            const nameMatch = line.match(/name="([^"]+)"/)
            if (nameMatch) {
                currentField = nameMatch[1]
                currentValue = ''
            }
        }
        // Skip other headers and empty lines
        else if (line.startsWith('Content-') || line === '' || line.startsWith('------')) {
            continue
        }
        // This is the value content
        else if (currentField) {

            if (currentValue) {
                currentValue += '\n' + line
            } else {
                currentValue = line
            }
        }
    }

    // Don't forget the last field
    if (currentField && currentValue.trim()) {
        pairs.push([currentField, currentValue.trim()])
    }

    return new KeyValuePairsEntrySource(pairs)
}

function createKeyValueEntrySource(input: string): KeyValuePairsEntrySource {
    const pairs: Array<[string, string]> = []
    const lines = input.split('\n').filter(line => line.trim())

    lines.forEach(line => {
        const [key, ...valueParts] = line.split('=')
        if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim()
            pairs.push([key.trim(), value])
        }
    })

    return new KeyValuePairsEntrySource(pairs)
}

function createJsonEntrySource(input: string): ObjectEntrySource {
    try {
        const obj = JSON.parse(input)
        return new ObjectEntrySource(obj)
    } catch (error) {
        throw new Error('JSON inválido')
    }
}

function createYamlEntrySource(input: string): ObjectEntrySource {
    try {
        const obj = yaml.load(input)
        return new ObjectEntrySource(obj as Record<string, any>)
    } catch (error) {
        throw new Error('YAML inválido')
    }
}

function createXmlEntrySource(input: string): ObjectEntrySource {
    try {
        const parser = new XMLParser({ ignoreAttributes: false, parseAttributeValue: true })
        const obj = parser.parse(input)
        return new ObjectEntrySource(obj)
    } catch (error) {
        throw new Error('XML inválido')
    }
}

function parseOpenApiToJson(input: string): string {
    try {
        // OpenAPI pode ser JSON ou YAML; tentamos ambos
        let obj: any
        try {
            obj = JSON.parse(input)
        } catch {
            obj = yaml.load(input)
        }
        return JSON.stringify(obj)
    } catch {
        throw new Error('OpenAPI inválido (JSON/YAML)')
    }
}

function parseJsonSchemaToJson(input: string): string {
    try {
        // JSON Schema é JSON válido; aceitamos também YAML por conveniência
        let obj: any
        try {
            obj = JSON.parse(input)
        } catch {
            obj = yaml.load(input)
        }
        return JSON.stringify(obj)
    } catch {
        throw new Error('JSON Schema inválido (JSON/YAML)')
    }
}

function parseSqlToJson(input: string): string {
    try {
        const text = input.trim()
        // Very basic detection and parsing
        if (/^insert\s+into\s+/i.test(text)) {
            // INSERT INTO table (a,b) VALUES (1,'x'),(2,'y');
            const m = text.match(/insert\s+into\s+([\w"`\[\].]+)\s*\(([^)]+)\)\s*values\s*(.+);?/i)
            if (!m) throw new Error('INSERT inválido')
            const table = m[1]
            const columns = m[2].split(',').map(s => s.trim().replace(/["`\[\]]/g, ''))
            const valuesPart = m[3].trim()
            const rowStrings = splitSqlValues(valuesPart)
            const rows = rowStrings.map(rs => parseSqlRow(rs, columns))
            return JSON.stringify({ type: 'insert', table, rows })
        }
        if (/^create\s+table\s+/i.test(text)) {
            const m = text.match(/create\s+table\s+([\w"`\[\].]+)\s*\(([\s\S]+)\)\s*;?/i)
            if (!m) throw new Error('CREATE TABLE inválido')
            const table = m[1]
            const body = m[2]
            const columns: any[] = []
            body.split(/,\s*\n|,\s*(?![^()]*\))/).forEach(line => {
                const trimmed = line.trim()
                const col = trimmed.match(/^["`\[]?([\w.]+)["`\]]?\s+([\w()]+)?/)
                if (col) {
                    columns.push({ name: col[1], type: col[2] || 'unknown', raw: trimmed })
                }
            })
            return JSON.stringify({ type: 'create-table', table, columns })
        }
        // Fallback: return as plain text
        return JSON.stringify({ type: 'sql', content: text })
    } catch {
        throw new Error('SQL inválido')
    }
}

function splitSqlValues(valuesPart: string): string[] {
    // Splits (....), (....) even with commas inside quotes
    const rows: string[] = []
    let depth = 0
    let current = ''
    for (let i = 0; i < valuesPart.length; i++) {
        const ch = valuesPart[i]
        current += ch
        if (ch === '(') depth++
        else if (ch === ')') depth--
        else if (ch === ',' && depth === 0) {
            rows.push(current.trim().replace(/^,/, ''))
            current = ''
        }
    }
    if (current.trim()) rows.push(current.trim())
    return rows
}

function parseSqlRow(rowText: string, columns: string[]): any {
    const inside = rowText.trim().replace(/^\(/, '').replace(/\)$/, '')
    const values = splitCsvRespectingQuotes(inside)
    const obj: any = {}
    columns.forEach((c, i) => {
        obj[c] = parseSqlValue(values[i])
    })
    return obj
}

function splitCsvRespectingQuotes(text: string): string[] {
    const out: string[] = []
    let current = ''
    let inQuote = false
    let quoteChar = ''
    for (let i = 0; i < text.length; i++) {
        const ch = text[i]
        if ((ch === '"' || ch === "'") && (!inQuote || quoteChar === ch)) {
            if (inQuote && text[i + 1] === ch) { // escaped quote
                current += ch
                i++
                continue
            }
            inQuote = !inQuote
            quoteChar = ch
            continue
        }
        if (ch === ',' && !inQuote) {
            out.push(current.trim())
            current = ''
            continue
        }
        current += ch
    }
    if (current.length) out.push(current.trim())
    return out
}

function parseSqlValue(v?: string): any {
    if (v === undefined) return null
    const trimmed = v.trim()
    if (trimmed === 'NULL' || trimmed.toLowerCase() === 'null') return null
    if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || (trimmed.startsWith('"') && trimmed.endsWith('"')))
        return trimmed.slice(1, -1)
    const num = Number(trimmed)
    if (!Number.isNaN(num)) return num
    return trimmed
}

function createCsvEntrySource(input: string): KeyValuePairsEntrySource {
    // Implementação básica para CSV simples
    const lines = input.split('\n').filter(line => line.trim())
    const pairs: Array<[string, string]> = []

    if (lines.length < 2) {
        throw new Error('CSV deve ter pelo menos cabeçalho e uma linha de dados')
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
        headers.forEach((header, index) => {
            if (values[index]) {
                pairs.push([`${header}[${i - 1}]`, values[index]])
            }
        })
    }

    return new KeyValuePairsEntrySource(pairs)
}

// Utility functions para diferentes formatos de entrada
export const inputFormats = {
    'formdata': {
        name: 'FormData',
        description: 'Texto no formato chave=valor (uma por linha), como campos de FormData',
        example: 'name=John\nage=30\nemail=john@example.com',
        placeholder: 'name=John\nage=30\nemail=john@example.com'
    },
    'curl': {
        name: 'cURL',
        description: 'Comando cURL completo (ex.: curl -X POST ...)',
        example: "curl -X POST 'https://api.example.com/users?active=true' -H 'Authorization: Bearer TOKEN' -H 'Content-Type: application/json' -d '{\"name\":\"John\",\"age\":30}'",
        placeholder: "curl 'https://api.example.com/endpoint' -H 'Accept: application/json'"
    },
    'json': {
        name: 'JSON',
        description: 'Objeto JSON válido',
        example: '{\n  "user": {\n    "name": "John",\n    "age": 30,\n    "email": "john@example.com"\n  }\n}',
        placeholder: '{\n  "user": {\n    "name": "John",\n    "age": 30\n  }\n}'
    },
    'csv': {
        name: 'CSV',
        description: 'Arquivo CSV com cabeçalhos',
        example: 'name,age,email\nJohn,30,john@example.com\nJane,25,jane@example.com',
        placeholder: 'name,age,email\nJohn,30,john@example.com\nJane,25,jane@example.com'
    },
    'yaml': {
        name: 'YAML',
        description: 'Documento YAML (será normalizado para JSON)',
        example: 'user:\n  name: John\n  age: 30\n  email: john@example.com',
        placeholder: 'user:\n  name: John\n  age: 30'
    },
    'xml': {
        name: 'XML',
        description: 'Documento XML (será convertido para objeto)',
        example: '<user><name>John</name><age>30</age></user>',
        placeholder: '<root>...</root>'
    },
    'openapi': {
        name: 'OpenAPI',
        description: 'Especificação OpenAPI em JSON ou YAML',
        example: 'openapi: 3.0.0\ninfo:\n  title: API\n  version: 1.0.0',
        placeholder: '{ "openapi": "3.0.0", "info": { "title": "API" } }'
    },
    'json-schema': {
        name: 'JSON Schema',
        description: 'Schema JSON (aceita JSON ou YAML)',
        example: '{\n  "$schema": "https://json-schema.org/draft/2020-12/schema",\n  "type": "object"\n}',
        placeholder: '{ "$schema": "https://json-schema.org/draft/2020-12/schema" }'
    },
    'sql': {
        name: 'SQL',
        description: 'SQL (INSERT/CREATE TABLE simples serão normalizados)',
        example: 'INSERT INTO users (id,name) VALUES (1,\'John\');',
        placeholder: 'INSERT INTO ...'
    }
}
