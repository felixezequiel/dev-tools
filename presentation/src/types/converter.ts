import type { InputType } from '@/config/data-support'

export interface ResultRendererProps {
    config: DataConverterConfig
    result: any
    onCopy: () => void
    onDownload: () => void
    input?: string
    inputType?: InputType
    version: number
    updatedAt?: number | null
    justUpdated: boolean
}

export interface ConverterUseCase {
    title: string
    description: string
    exampleInput?: string
    exampleOutput?: string
}

export interface ConverterUsage {
    summary: string
    useCases: ConverterUseCase[]
}

export interface DataConverterConfig {
    title: string
    description: string
    inputTypes: InputType[]
    defaultInputType: InputType
    outputFormat: 'json' | 'csv' | 'formdata' | 'xml' | 'yaml' | 'sql' | 'sql-insert' | 'sql-update' | 'sql-create-table' | 'openapi' | 'json-schema' | 'db-migration'
    outputDescription: string
    acceptedFileTypes: string[]
    placeholder: string
    icon: any
    ResultComponent?: (props: ResultRendererProps) => JSX.Element | null
    usage?: ConverterUsage
}


