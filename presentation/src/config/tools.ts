import type { ComponentType, LazyExoticComponent } from 'react'
import { converterConfigs } from '@/config/converters'
import { Sparkles, FileText } from 'lucide-react'

export type ToolCategory = 'converter' | 'comparator' | 'generator'

export interface DevToolConfig {
    id: string
    name: string
    description: string
    icon: any
    path: string // absolute path starting with '/'
    category: ToolCategory
    getComponent?: () => Promise<{ default: ComponentType<any> }>
}

const converterTools: DevToolConfig[] = Object.entries(converterConfigs).map(([key, cfg]) => ({
    id: `${key}-converter`,
    name: cfg.title,
    description: cfg.description,
    icon: cfg.icon,
    path: `/${key}-converter`,
    category: 'converter'
}))

const comparatorTool: DevToolConfig = {
    id: 'comparator',
    name: 'Comparador de Dados',
    description: 'Compare JSON e texto, detectando caracteres invisíveis',
    icon: Sparkles,
    path: '/comparator',
    category: 'comparator',
    getComponent: () => import('@/pages/ComparatorPage').then(m => ({ default: m.ComparatorPage }))
}

const typesZodTool: DevToolConfig = {
    id: 'types-zod',
    name: 'Types/Zod',
    description: 'Gere tipos TS e schemas Zod a partir de JSON',
    icon: FileText,
    path: '/types-zod',
    category: 'generator',
    getComponent: () => import('@/pages/TypesZodPage').then(m => ({ default: m.TypesZodPage }))
}

export const devTools: DevToolConfig[] = [
    ...converterTools,
    comparatorTool,
    typesZodTool
]


