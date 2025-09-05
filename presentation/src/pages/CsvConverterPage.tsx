import { DataConverterLayout } from '@/components/common/DataConverterLayout'
import { getConverterConfig } from '@/config/converters'

export function CsvConverterPage() {
    const config = getConverterConfig('csv')

    return (
        <DataConverterLayout
            config={config}
            breadcrumbs={[
                { label: 'Página Inicial', path: '/' },
                { label: 'Conversor CSV', isActive: true }
            ]}
        />
    )
}
