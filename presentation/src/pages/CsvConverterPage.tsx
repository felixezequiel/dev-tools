import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table } from 'lucide-react'

export function CsvConverterPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Conversor CSV"
                description="Transforma dados JSON em arquivos CSV estruturados"
                breadcrumbs={[
                    { label: 'Página Inicial', path: '/' },
                    { label: 'Conversor CSV', isActive: true }
                ]}
            />

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Table className="h-5 w-5" />
                        <span>Em Desenvolvimento</span>
                        <Badge variant="warning">Breve</Badge>
                    </CardTitle>
                    <CardDescription>
                        Esta ferramenta estará disponível em breve com funcionalidades completas de conversão JSON para CSV.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Estamos trabalhando para trazer a melhor experiência possível para conversão de dados JSON para CSV.
                        Fique ligado para as próximas atualizações!
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
