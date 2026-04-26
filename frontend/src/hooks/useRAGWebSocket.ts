"use client";

import { useState, useCallback, useRef } from "react";

interface WSMessage {
  type: "progress" | "chunk" | "complete" | "error";
  message?: string;
  content?: string;
  answer?: string;
  processing_time?: number;
  sources?: Source[];
  stage?: string;
  original?: string;
  refined?: string;
  num_chunks?: number;
  num_papers?: number;
}

interface Source {
  title: string;
  authors?: string;
  pdf_url?: string;
  github_link?: string;
  video_link?: string;
  acm_url?: string;
}

interface UseRAGWebSocketReturn {
  answer: string;
  sources: Source[];
  processingTime: number | null;
  statusMessage: string;
  currentStage: string;
  isActive: boolean;
  isLoading: boolean;
  refinedQuery: string | null;
  sendQuery: (
    query: string,
    topK: number,
    refineQuery: boolean,
    useReranker: boolean
  ) => void;
  reset: () => void;
}

export function useRAGWebSocket(): UseRAGWebSocketReturn {
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<Source[]>([]);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [currentStage, setCurrentStage] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refinedQuery, setRefinedQuery] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);

  const sendQuery = useCallback(
    (
      query: string,
      topK: number,
      refineQuery: boolean,
      useReranker: boolean
    ) => {
      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close();
      }

      setIsLoading(true);
      setIsActive(true);
      setAnswer("");
      setSources([]);
      setProcessingTime(null);
      setStatusMessage("Connecting...");
      setCurrentStage("connecting");
      setRefinedQuery(null);

      // Determine WebSocket URL based on environment
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";
      const baseUrl = apiUrl.replace(/^https?:\/\//, "").replace(/\/$/, ""); // Remove http(s):// and trailing slash
      const protocol = apiUrl.startsWith("https") ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${baseUrl}/ws/query`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("🔌 WebSocket connected");
        setStatusMessage("Connected, sending query...");
        
        // Send query parameters
        ws.send(JSON.stringify({
          query,
          top_k: topK,
          refine_query: refineQuery,
          use_reranker: useReranker,
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data: WSMessage = JSON.parse(event.data);
          handleMessage(data);
        } catch (e) {
          console.error("Failed to parse WebSocket message:", e);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setStatusMessage("Connection error");
        setCurrentStage("error");
        setIsActive(false);
        setIsLoading(false);
      };

      ws.onclose = () => {
        console.log("🔌 WebSocket closed");
        wsRef.current = null;
      };
    },
    []
  );

  const handleMessage = (data: WSMessage) => {
    console.log("📨 WS:", data.type, data.stage || "", data.message || "");

    switch (data.type) {
      case "progress":
        setStatusMessage(data.message || "");
        if (data.stage) {
          setCurrentStage(data.stage);
        }
        if (data.refined) {
          setRefinedQuery(data.refined);
        }
        setIsActive(true);
        break;

      case "chunk":
        setAnswer((prev) => prev + (data.content || ""));
        setStatusMessage("Writing answer...");
        setCurrentStage("writing");
        setIsActive(true);
        break;

      case "complete":
        if (data.answer) {
          setAnswer(data.answer);
        }
        if (data.processing_time !== undefined) {
          setProcessingTime(data.processing_time);
        }
        if (data.sources) {
          setSources(data.sources);
        }
        setCurrentStage("complete");
        setStatusMessage(`Done in ${data.processing_time?.toFixed(1) || "?"}s`);
        setIsActive(false);
        setIsLoading(false);
        break;

      case "error":
        setStatusMessage(`Error: ${data.message || "Unknown error"}`);
        setCurrentStage("error");
        setIsActive(false);
        setIsLoading(false);
        break;
    }
  };

  const reset = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setAnswer("");
    setSources([]);
    setProcessingTime(null);
    setStatusMessage("");
    setCurrentStage("");
    setIsActive(false);
    setIsLoading(false);
    setRefinedQuery(null);
  }, []);

  return {
    answer,
    sources,
    processingTime,
    statusMessage,
    currentStage,
    isActive,
    isLoading,
    refinedQuery,
    sendQuery,
    reset,
  };
}
