import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Home, ArrowLeft } from 'lucide-react'

export function NotFoundPage() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="text-6xl font-bold text-muted-foreground">404</CardTitle>
                    <CardDescription className="text-lg">
                        Página não encontrada
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        A página que você está procurando não existe ou foi movida.
                    </p>
                              <div className="flex space-x-2 justify-center">
            <Link to="/">
              <Button variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Página Inicial
              </Button>
            </Link>
            <Button variant="default" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </div>
                </CardContent>
            </Card>
        </div>
    )
}
