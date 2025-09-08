import { DataConverterLayout } from '@/components/common/DataConverterLayout'
import { getConverterConfig } from '@/config/converters'

export function DatabaseMigrationConverterPage() {
    const config = getConverterConfig('database-migration' as any)

    return (
        <DataConverterLayout
            config={config}
        />
    )
}


