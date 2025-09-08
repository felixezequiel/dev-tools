import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Home, ArrowLeft } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export function NotFoundPage() {
    const { t } = useTranslation()
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="text-6xl font-bold text-muted-foreground">404</CardTitle>
                    <CardDescription className="text-lg">
                        {t('notFoundTitle')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        {t('notFoundDescription')}
                    </p>
                    <div className="flex space-x-2 justify-center">
                        <Link to="/">
                            <Button variant="outline">
                                <Home className="mr-2 h-4 w-4" />
                                {t('goHome')}
                            </Button>
                        </Link>
                        <Button variant="default" onClick={() => window.history.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {t('goBack')}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
