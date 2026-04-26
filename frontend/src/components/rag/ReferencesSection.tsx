'use client'

interface Source {
  title: string
  authors?: string
  pdf_url?: string
  github_link?: string
  video_link?: string
  acm_url?: string
}

interface ReferencesSectionProps {
  answer: string
  allSources: Source[]
  isVisible: boolean
}

export function ReferencesSection({ answer, allSources, isVisible }: ReferencesSectionProps) {
  // Extract citations from answer
  const extractCitations = (text: string): string[] => {
    const citationRegex = /\[([^\]]+)\]/g
    const citations = new Set<string>()
    let match
    
    while ((match = citationRegex.exec(text)) !== null) {
      citations.add(match[1])
    }
    
    return Array.from(citations)
  }

  // Find matching sources for citations
  const getCitedSources = (citations: string[], sources: Source[]): Source[] => {
    const citedSources: Source[] = []
    const usedIndices = new Set<number>()

    citations.forEach((citation) => {
      // Try exact match
      let source = sources.find((s, idx) => {
        if (usedIndices.has(idx)) return false
        return s.title === citation
      })

      // Try case-insensitive match
      if (!source) {
        const citationLower = citation.toLowerCase()
        source = sources.find((s, idx) => {
          if (usedIndices.has(idx)) return false
          return s.title.toLowerCase() === citationLower
        })
      }

      // Try partial match
      if (!source) {
        const citationLower = citation.toLowerCase()
        source = sources.find((s, idx) => {
          if (usedIndices.has(idx)) return false
          const titleLower = s.title.toLowerCase()
          return citationLower.includes(titleLower) || titleLower.includes(citationLower)
        })
      }

      if (source) {
        const sourceIdx = sources.indexOf(source)
        usedIndices.add(sourceIdx)
        citedSources.push(source)
      }
    })

    return citedSources
  }

  const citations = extractCitations(answer)
  const citedSources = getCitedSources(citations, allSources)

  if (!isVisible || citedSources.length === 0) return null

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 md:px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">References</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
            {citedSources.length}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">#</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Title</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Authors</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Links</th>
            </tr>
          </thead>
            <tbody>
              {citedSources.map((source, index) => {
                const links = []
                if (source.pdf_url) links.push({ url: source.pdf_url, label: 'PDF', color: 'text-blue-600' })
                if (source.github_link) links.push({ url: source.github_link, label: 'GitHub', color: 'text-green-600' })
                if (source.video_link) links.push({ url: source.video_link, label: 'Video', color: 'text-red-600' })
                if (source.acm_url) links.push({ url: source.acm_url, label: 'ACM', color: 'text-purple-600' })

                return (
                  <tr 
                    key={index} 
                    className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors fade-in"
                  >
                    <td className="py-4 px-6 text-gray-500 font-medium text-sm">{index + 1}</td>
                    <td className="py-4 px-6 text-gray-900 font-semibold max-w-md">
                      {source.title}
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm max-w-xs">
                      {source.authors ? (
                        <span title={source.authors} className="line-clamp-2">
                          {source.authors.length > 80 
                            ? `${source.authors.substring(0, 80)}...` 
                            : source.authors}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {links.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {links.map((link, linkIndex) => (
                            <a
                              key={linkIndex}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${link.color} hover:underline text-xs font-medium px-2 py-1 rounded-md hover:bg-gray-100 transition-colors`}
                            >
                              {link.label}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
    </div>
  )
}

