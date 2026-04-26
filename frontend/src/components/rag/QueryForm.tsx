'use client'

import { useState, FormEvent } from 'react'

interface QueryFormProps {
  onSubmit: (query: string, topK: number, refineQuery: boolean, useReranker: boolean) => void
  isLoading: boolean
  hasAnswer?: boolean
}

export function QueryForm({ onSubmit, isLoading, hasAnswer }: QueryFormProps) {
  const [query, setQuery] = useState('')
  const [topK, setTopK] = useState(8)
  const [refineQuery, setRefineQuery] = useState(true)
  const [useReranker, setUseReranker] = useState(true)
  const [showSourcesDropdown, setShowSourcesDropdown] = useState(false)
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isLoading) return
    onSubmit(query, topK, refineQuery, useReranker)
  }

  const setQueryFromExample = (exampleQuery: string) => {
    setQuery(exampleQuery)
  }

  const exampleQueries = [
    'What is 3D Gaussian Splatting?',
    'How does cloth simulation work in computer graphics?',
    'What are the latest advances in neural rendering?',
    'Explain fluid simulation techniques',
    'Neural radiance fields applications',
    'Real-time rendering optimization methods'
  ]

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        {/* Status indicator above search (when active) */}
        {/* {isLoading && (
          <div className="absolute -top-6 right-0 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Searching...</span>
          </div>
        )} */}

        {/* Main Search Container */}
        <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md focus-within:shadow-lg focus-within:border-blue-500 transition-all duration-200">
          <div className="flex items-center gap-2 px-4 py-4 md:py-5">
            {/* Left Side Icons - Options */}
            <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-colors ${
              refineQuery || useReranker 
                ? 'border-blue-300 bg-blue-50/70' 
                : 'border-gray-200 bg-gray-50/50'
            }`}>
              {/* Refine Query Icon */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRefineQuery(!refineQuery)}
                  onMouseEnter={() => setHoveredTooltip('refine')}
                  onMouseLeave={() => setHoveredTooltip(null)}
                  className={`p-1.5 rounded-md transition-colors ${
                    refineQuery
                      ? 'bg-blue-100 hover:bg-blue-200'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <svg className={`w-4 h-4 ${refineQuery ? 'text-blue-600' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                {/* Tooltip */}
                {hoveredTooltip === 'refine' && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-30">
                    <div className="font-semibold mb-1">Refine Query</div>
                    <div className="text-gray-300">Improves search accuracy by expanding and optimizing your query</div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                      <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Use Reranker Icon */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUseReranker(!useReranker)}
                  onMouseEnter={() => setHoveredTooltip('reranker')}
                  onMouseLeave={() => setHoveredTooltip(null)}
                  className={`p-1.5 rounded-md transition-colors ${
                    useReranker
                      ? 'bg-blue-100 hover:bg-blue-200'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <svg className={`w-4 h-4 ${useReranker ? 'text-blue-600' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                </button>
                {/* Tooltip */}
                {hoveredTooltip === 'reranker' && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-30">
                    <div className="font-semibold mb-1">Use Reranker</div>
                    <div className="text-gray-300">Re-ranks results for better relevance and accuracy</div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                      <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sources Icon with Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSourcesDropdown(!showSourcesDropdown)}
                  onMouseEnter={() => setHoveredTooltip('sources')}
                  onMouseLeave={() => setHoveredTooltip(null)}
                  className="p-1.5 rounded-md hover:bg-gray-100 transition-colors relative"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {/* Badge showing number */}
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                    {topK}
                  </span>
                </button>
                {/* Tooltip */}
                {hoveredTooltip === 'sources' && !showSourcesDropdown && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-30">
                    <div className="font-semibold mb-1">Sources</div>
                    <div className="text-gray-300">Number of research papers to retrieve (currently {topK})</div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                      <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                )}
                
                {/* Dropdown Menu */}
                {showSourcesDropdown && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowSourcesDropdown(false)}
                    />
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[100px] z-20">
                      {[5, 8, 10, 15].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => {
                            setTopK(num)
                            setShowSourcesDropdown(false)
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                            topK === num
                              ? 'bg-blue-50 text-blue-600 font-medium'
                              : 'text-gray-700'
                          }`}
                        >
                          <span>{num}</span>
                          {topK === num && (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Search Input */}
            <div className="flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything."
                disabled={isLoading}
                className="w-full bg-transparent text-gray-900 px-3 py-2 text-base md:text-lg placeholder:text-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-1">
             
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="p-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Search"
              >
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Suggested Queries - Only show when no answer */}
          {!hasAnswer && !isLoading && (
            <div className="border-t border-gray-100 px-4 py-3">
              <div className="space-y-1.5">
                {exampleQueries.slice(0, 6).map((example, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQueryFromExample(example)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left group"
                  >
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 flex-1 truncate">
                      {example}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

