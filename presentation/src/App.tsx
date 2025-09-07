import { Routes, Route } from 'react-router-dom'
import { DevToolsLayout } from '@/components/layout/DevToolsLayout'
import { Suspense, lazy } from 'react'
import { PageLoader } from '@/components/common/PageLoader'

// Lazy loading das páginas para melhor performance
const HomePage = lazy(() => import('@/pages/HomePage').then(module => ({ default: module.HomePage })))
const GenericConverterPage = lazy(() => import('@/pages/GenericConverterPage').then(module => ({ default: module.GenericConverterPage })))
const ComparatorPage = lazy(() => import('@/pages/ComparatorPage').then(module => ({ default: module.ComparatorPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })))

function App() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route path="/" element={<DevToolsLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path=":slug" element={<GenericConverterPage />} />
                    <Route path="comparator" element={<ComparatorPage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    )
}

export default App
