import { DataConverterLayout } from '@/components/common/DataConverterLayout'
import { getConverterConfig } from '@/config/converters'

export function JsonConverterPage() {
    const config = getConverterConfig('json')

    return (
        <DataConverterLayout
            config={config}
            breadcrumbs={[
                { label: 'Página Inicial', path: '/' },
                { label: 'Conversor JSON', isActive: true }
            ]}
        />
    )
}
