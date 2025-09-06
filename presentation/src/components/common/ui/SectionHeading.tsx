interface SectionHeadingProps {
    step: number
    title: string
    description?: string
}

export function SectionHeading({ step, title, description }: SectionHeadingProps) {
    return (
        <div className="mb-2">
            <div className="flex items-center space-x-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {step}
                </div>
                <h4 className="text-sm font-medium">{title}</h4>
            </div>
            {description && (
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
        </div>
    )
}

export default SectionHeading


