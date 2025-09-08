import React from 'react'

interface JsonLdProps {
    data: Record<string, any>
}

export function JsonLd({ data }: JsonLdProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    )
}

interface SeoProps {
    title?: string
    description?: string
    canonical?: string
    children?: React.ReactNode
    openGraph?: {
        type?: string
        url?: string
        title?: string
        description?: string
        image?: string
        siteName?: string
    }
    twitter?: {
        card?: 'summary' | 'summary_large_image'
        site?: string
        title?: string
        description?: string
        image?: string
    }
}

export function Seo({ title, description, canonical, openGraph, twitter, children }: SeoProps) {
    React.useEffect(() => {
        const upsertMeta = (attr: 'name' | 'property', key: string, value: string) => {
            if (!value) return
            let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
            if (!el) {
                el = document.createElement('meta')
                el.setAttribute(attr, key)
                document.head.appendChild(el)
            }
            el.setAttribute('content', value)
        }

        if (title) document.title = title
        if (description) {
            let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
            if (!meta) {
                meta = document.createElement('meta')
                meta.name = 'description'
                document.head.appendChild(meta)
            }
            meta.content = description
        }
        if (canonical) {
            let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
            if (!link) {
                link = document.createElement('link')
                link.rel = 'canonical'
                document.head.appendChild(link)
            }
            link.href = canonical
        }

        // Open Graph
        if (openGraph) {
            upsertMeta('property', 'og:type', openGraph.type || 'website')
            upsertMeta('property', 'og:url', openGraph.url || canonical || '')
            upsertMeta('property', 'og:title', openGraph.title || title || '')
            upsertMeta('property', 'og:description', openGraph.description || description || '')
            if (openGraph.siteName) upsertMeta('property', 'og:site_name', openGraph.siteName)
            if (openGraph.image) upsertMeta('property', 'og:image', openGraph.image)
        }

        // Twitter
        if (twitter) {
            upsertMeta('name', 'twitter:card', twitter.card || 'summary')
            if (twitter.site) upsertMeta('name', 'twitter:site', twitter.site)
            upsertMeta('name', 'twitter:title', twitter.title || title || '')
            upsertMeta('name', 'twitter:description', twitter.description || description || '')
            if (twitter.image) upsertMeta('name', 'twitter:image', twitter.image)
        }
    }, [title, description, canonical, openGraph, twitter])

    return <>{children}</>
}

export default Seo


