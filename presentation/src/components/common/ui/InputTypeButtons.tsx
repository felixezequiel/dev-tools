import { Button } from '@/components/ui/Button'
import type { InputType } from '@/config/data-support'
import { inputFormats } from '@/lib/entrySources'
import { Code, Database, Table, FileCode } from 'lucide-react'

interface InputTypeButtonsProps {
    allowedTypes: InputType[]
    current: InputType
    onChange: (type: InputType) => void
}

export function InputTypeButtons({ allowedTypes, current, onChange }: InputTypeButtonsProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {allowedTypes.map((type) => {
                const format = inputFormats[type]
                return (
                    <Button
                        key={type}
                        variant={current === type ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onChange(type)}
                        className="flex items-center space-x-1"
                    >
                        {type === 'key-value' && <Code className="h-3 w-3" />}
                        {type === 'json' && <Database className="h-3 w-3" />}
                        {type === 'csv' && <Table className="h-3 w-3" />}
                        {(type === 'yaml' || type === 'xml' || type === 'openapi' || type === 'json-schema' || type === 'sql') && (
                            <FileCode className="h-3 w-3" />
                        )}
                        <span>{format.name}</span>
                    </Button>
                )
            })}
        </div>
    )
}


