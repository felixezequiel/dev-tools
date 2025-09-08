import { Sparkles } from 'lucide-react'

export interface DataComparatorConfig {
    title: string
    description: string
    icon: any
    usage?: {
        summary: string
        useCases: Array<{
            title: string
            description: string
            exampleInput?: string
            exampleOutput?: string
        }>
    }
}

export const comparatorConfigs: Record<string, DataComparatorConfig> = {
    comparator: {
        title: 'Comparador de Dados',
        description: 'Compare JSON e texto, detectando caracteres invisíveis',
        icon: Sparkles,
        usage: {
            summary: 'Use para comparar dados JSON, detectar diferenças sutis e identificar caracteres invisíveis.',
            useCases: [
                {
                    title: 'Comparar respostas de API',
                    description: 'Identifique diferenças entre payloads de API, incluindo caracteres especiais e formatação.',
                    exampleInput: '{"name": "João", "age": 25}',
                    exampleOutput: 'Diferenças encontradas: caracteres invisíveis no campo "name"'
                }
            ]
        }
    }
}

export const getComparatorConfig = (type: keyof typeof comparatorConfigs): DataComparatorConfig => {
    return comparatorConfigs[type]
}
