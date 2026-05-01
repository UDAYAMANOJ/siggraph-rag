"use client";

import { QueryForm } from "@/components/rag/QueryForm";
import { AnswerSection } from "@/components/rag/AnswerSection";
import { SourcesSection } from "@/components/rag/SourcesSection";
import { ReferencesSection } from "@/components/rag/ReferencesSection";
import { StatusLine } from "@/components/rag/StatusLine";
import { useRAGStream } from "@/hooks/useRAGStream";

export default function Home() {
  const {
    answer,
    sources,
    processingTime,
    statusMessage,
    currentStage,
    isActive,
    isLoading,
    streamQuery,
    reset,
  } = useRAGStream();

  const handleQuerySubmit = (
    query: string,
    topK: number,
    refineQuery: boolean,
    useReranker: boolean
  ) => {
    reset();
    streamQuery(query, topK, refineQuery, useReranker);
  };

  return (
    <main className="bg-grid-square bg-white text-gray-900 min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl flex-grow flex flex-col">
        <div className="flex-grow">
          {/* Header - Logo */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-2xl md:text-5xl font-semibold text-gray-900 tracking-tight">
              SIG-RAG
            </h1>
            <p className="text-gray-600 mt-2">
              Search built for SIGGRAPH 2025 research papers
            </p>
          </div>

          {/* Query Form - Hero Section */}
          <div className="mb-8">
            <QueryForm
              onSubmit={handleQuerySubmit}
              isLoading={isLoading}
              hasAnswer={!!answer}
            />
          </div>

          {/* Progress/Status Section */}
          {(isActive || statusMessage) && (
            <div className="mb-6">
              <StatusLine
                message={statusMessage}
                isActive={isActive}
                currentStage={currentStage}
              />
            </div>
          )}

          {/* Answer Section */}
          <div className="mb-6">
            <AnswerSection
              answer={answer}
              processingTime={processingTime || undefined}
              isVisible={!!answer}
            />
          </div>

          {/* References Section */}
          <div className="mb-6">
            <ReferencesSection
              answer={answer}
              allSources={sources}
              isVisible={!!answer && sources.length > 0}
            />
          </div>

          {/* Sources Section */}
          {/* <div className="mb-6">
            <SourcesSection sources={sources} isVisible={sources.length > 0} />
          </div> */}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-500 text-xs md:text-sm">
          <p className="mb-2">
            Powered by <a href="https://www.aimasterclass.in" className="text-blue-600">AI MasterClass</a> 
          </p>
          <p>
            <a
              href="/api/info"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              API Info
            </a>{" "}
            <span className="mx-2">•</span>
            <a
              href="/docs"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              API Docs
            </a>{" "}
            <span className="mx-2">•</span>
            <a
              href="/health"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Health Check
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
