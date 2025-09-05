// Implementações de EntrySource para diferentes tipos de entrada
import type { EntrySource } from '@builder/data'

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
export function createEntrySource(input: string, type: 'key-value' | 'json' | 'csv' = 'key-value'): EntrySource<any, any> {
    switch (type) {
        case 'key-value':
            return createKeyValueEntrySource(input)
        case 'json':
            return createJsonEntrySource(input)
        case 'csv':
            return createCsvEntrySource(input)
        default:
            return createKeyValueEntrySource(input)
    }
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
    'key-value': {
        name: 'Chave=Valor',
        description: 'Formato chave=valor, uma por linha',
        example: 'user.name=John\nuser.age=30\nuser.email=john@example.com',
        placeholder: 'user.name=John\nuser.age=30\nuser.email=john@example.com'
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
    }
}
