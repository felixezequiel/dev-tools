import { Button } from '@/components/ui/Button'
import { FileText, Upload } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

interface InputModeToggleProps {
    mode: 'manual' | 'file'
    onChange: (mode: 'manual' | 'file') => void
}

export function InputModeToggle({ mode, onChange }: InputModeToggleProps) {
    const { t } = useTranslation()
    return (
        <div className="flex space-x-2">
            <Button
                variant={mode === 'manual' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange('manual')}
                className="flex items-center space-x-1"
            >
                <FileText className="h-3 w-3" />
                <span>{t('manual')}</span>
            </Button>
            <Button
                variant={mode === 'file' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onChange('file')}
                className="flex items-center space-x-1"
            >
                <Upload className="h-3 w-3" />
                <span>{t('file')}</span>
            </Button>
        </div>
    )
}


