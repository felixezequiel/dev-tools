import { motion } from 'framer-motion'
import { ToolCard } from '@/components/common/ToolCard'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Zap, Clock, Shield, Sparkles } from 'lucide-react'
import type { Tool } from '@/types'

const tools: Tool[] = [
    {
        id: 'json-converter',
        name: 'Conversor JSON',
        description: 'Converte fontes de entrada estruturadas em objetos JSON organizados',
        icon: 'FileText',
        path: '/json-converter',
        category: 'converter'
    },
    {
        id: 'csv-converter',
        name: 'Conversor CSV',
        description: 'Transforma dados JSON em arquivos CSV estruturados e formatados',
        icon: 'Table',
        path: '/csv-converter',
        category: 'converter'
    },
    {
        id: 'formdata-converter',
        name: 'Conversor FormData',
        description: 'Converte objetos JSON em FormData para envio de formulários',
        icon: 'Database',
        path: '/formdata-converter',
        category: 'converter'
    }
]

const features = [
    {
        icon: Zap,
        title: 'Rápido',
        description: 'Conversões instantâneas com processamento otimizado'
    },
    {
        icon: Shield,
        title: 'Seguro',
        description: 'Processamento local, seus dados nunca saem do seu dispositivo'
    },
    {
        icon: Sparkles,
        title: 'Moderno',
        description: 'Interface elegante seguindo as melhores práticas de UX'
    },
    {
        icon: Clock,
        title: 'Eficiente',
        description: 'Ferramentas especializadas para cada tipo de conversão'
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
                    <Badge variant="secondary">{tools.length} ferramentas</Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tools.map((tool, index) => (
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
                        <span>Selecione uma ferramenta</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            2
                        </div>
                        <span>Insira ou faça upload dos dados</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            3
                        </div>
                        <span>Baixe o resultado convertido</span>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
