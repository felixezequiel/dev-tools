import { Sparkles } from 'lucide-react'
import { translations } from '@/lib/i18n'

// Helper function to get translated tool names
const getToolName = (key: string): string => {
    return translations.pt_BR?.[key as keyof typeof translations.pt_BR] as string || key
}

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
        title: getToolName('dataComparator'),
        description: getToolName('dataComparator_desc'),
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
