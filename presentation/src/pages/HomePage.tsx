import { motion } from 'framer-motion'
import { ToolCard } from '@/components/common/ToolCard'
import { Badge } from '@/components/ui/Badge'
import { Zap, Shield, Sparkles } from 'lucide-react'
import { acceptedInputTypes, supportedOutputs } from '@/config/supported'
import type { Tool } from '@/types'
import { getTranslatedToolsFor } from '@/config/tools'
import { useTranslation } from '@/lib/i18n'
import { useHeader } from '@/components/layout/HeaderContext'
import { useEffect } from 'react'

export function HomePage() {
    const { t } = useTranslation()
    const { setHeader } = useHeader()

    // Ensure header shows brand defaults on home, reacting to language changes
    useEffect(() => {
        setHeader(t('brandName'), t('modernToolsDescription'))
    }, [t])

    const allTools: Tool[] = getTranslatedToolsFor(t).map(tl => ({
        id: tl.id,
        name: tl.name,
        description: tl.description,
        iconComponent: tl.icon,
        path: tl.path,
        category: tl.category === 'converter' ? 'converter' : tl.category === 'generator' ? 'formatter' : 'validator'
    }))

    const features = [
        {
            icon: Zap,
            title: t('powerfulConversion'),
            description: t('powerfulConversionDesc')
        },
        {
            icon: Shield,
            title: t('secureProcessing'),
            description: t('secureProcessingDesc')
        },
        {
            icon: Sparkles,
            title: t('modernInterface'),
            description: t('modernInterfaceDesc')
        }
    ]

    const issuesUrl = (import.meta as any).env?.VITE_GITHUB_ISSUES_URL || 'https://github.com/felixezequiel/dev-tools/issues/new'
    return (
        <div className="space-y-8">
            {/* Feedback / Issues (Top) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-lg border p-6 bg-card"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold mb-1">{t('foundProblem')}</h3>
                        <p className="text-sm text-muted-foreground">{t('reportOnGithub')}</p>
                    </div>
                    <a href={issuesUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                        <button className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-muted">
                            {t('openIssues')}
                        </button>
                    </a>
                </div>
            </motion.div>

            {/* Getting Started (Second section) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-lg border bg-gradient-to-r from-primary/5 to-secondary/5 p-6"
            >
                <h3 className="text-lg font-semibold mb-2">{t('howToStart')}</h3>
                <p className="text-muted-foreground mb-4">
                    {t('chooseToolDescription')}
                </p>
                <div className="grid gap-4 md:grid-cols-3 text-sm">
                    <div className="flex items-center space-x-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            1
                        </div>
                        <span>{t('chooseInputFormat')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            2
                        </div>
                        <span>{t('enterDataValidation')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            3
                        </div>
                        <span>{t('convertDownloadResult')}</span>
                    </div>
                </div>
            </motion.div>

            {/* Features */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center space-x-3 rounded-lg border p-4 bg-card"
                    >
                        <feature.icon className="h-8 w-8 text-primary" />
                        <div>
                            <h3 className="font-semibold">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Tools Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">{t('availableTools')}</h2>
                    <Badge variant="secondary">{t('toolsCount').replace('{{count}}', allTools.length.toString())}</Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {allTools.map((tool, index) => (
                        <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        >
                            <ToolCard tool={tool} />
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Supported Types */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid gap-6 md:grid-cols-2"
            >
                <div className="rounded-lg border p-6 bg-card">
                    <h3 className="text-lg font-semibold mb-3">{t('acceptedInputTypes')}</h3>
                    <div className="flex flex-wrap gap-2">
                        {acceptedInputTypes.map((t) => (
                            <span key={t.key} className="text-xs px-2 py-1 rounded-md bg-muted">
                                {t.label}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="rounded-lg border p-6 bg-card">
                    <h3 className="text-lg font-semibold mb-3">{t('supportedOutputs')}</h3>
                    <div className="flex flex-wrap gap-2">
                        {supportedOutputs.map((o) => (
                            <span key={o.key} className="text-xs px-2 py-1 rounded-md bg-muted">
                                {o.label}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>

        </div>
    )
}
