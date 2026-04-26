'use client'

import { Card, CardContent } from '@/components/ui/card'

interface Source {
  title: string
  authors?: string
  pdf_url?: string
  github_link?: string
  video_link?: string
  acm_url?: string
}

interface SourcesSectionProps {
  sources: Source[]
  isVisible: boolean
}

export function SourcesSection({ sources, isVisible }: SourcesSectionProps) {
  if (!isVisible || sources.length === 0) return null

  return (
    <Card variant="base" className="bg-white border-gray-200 shadow-xl">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 All Retrieved Sources</h3>
        <div className="space-y-4">
          {sources.map((source, index) => {
            const links = []
            if (source.pdf_url) links.push({ url: source.pdf_url, label: 'PDF', color: 'text-blue-600' })
            if (source.github_link) links.push({ url: source.github_link, label: 'GitHub', color: 'text-green-600' })
            if (source.video_link) links.push({ url: source.video_link, label: 'Video', color: 'text-red-600' })
            if (source.acm_url) links.push({ url: source.acm_url, label: 'ACM', color: 'text-purple-600' })

            return (
              <div key={index} className="bg-gray-50 rounded-lg p-4 fade-in border border-gray-200">
                <div className="font-semibold text-gray-900">{index + 1}. {source.title}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {source.authors?.substring(0, 100)}{source.authors && source.authors.length > 100 ? '...' : ''}
                </div>
                {links.length > 0 && (
                  <div className="flex gap-3 mt-2 text-sm">
                    {links.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${link.color} hover:underline`}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

