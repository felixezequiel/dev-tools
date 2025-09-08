import type { ComponentType } from 'react'
import { converterConfigs } from '@/config/converters'
import { comparatorConfigs } from '@/config/comparators'
import { generatorConfigs } from '@/config/generators'

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

const comparatorTools: DevToolConfig[] = Object.entries(comparatorConfigs).map(([key, cfg]) => ({
    id: key,
    name: cfg.title,
    description: cfg.description,
    icon: cfg.icon,
    path: `/${key}`,
    category: 'comparator',
    getComponent: () => import('@/pages/ComparatorPage').then(m => ({ default: m.ComparatorPage }))
}))

const generatorTools: DevToolConfig[] = Object.entries(generatorConfigs).map(([key, cfg]) => ({
    id: key,
    name: cfg.title,
    description: cfg.description,
    icon: cfg.icon,
    path: `/${key}`,
    category: 'generator',
    getComponent: () => key === 'types-zod'
        ? import('@/pages/TypesZodPage').then(m => ({ default: m.TypesZodPage }))
        : import('@pages/MockDataPage').then(m => ({ default: m.MockDataPage }))
}))

export const devTools: DevToolConfig[] = [
    ...converterTools,
    ...comparatorTools,
    ...generatorTools
]


