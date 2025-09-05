import { Routes, Route } from 'react-router-dom'
import { DevToolsLayout } from '@/components/layout/DevToolsLayout'
import { Suspense, lazy } from 'react'
import { PageLoader } from '@/components/common/PageLoader'

// Lazy loading das páginas para melhor performance
const HomePage = lazy(() => import('@/pages/HomePage').then(module => ({ default: module.HomePage })))
const JsonConverterPage = lazy(() => import('@/pages/JsonConverterPage').then(module => ({ default: module.JsonConverterPage })))
const CsvConverterPage = lazy(() => import('@/pages/CsvConverterPage').then(module => ({ default: module.CsvConverterPage })))
const FormDataConverterPage = lazy(() => import('@/pages/FormDataConverterPage').then(module => ({ default: module.FormDataConverterPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })))

function App() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                <Route path="/" element={<DevToolsLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="json-converter" element={<JsonConverterPage />} />
                    <Route path="csv-converter" element={<CsvConverterPage />} />
                    <Route path="formdata-converter" element={<FormDataConverterPage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    )
}

export default App
