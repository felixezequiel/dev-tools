import { useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { DataConverterLayout } from '@/components/common/DataConverterLayout'
import { converterConfigs } from '@/config/converters'
import { AnimatePresence, motion } from 'framer-motion'

export function GenericConverterPage() {
    const { slug } = useParams()
    const key = (slug ?? '').toLowerCase().replace(/-converter$/, '') as keyof typeof converterConfigs

    const config = converterConfigs[key as keyof typeof converterConfigs]
    if (!config) {
        return <Navigate to="/" replace />
    }

    // Scroll to top when converter changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [key])

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={key as string}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
            >
                <DataConverterLayout
                    config={config}
                    breadcrumbs={[
                        { label: 'Home', path: '/' },
                        { label: config.title, isActive: true }
                    ]}
                />
            </motion.div>
        </AnimatePresence>
    )
}

export default GenericConverterPage


