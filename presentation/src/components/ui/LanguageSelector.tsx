import { useTranslation, SupportedLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { Globe, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
    className?: string;
    variant?: 'inline' | 'sidebar';
}

const languageOptions: { value: SupportedLanguage; label: string; flag: string }[] = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'pt_BR', label: 'Português (BR)', flag: '🇧🇷' },
];

export function LanguageSelector({ className, variant = 'inline' }: LanguageSelectorProps) {
    const { language, setLanguage, t } = useTranslation();
    const [open, setOpen] = useState(false);

    const current = languageOptions.find(o => o.value === language) || languageOptions[0];

    const triggerClass = variant === 'sidebar'
        ? 'h-8 px-2 text-xs'
        : 'px-2 py-1';

    return (
        <div className={cn('relative', className)}>
            <Button
                variant={variant === 'sidebar' ? 'ghost' : 'outline'}
                onClick={() => setOpen(o => !o)}
                className={cn('flex items-center gap-2', triggerClass)}
                title={t('localeDescription')}
            >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{current.label}</span>
                <span className="sm:hidden">{current.value}</span>
            </Button>
            {open && (
                <div
                    className={cn(
                        'absolute z-50 mt-1 w-44 rounded-md border bg-popover shadow-md',
                        variant === 'sidebar' ? 'left-0' : 'right-0'
                    )}
                    role="menu"
                >
                    {languageOptions.map((opt) => (
                        <button
                            key={opt.value}
                            className={cn(
                                'flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted',
                                opt.value === language && 'bg-muted/70'
                            )}
                            onClick={() => { setLanguage(opt.value); setOpen(false); }}
                            role="menuitem"
                        >
                            <span className="text-base leading-none">{opt.flag}</span>
                            <span className="flex-1">{opt.label}</span>
                            {opt.value === language && <Check className="h-4 w-4 text-primary" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
