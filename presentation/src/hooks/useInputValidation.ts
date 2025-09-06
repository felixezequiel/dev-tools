import { useCallback, useMemo } from 'react'
import type { InputType } from '@/config/data-support'
import { useValidation, validationRules } from '@/hooks/useValidation'

export function useInputValidationByType(inputType: InputType) {
    const rules = useMemo(() => {
        switch (inputType) {
            case 'key-value':
                return [validationRules.keyValueFormat()]
            case 'json':
                return [validationRules.jsonFormat()]
            case 'csv':
                return [validationRules.required('Dados CSV')]
            case 'yaml':
                return [validationRules.yamlFormat()]
            case 'xml':
                return [validationRules.xmlFormat()]
            case 'openapi':
                return [validationRules.openApiFormat()]
            case 'json-schema':
                return [validationRules.jsonSchemaFormat()]
            case 'sql':
                return [validationRules.sqlFormat()]
            default:
                return [validationRules.keyValueFormat()]
        }
    }, [inputType])

    const validation = useValidation(rules)

    const validateInput = useCallback((value: string) => {
        return validation.validateField(value)
    }, [validation])

    return {
        validation,
        validateInput
    }
}


