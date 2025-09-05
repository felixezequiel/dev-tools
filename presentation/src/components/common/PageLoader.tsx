import { motion } from 'framer-motion'
import { FileText, Loader2 } from 'lucide-react'

export function PageLoader() {
    return (
        <div className="flex min-h-[400px] items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center space-y-4"
            >
                <div className="relative">
                    <FileText className="h-12 w-12 text-primary" />
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-1 -right-1"
                    >
                        <Loader2 className="h-6 w-6 text-primary" />
                    </motion.div>
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium">Carregando ferramenta...</h3>
                    <p className="text-sm text-muted-foreground">
                        Preparando tudo para você
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
