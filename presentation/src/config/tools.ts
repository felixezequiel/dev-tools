import type { ComponentType } from 'react'
import { converterConfigs } from '@/config/converters'
import { comparatorConfigs } from '@/config/comparators'
import { generatorConfigs } from '@/config/generators'
import { translations } from '@/lib/i18n'

// Helper function to get translated via provided t()
const translateWith = (t: (key: string) => string, key: string, fallback: string): string => {
    try {
        const v = t(key)
        return v || fallback
    } catch {
        return fallback
    }
}

// Fallback translation using current storage (legacy)
const getTranslated = (key: string): string => {
    if (typeof window !== 'undefined') {
        const lang = localStorage.getItem('language') || 'pt_BR'
        return translations[lang as keyof typeof translations]?.[key as keyof typeof translations[keyof typeof translations]] as string || key
    }
    return translations.pt_BR?.[key as keyof typeof translations.pt_BR] as string || key
}

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

// Static list (defaults)
const converterTools: DevToolConfig[] = Object.entries(converterConfigs).map(([key, cfg]) => ({
    id: `${key}-converter`,
    name: cfg.title, // Default fallback (Portuguese)
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

// Explicit mapping from converter IDs to i18n keys
const converterIdToI18nKey: Record<string, { name: string; desc: string }> = {
    json: { name: 'convertToJson', desc: 'convertToJson_desc' },
    csv: { name: 'convertToCsv', desc: 'convertToCsv_desc' },
    formdata: { name: 'convertToFormData', desc: 'convertToFormData_desc' },
    xml: { name: 'convertToXml', desc: 'convertToXml_desc' },
    yaml: { name: 'convertToYaml', desc: 'convertToYaml_desc' },
    'json-schema': { name: 'convertToJsonSchema', desc: 'convertToJsonSchema_desc' },
    openapi: { name: 'convertToOpenApi', desc: 'convertToOpenApi_desc' },
    sql: { name: 'convertToSql', desc: 'convertToSql_desc' },
    'database-migration': { name: 'convertToDatabaseMigration', desc: 'convertToDatabaseMigration_desc' },
}

// Generator and comparator description keys
const generatorIdToI18nKey: Record<string, { name: string; desc: string }> = {
    'types-zod': { name: 'typesZodGenerator', desc: 'typesZodGenerator_desc' },
    'mock-data': { name: 'mockDataGenerator', desc: 'mockDataGenerator_desc' },
}

const comparatorIdToI18nKey: Record<string, { name: string; desc: string }> = {
    comparator: { name: 'dataComparator', desc: 'dataComparator_desc' },
}

// Function to get translated tools using provided t()
export const getTranslatedToolsFor = (t: (key: string) => string): DevToolConfig[] => {
    const translatedConverters = Object.entries(converterConfigs).map(([key, cfg]) => {
        const map = converterIdToI18nKey[key]
        const name = map ? translateWith(t, map.name, cfg.title) : cfg.title
        const description = map ? translateWith(t, map.desc, cfg.description) : cfg.description
        return {
            id: `${key}-converter`,
            name,
            description,
            icon: cfg.icon,
            path: `/${key}-converter`,
            category: 'converter' as const,
        }
    })

    const translatedComparators = Object.entries(comparatorConfigs).map(([key, cfg]) => {
        const map = comparatorIdToI18nKey[key]
        const name = map ? translateWith(t, map.name, cfg.title) : cfg.title
        const description = map ? translateWith(t, map.desc, cfg.description) : cfg.description
        return {
            id: key,
            name,
            description,
            icon: cfg.icon,
            path: `/${key}`,
            category: 'comparator' as const,
            getComponent: () => import('@/pages/ComparatorPage').then(m => ({ default: m.ComparatorPage })),
        }
    })

    const translatedGenerators = Object.entries(generatorConfigs).map(([key, cfg]) => {
        const map = generatorIdToI18nKey[key]
        const name = map ? translateWith(t, map.name, cfg.title) : cfg.title
        const description = map ? translateWith(t, map.desc, cfg.description) : cfg.description
        return {
            id: key,
            name,
            description,
            icon: cfg.icon,
            path: `/${key}`,
            category: 'generator' as const,
            getComponent: () => key === 'types-zod'
                ? import('@/pages/TypesZodPage').then(m => ({ default: m.TypesZodPage }))
                : import('@pages/MockDataPage').then(m => ({ default: m.MockDataPage })),
        }
    })

    return [
        ...translatedConverters,
        ...translatedComparators,
        ...translatedGenerators,
    ]
}

// Legacy: translate using localStorage language (kept for backward compatibility)
export const getTranslatedTools = (): DevToolConfig[] => {
    const t = (key: string) => getTranslated(key)
    return getTranslatedToolsFor(t)
}

// Static tools for backward compatibility (will be Portuguese by default)
export const devTools: DevToolConfig[] = [
    ...converterTools,
    ...comparatorTools,
    ...generatorTools,
]


