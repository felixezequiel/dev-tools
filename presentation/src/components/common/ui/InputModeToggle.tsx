import { Button } from '@/components/ui/Button'
import { FileText, Upload } from 'lucide-react'

interface InputModeToggleProps {
    mode: 'manual' | 'file'
    onChange: (mode: 'manual' | 'file') => void
}

export function InputModeToggle({ mode, onChange }: InputModeToggleProps) {
    return (
        <div className="flex space-x-2">
            <Button
                variant={mode === 'manual' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange('manual')}
                className="flex items-center space-x-1"
            >
                <FileText className="h-3 w-3" />
                <span>Digitar</span>
            </Button>
            <Button
                variant={mode === 'file' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange('file')}
                className="flex items-center space-x-1"
            >
                <Upload className="h-3 w-3" />
                <span>Arquivo</span>
            </Button>
        </div>
    )
}


