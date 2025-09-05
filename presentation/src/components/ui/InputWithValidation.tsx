import * as React from 'react'
import { Input } from './Input'
import { cn } from '@/lib/utils'
import { AlertCircle, Check } from 'lucide-react'
import type { ValidationResult } from '@/hooks/useValidation'

export interface InputWithValidationProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    validation?: ValidationResult
    onChange?: (value: string, validation: ValidationResult) => void
    onValidate?: (value: string) => ValidationResult
    showValidation?: boolean
    successMessage?: string
}

const InputWithValidation = React.forwardRef<HTMLInputElement, InputWithValidationProps>(
    ({
        className,
        validation,
        onChange,
        onValidate,
        showValidation = true,
        successMessage,
        ...props
    }, ref) => {
        const [internalValidation, setInternalValidation] = React.useState<ValidationResult>({
            isValid: true,
            errors: []
        })

        const currentValidation = validation || internalValidation

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value

            let newValidation = currentValidation
            if (onValidate) {
                newValidation = onValidate(value)
                setInternalValidation(newValidation)
            }

            if (onChange) {
                onChange(value, newValidation)
            }
        }

        const getValidationClassName = () => {
            if (!showValidation || !currentValidation) return ''

            if (currentValidation.errors.length > 0) {
                return 'border-destructive focus-visible:ring-destructive'
            }

            if (successMessage && currentValidation.isValid) {
                return 'border-green-500 focus-visible:ring-green-500'
            }

            return ''
        }

        const getValidationIcon = () => {
            if (!showValidation || !currentValidation) return null

            if (currentValidation.errors.length > 0) {
                return <AlertCircle className="h-4 w-4 text-destructive" />
            }

            if (successMessage && currentValidation.isValid) {
                return <Check className="h-4 w-4 text-green-500" />
            }

            return null
        }

        return (
            <div className="space-y-2">
                <div className="relative">
                    <Input
                        className={cn(getValidationClassName(), className)}
                        onChange={handleChange}
                        ref={ref}
                        {...props}
                    />
                    {getValidationIcon() && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {getValidationIcon()}
                        </div>
                    )}
                </div>

                {showValidation && currentValidation && currentValidation.errors.length > 0 && (
                    <div className="space-y-1">
                        {currentValidation.errors.map((error, index) => (
                            <p key={index} className="text-sm text-destructive flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                                {error}
                            </p>
                        ))}
                    </div>
                )}

                {showValidation && successMessage && currentValidation && currentValidation.isValid && (
                    <p className="text-sm text-green-600 flex items-center">
                        <Check className="h-3 w-3 mr-1 flex-shrink-0" />
                        {successMessage}
                    </p>
                )}
            </div>
        )
    }
)

InputWithValidation.displayName = 'InputWithValidation'

export { InputWithValidation }
