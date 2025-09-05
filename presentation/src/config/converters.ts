import { DataConverterConfig } from '@/components/common/DataConverterLayout'
import { FileText, Table, Database } from 'lucide-react'

export const converterConfigs: Record<string, DataConverterConfig> = {
    json: {
        title: 'Conversor JSON',
        description: 'Converte dados estruturados (chave-valor, JSON, CSV) em objetos JSON organizados com validação em tempo real',
        inputTypes: ['key-value', 'json', 'csv'],
        defaultInputType: 'key-value',
        outputFormat: 'json',
        outputDescription: 'JSON estruturado gerado a partir dos dados de entrada',
        acceptedFileTypes: ['.json', '.csv', '.txt', '.tsv', '.ts'],
        placeholder: 'Arraste um arquivo JSON, CSV ou TXT aqui',
        icon: FileText
    },
    csv: {
        title: 'Conversor CSV',
        description: 'Transforma dados estruturados em arquivos CSV com formatação adequada e escape de caracteres especiais',
        inputTypes: ['key-value', 'json', 'csv'],
        defaultInputType: 'json',
        outputFormat: 'csv',
        outputDescription: 'CSV estruturado gerado a partir dos dados de entrada',
        acceptedFileTypes: ['.json', '.csv', '.txt', '.tsv', '.ts'],
        placeholder: 'Arraste um arquivo JSON, CSV ou TXT aqui',
        icon: Table
    },
    formdata: {
        title: 'Conversor FormData',
        description: 'Converte dados estruturados em FormData para envio de formulários web com preview interativo',
        inputTypes: ['key-value', 'json', 'csv'],
        defaultInputType: 'json',
        outputFormat: 'formdata',
        outputDescription: 'FormData estruturado gerado a partir dos dados de entrada',
        acceptedFileTypes: ['.json', '.csv', '.txt', '.tsv', '.ts'],
        placeholder: 'Arraste um arquivo JSON, CSV ou TXT aqui',
        icon: Database
    }
}

export const getConverterConfig = (type: keyof typeof converterConfigs): DataConverterConfig => {
    return converterConfigs[type]
}
