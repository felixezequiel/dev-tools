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
        description: 'Converte dados estruturados (chave-valor, JSON, CSV) em objetos JSON organizados com validação em tempo real',
        icon: 'FileText',
        path: '/json-converter',
        category: 'converter'
    },
    {
        id: 'csv-converter',
        name: 'Conversor CSV',
        description: 'Transforma dados estruturados em arquivos CSV com formatação adequada e escape de caracteres especiais',
        icon: 'Table',
        path: '/csv-converter',
        category: 'converter'
    },
    {
        id: 'formdata-converter',
        name: 'Conversor FormData',
        description: 'Converte dados estruturados em FormData para envio de formulários web com preview interativo',
        icon: 'Database',
        path: '/formdata-converter',
        category: 'converter'
    }
]

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
    },
    {
        icon: Clock,
        title: 'Performance Otimizada',
        description: 'Lazy loading, code splitting e renderização otimizada para máxima eficiência'
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
