import { Routes, Route } from 'react-router-dom'
import { DevToolsLayout } from '@/components/layout/DevToolsLayout'
import { Suspense, lazy } from 'react'
import { PageLoader } from '@/components/common/PageLoader'
import { devTools } from '@/config/tools'
import { I18nProvider } from '@/lib/i18n'

// Lazy loading das páginas para melhor performance
const HomePage = lazy(() => import('@/pages/HomePage').then(module => ({ default: module.HomePage })))
const GenericConverterPage = lazy(() => import('@/pages/GenericConverterPage').then(module => ({ default: module.GenericConverterPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })))

function App() {
    return (
        <I18nProvider defaultLanguage="pt_BR">
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/" element={<DevToolsLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path=":slug" element={<GenericConverterPage />} />
                        {devTools
                            .filter(t => t.getComponent)
                            .map(t => {
                                // lazy must be called at module scope; we prebuild a component per tool
                                const LazyComp = lazy(t.getComponent as any)
                                return (
                                    <Route key={t.id} path={t.path.replace(/^\/+/, '')} element={<LazyComp />} />
                                )
                            })}
                    </Route>
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </I18nProvider>
    )
}

export default App
