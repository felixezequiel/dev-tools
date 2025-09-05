import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Database } from 'lucide-react'

export function FormDataConverterPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Conversor FormData"
                description="Converte objetos JSON em FormData para envio de formulários"
                breadcrumbs={[
                    { label: 'Página Inicial', path: '/' },
                    { label: 'Conversor FormData', isActive: true }
                ]}
            />

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Database className="h-5 w-5" />
                        <span>Em Desenvolvimento</span>
                        <Badge variant="warning">Breve</Badge>
                    </CardTitle>
                    <CardDescription>
                        Esta ferramenta estará disponível em breve com funcionalidades completas de conversão JSON para FormData.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Estamos trabalhando para trazer a melhor experiência possível para conversão de dados JSON para FormData.
                        Fique ligado para as próximas atualizações!
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
