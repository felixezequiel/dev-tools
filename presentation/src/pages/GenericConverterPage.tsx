import { useEffect } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { DataConverterLayout } from '@/components/common/DataConverterLayout'
import { converterConfigs } from '@/config/converters'
import { AnimatePresence, motion } from 'framer-motion'
import { useHeader } from '@/components/layout/HeaderContext'
import { useTranslation } from '@/lib/i18n'
import { getTranslatedToolsFor } from '@/config/tools'
import { Seo, JsonLd } from '@/components/common/Seo'

export function GenericConverterPage() {
    const { slug } = useParams()
    const key = (slug ?? '').toLowerCase().replace(/-converter$/, '') as keyof typeof converterConfigs

    const config = converterConfigs[key as keyof typeof converterConfigs]
    if (!config) {
        return <Navigate to="/" replace />
    }

    const { setHeader } = useHeader()
    const { t } = useTranslation()

    // Scroll to top when converter changes and set header
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        const tools = getTranslatedToolsFor(t)
        const currentPath = `/${String(key)}-converter`
        const tool = tools.find(tl => tl.path === currentPath)
        if (tool) {
            setHeader(tool.name, tool.description)
        } else {
            setHeader(config.title, config.description)
        }
    }, [key, t])

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={key as string}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
            >
                <Seo
                    title={`${config.title} — DevTools`}
                    description={config.description}
                    canonical={`https://dev-tools-presentation.vercel.app/${String(key)}-converter`}
                    openGraph={{
                        type: 'article',
                        url: `https://dev-tools-presentation.vercel.app/${String(key)}-converter`,
                        title: `${config.title} — DevTools`,
                        description: config.description,
                        siteName: 'DevTools'
                    }}
                    twitter={{
                        card: 'summary_large_image',
                        site: '@devtools',
                        title: `${config.title} — DevTools`,
                        description: config.description
                    }}
                >
                    <JsonLd data={{
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: [
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
                    }} />
                </Seo>
                <div className="mb-4">
                    <Link
                        to={`/how-to/${String(key)}-converter`}
                        className="text-sm text-primary hover:underline"
                    >
                        Como usar esta ferramenta
                    </Link>
                </div>
                <DataConverterLayout config={config} />
            </motion.div>
        </AnimatePresence>
    )
}

export default GenericConverterPage


