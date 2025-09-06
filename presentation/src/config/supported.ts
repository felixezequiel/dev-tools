import { INPUT_TYPES, OUTPUT_TYPES } from '@/config/data-support'
export const acceptedInputTypes = INPUT_TYPES.map(i => ({ key: i.key, label: i.label }))

export const supportedOutputs = OUTPUT_TYPES.map(o => ({ key: o.key, label: o.label }))


