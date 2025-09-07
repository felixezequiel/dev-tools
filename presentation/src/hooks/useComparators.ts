import { useMemo } from 'react'
import { DefaultJsonComparator, DefaultTextComparator, type JsonComparatorOptions, type TextComparatorOptions, type TextComparatorResult, type DiffEntry } from '@builder/data'

export interface UseComparatorsApi {
    jsonDiff: (left: unknown, right: unknown, options?: JsonComparatorOptions) => DiffEntry[]
    textDiff: (left: string, right: string, options?: TextComparatorOptions) => TextComparatorResult
}

export function useComparators(): UseComparatorsApi {
    const json = useMemo(() => new DefaultJsonComparator(), [])
    const text = useMemo(() => new DefaultTextComparator(), [])

    return {
        jsonDiff: (l, r, opts) => json.compare(l, r, opts),
        textDiff: (l, r, opts) => text.compare(l, r, opts)
    }
}
