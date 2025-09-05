import { FormDataConverterLayout } from '@/components/common/FormDataConverterLayout'

export function FormDataConverterPage() {
    return (
        <FormDataConverterLayout
            breadcrumbs={[
                { label: 'Página Inicial', path: '/' },
                { label: 'Conversor FormData', isActive: true }
            ]}
        />
    )
}
