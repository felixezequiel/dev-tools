import { motion } from 'framer-motion'
import { ToolCard } from '@/components/common/ToolCard'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Zap, Shield, Sparkles } from 'lucide-react'
import { acceptedInputTypes, supportedOutputs } from '@/config/supported'
import type { Tool } from '@/types'
import { devTools } from '@/config/tools'

const allTools: Tool[] = devTools.map(t => ({
    id: t.id,
    name: t.name,
    description: t.description,
    iconComponent: t.icon,
    path: t.path,
    // map categories to existing Tool type categories for badge display
    category: t.category === 'converter' ? 'converter' : t.category === 'generator' ? 'formatter' : 'validator'
}))

const features = [
    {
        icon: Zap,
        title: 'Conversão Poderosa',
        description: 'Suporte completo aos transformadores do DataReBuilder com múltiplos formatos de entrada'
    },
    {
        icon: Shield,
        title: 'Processamento Seguro',
        description: 'Todo processamento é feito localmente usando as classes do domínio robustas'
    },
    {
        icon: Sparkles,
        title: 'Interface Moderna',
        description: 'Design elegante com validação em tempo real e feedback visual inteligente'
    }
]

export function HomePage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <PageHeader
                title="DevTools"
                description="Ferramentas modernas para conversão de dados"
            />

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
                    <h2 className="text-2xl font-bold tracking-tight">Ferramentas Disponíveis</h2>
                    <Badge variant="secondary">{allTools.length} ferramentas</Badge>
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
                    <h3 className="text-lg font-semibold mb-3">Tipos de Entrada Aceitos</h3>
                    <div className="flex flex-wrap gap-2">
                        {acceptedInputTypes.map((t) => (
                            <span key={t.key} className="text-xs px-2 py-1 rounded-md bg-muted">
                                {t.label}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="rounded-lg border p-6 bg-card">
                    <h3 className="text-lg font-semibold mb-3">Saídas Suportadas</h3>
                    <div className="flex flex-wrap gap-2">
                        {supportedOutputs.map((o) => (
                            <span key={o.key} className="text-xs px-2 py-1 rounded-md bg-muted">
                                {o.label}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Getting Started */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="rounded-lg border bg-gradient-to-r from-primary/5 to-secondary/5 p-6"
            >
                <h3 className="text-lg font-semibold mb-2">Como começar</h3>
                <p className="text-muted-foreground mb-4">
                    Escolha uma ferramenta acima para começar a converter seus dados.
                    Cada ferramenta é especializada em um tipo específico de conversão.
                </p>
                <div className="grid gap-4 md:grid-cols-3 text-sm">
                    <div className="flex items-center space-x-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            1
                        </div>
                        <span>Escolha o formato de entrada (JSON, chave-valor, CSV)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            2
                        </div>
                        <span>Insira os dados com validação em tempo real</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            3
                        </div>
                        <span>Converta e baixe o resultado no formato desejado</span>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
