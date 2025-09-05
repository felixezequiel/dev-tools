import { useState, useCallback } from 'react'

export interface ValidationRule {
    test: (value: string) => boolean
    message: string
}

export interface ValidationResult {
    isValid: boolean
    errors: string[]
}

export function useValidation(rules: ValidationRule[] = []) {
    const [errors, setErrors] = useState<string[]>([])
    const [touched, setTouched] = useState(false)

    const validate = useCallback((value: string): ValidationResult => {
        const validationErrors: string[] = []

        rules.forEach(rule => {
            if (!rule.test(value)) {
                validationErrors.push(rule.message)
            }
        })

        setErrors(validationErrors)
        return {
            isValid: validationErrors.length === 0,
            errors: validationErrors
        }
    }, [rules])

    const validateField = useCallback((value: string) => {
        const result = validate(value)
        setTouched(true)
        return result
    }, [validate])

    const clearErrors = useCallback(() => {
        setErrors([])
        setTouched(false)
    }, [])

    const hasErrors = errors.length > 0
    const showErrors = touched && hasErrors

    return {
        errors,
        touched,
        hasErrors,
        showErrors,
        validate,
        validateField,
        clearErrors,
        setTouched
    }
}

// Regras de validação comuns
export const validationRules = {
    required: (fieldName: string): ValidationRule => ({
        test: (value: string) => value.trim().length > 0,
        message: `${fieldName} é obrigatório`
    }),

    minLength: (minLength: number, fieldName: string): ValidationRule => ({
        test: (value: string) => value.length >= minLength,
        message: `${fieldName} deve ter pelo menos ${minLength} caracteres`
    }),

    maxLength: (maxLength: number, fieldName: string): ValidationRule => ({
        test: (value: string) => value.length <= maxLength,
        message: `${fieldName} deve ter no máximo ${maxLength} caracteres`
    }),

    pattern: (pattern: RegExp, message: string): ValidationRule => ({
        test: (value: string) => pattern.test(value),
        message
    }),

    jsonFormat: (): ValidationRule => ({
        test: (value: string) => {
            if (!value.trim()) return true // Allow empty values
            try {
                JSON.parse(value)
                return true
            } catch {
                return false
            }
        },
        message: 'Formato JSON inválido'
    }),

    keyValueFormat: (): ValidationRule => ({
        test: (value: string) => {
            if (!value.trim()) return true
            const lines = value.split('\n').filter(line => line.trim())
            return lines.every(line => {
                const parts = line.split('=')
                return parts.length === 2 && parts[0].trim() && parts[1].trim()
            })
        },
        message: 'Formato inválido. Use: chave=valor (uma por linha)'
    })
}
