import { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { DataConverterLayout } from '@/components/common/DataConverterLayout'
import { converterConfigs } from '@/config/converters'
import { AnimatePresence, motion } from 'framer-motion'
import { useHeader } from '@/components/layout/HeaderContext'
import { useTranslation } from '@/lib/i18n'
import { getTranslatedToolsFor } from '@/config/tools'

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
                <DataConverterLayout config={config} />
            </motion.div>
        </AnimatePresence>
    )
}

export default GenericConverterPage


