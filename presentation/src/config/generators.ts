import { FileText, Sparkles } from 'lucide-react'

export interface DataGeneratorConfig {
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

export const generatorConfigs: Record<string, DataGeneratorConfig> = {
    'types-zod': {
        title: 'Types/Zod',
        description: 'Gere tipos TS e schemas Zod a partir de JSON',
        icon: FileText,
        usage: {
            summary: 'Gere automaticamente tipos TypeScript e schemas Zod para validação a partir de dados JSON.',
            useCases: [
                {
                    title: 'Criar tipos para APIs',
                    description: 'Transformar respostas JSON em interfaces TypeScript e schemas Zod.',
                    exampleInput: '{"id": 1, "name": "John", "email": "john@example.com"}',
                    exampleOutput: 'interface User { id: number; name: string; email: string; }\n\nconst userSchema = z.object({ id: z.number(), name: z.string(), email: z.string() });'
                }
            ]
        }
    },
    'mock-data': {
        title: 'Mock/Data',
        description: 'Gere mocks a partir de JSON Schema ou OpenAPI em JSON/CSV/SQL',
        icon: Sparkles,
        usage: {
            summary: 'Gere dados de teste rapidamente a partir de schemas JSON ou especificações OpenAPI.',
            useCases: [
                {
                    title: 'Popular ambiente de desenvolvimento',
                    description: 'Criar dados fictícios para testes e desenvolvimento baseado em schemas.',
                    exampleInput: '{"type": "object", "properties": {"id": {"type": "number"}, "name": {"type": "string"}}}',
                    exampleOutput: '[{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}, {"id": 3, "name": "Charlie"}]'
                }
            ]
        }
    }
}

export const getGeneratorConfig = (type: keyof typeof generatorConfigs): DataGeneratorConfig => {
    return generatorConfigs[type]
}
