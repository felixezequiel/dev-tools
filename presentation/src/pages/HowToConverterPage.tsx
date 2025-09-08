import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { converterConfigs } from '@/config/converters'
import { Seo, JsonLd } from '@/components/common/Seo'

export function HowToConverterPage() {
    const { slug } = useParams()
    const key = (slug ?? '').toLowerCase().replace(/-converter$/, '') as keyof typeof converterConfigs
    const config = converterConfigs[key]
    if (!config) return <Navigate to="/" replace />

    const canonical = `https://dev-tools-presentation.vercel.app/how-to/${String(key)}-converter`
    const title = `Como usar ${config.outputDescription} — ${config.title}`

    const faqs = [
        {
            '@type': 'Question',
            name: 'Como usar esta ferramenta?',
            acceptedAnswer: { '@type': 'Answer', text: config.description }
        },
        {
            '@type': 'Question',
            name: 'Quais formatos de entrada são suportados?',
            acceptedAnswer: { '@type': 'Answer', text: config.inputTypes.join(', ') }
        }
    ]

    return (
        <div className="space-y-6">
            <Seo
                title={`${title} — DevTools`}
                description={config.description}
                canonical={canonical}
                openGraph={{ type: 'article', url: canonical, title: `${title} — DevTools`, description: config.description, siteName: 'DevTools' }}
                twitter={{ card: 'summary_large_image', site: '@devtools', title: `${title} — DevTools`, description: config.description }}
            >
                <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs }} />
            </Seo>

            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="text-muted-foreground">{config.description}</p>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Passo a passo</h2>
                <ol className="list-decimal pl-6 space-y-2">
                    <li>Escolha o tipo de entrada suportado.</li>
                    <li>Cole ou envie seu arquivo.</li>
                    <li>Clique em Converter para gerar {config.outputDescription}.</li>
                    <li>Revise, copie ou faça download do resultado.</li>
                </ol>
            </div>

            <div className="space-y-3">
                <h2 className="text-xl font-semibold">Perguntas frequentes</h2>
                <ul className="list-disc pl-6">
                    <li>Formatos suportados: {config.inputTypes.join(', ')}.</li>
                    <li>Uso gratuito e sem login.</li>
                </ul>
            </div>
        </div>
    )
}

export default HowToConverterPage


