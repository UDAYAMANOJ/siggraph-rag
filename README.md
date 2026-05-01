# SIGGRAPH 2025 RAG Search Application

A full-stack Retrieval-Augmented Generation (RAG) application for searching and querying SIGGRAPH 2025 research papers. This project combines a Next.js frontend with a FastAPI backend to provide an intelligent search interface powered by AI.

## 🚀 Live Deployment

| Service | URL |
|---------|-----|
| **Frontend (Vercel)** | https://siggraph-czlc0bwja-udayamanojs-projects.vercel.app/ |
| **Backend (Render)** | https://siggraph-rag-qkdt.onrender.com |
| **API Health Check** | https://siggraph-rag-qkdt.onrender.com/health |
| **API Docs** | https://siggraph-rag-qkdt.onrender.com/docs |
| **GitHub Repo** | https://github.com/UDAYAMANOJ/siggraph-rag |

## 🎯 Project Overview

Build a production-ready RAG application that allows users to:
- Search through 11,000+ SIGGRAPH 2025 paper chunks
- Get AI-generated answers with inline citations
- View source papers with links to PDFs, GitHub repos, and videos
- Experience real-time streaming responses

## 🏗️ Architecture

This is a **full-stack application** with separate frontend and backend:

-   **Frontend**: Next.js app — [Live on Vercel](https://siggraph-czlc0bwja-udayamanojs-projects.vercel.app/) / Local: `http://localhost:3000`
    - Modern React UI with Tailwind CSS
    - Real-time streaming via Server-Sent Events (SSE)
    - Responsive design with progress indicators

-   **Backend**: FastAPI server — [Live on Render](https://siggraph-rag-qkdt.onrender.com) / Local: `http://localhost:8082`
    - RESTful API with SSE streaming support
    - Hybrid search (semantic + keyword)
    - AI-powered answer generation with citations

The frontend communicates with the backend via HTTP API calls.

## Dataset
Chunked dataset in json form: https://drive.google.com/drive/folders/1-NaRLrjlMMW56ATTwXB5FYV84EjTOALT

## Prerequisites

-   Python 3.8+
-   Node.js 18+ and npm
-   Git
-   GitHub account

## 🚀 Getting Started

### Step 0: Fork This Repository

**IMPORTANT**: You must fork this repository to your own GitHub account to work on the assignment.

1. **Click the "Fork" button** at the top right of this repository
2. **Select your GitHub account** as the destination
3. **Clone your forked repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/siggraph-rag.git
   cd siggraph-rag
   ```

You will be working in **your fork**, not the original repository. This allows you to:
- ✅ Push your code changes
- ✅ Track your progress with commits
- ✅ Deploy your own version
- ✅ Submit your work via your repository link

---

## 1. Setup Instructions

Follow these steps to set up your local environment.

### a. Navigate to the Backend Directory

```bash
cd backend
```

### b. Create and Activate a Virtual Environment (Recommended)

```bash
# Create a virtual environment
python3 -m venv venv

# Activate it
# On macOS/Linux:
source venv/bin/activate

# On Windows:
.\venv\Scripts\activate
source .venv/Scripts/activate
```

### c. Install Dependencies

Install the required Python packages using the `requirements.txt` file.

```bash
pip install -r requirements.txt
```

### d. Set Up Environment Variables

You will need to provide API keys for the services used by the RAG pipeline. **All models (embeddings and LLMs) are accessed via OpenRouter API** for simplicity and cost-effectiveness.

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Now, edit the `.env` file and add your API keys:

```bash
# Required: OpenRouter API (for all models)
OPENROUTER_API_KEY="sk-or-v1-..."

# Required: Qdrant Cloud
QDRANT_URL="https://27fbf31a-e716-4bb7-b37c-1844fc21212e.eu-west-2-0.aws.cloud.qdrant.io:6333"
QDRANT_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIiwic3ViamVjdCI6ImFwaS1rZXk6NmRkNDNlYjktNWQwZS00MmI0LThlNDktNjU3MGUwYmY4ZTQxIn0.ahoNr4TRjy2VtcsZWUH-L87c0yaf1T9xSn_g53tQKtw"

# Model Configuration
EMBEDDING_MODEL="baai/bge-large-en-v1.5"
LLM_MODEL="gpt-4-turbo-preview"

# Reranker Configuration (choose one)
RERANKER_TYPE="Qdrant"  
COHERE_API_KEY="your-cohere-key"
```

**Get Your API Keys:**
- **Required**: OpenRouter: https://openrouter.ai/keys
- **Required**: Qdrant Cloud: https://cloud.qdrant.io
- **Optional**: Cohere (only if using Cohere reranker): https://dashboard.cohere.com/api-keys

**Reranker Options:**
- `cross-encoder` (default): Local model, no API key needed, ~400MB download on first use
- `cohere`: Cloud API, requires API key, faster for large batches
- `none`: Disable reranking

## 2. Running the Backend Server

Once the setup is complete, you can run the FastAPI server.

```bash
python api_server.py
```

The server will start on `http://localhost:8082`.

```
╔════════════════════════════════════════════════════════════════╗
║           SIGGRAPH 2025 RAG API Server                        ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Starting server on http://localhost:8082                      ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

## 3. API Endpoints

This server exposes the following key endpoints for the frontend:

-   `GET /health`: Health check to verify the server is running.
-   `GET /api/info`: Provides information about the API.
-   `GET /api/stream`: The main endpoint for handling RAG queries via Server-Sent Events (SSE).
-   `POST /api/query`: An optional non-streaming endpoint for queries.

API documentation is automatically generated by FastAPI and can be viewed at `http://localhost:8082/docs`.

## 4. Integrating with the Next.js Frontend

For the frontend to communicate with this backend, you must configure its environment.

1.  **Navigate** to the root of the frontend project .
2.  **Create** a file named `.env.local` if it doesn't exist.
3.  **Add** the following line to specify the backend API URL:

    ```
    # week3_assignment/.env.local
    NEXT_PUBLIC_API_URL=http://localhost:8082
    ```

4.  **Run** the frontend development server from the `week3_assignment` directory:

    ```bash
    npm install
    npm run dev
    ```

Now, when you access the frontend at `http://localhost:3000`, it will make API calls to your running backend at `http://localhost:8082`.

## 5. Development and Testing

This project includes a mock RAG implementation (`test_backend_integration.py`) that allows you to test the API integration without needing a fully functional RAG pipeline. The `api_server.py` is currently configured to use this mock.

To implement the actual RAG logic, you will need to:

1.  Create `rag_generate.py` and `retrieval_pipeline.py`.
2.  Update `api_server.py` to import `RAGGenerator` from `rag_generate` instead of `test_backend_integration`.

---

## 6. Building the RAG Pipeline (Student Implementation)

The `api_server.py` is already complete. **Your job is to implement the RAG logic in 3 files.**

---

### 📁 Understanding `chunks.json`

Download `chunks.json` from the Google Drive link. Each chunk contains:
- `chunk_id` - Unique ID (use as vector ID in Qdrant)
- `text` - Content to embed and search
- `title`, `authors`, `pdf_url`, `github_link`, `video_link` - Metadata for citations

---

### 🔧 Files to Implement

Starter files are already created in `backend/` with TODO comments. Open each file and implement the functions:

| File | Purpose |
|------|---------|
| `upload_from_npz.py` | Script to upload embeddings from .npz file to Qdrant cloud |
| `retrieval_pipeline.py` | Hybrid search (semantic + BM25 + reranking) |
| `rag_generate.py` | Generate answers using LLM |

---

### Choose one of the following options:

## STEP 1 a: Upload Pre-computed Embeddings to Qdrant Cloud

We provide pre-computed embeddings using **BAAI/bge-large-en-v1.5** model (1024 dimensions) to avoid rate limiting issues and speed up the process.
drive link: https://drive.google.com/file/d/1kJwXIe5mc-nI_ga-b6KFAW33-MHucSqE/view?usp=drive_link

**File: `backend/upload_from_npz.py`**

This script is **already implemented** - it loads pre-computed embeddings from `embeddings_BAAI_bge_large_en_v1.5.npz` and uploads them to Qdrant Cloud.

**Run once to upload:**
```bash
cd backend
python upload_from_npz.py --recreate
```

This takes ~5 minutes (no API calls for embeddings). The `--recreate` flag deletes any existing collection and starts fresh.

**What it does:**
- Loads 11,008 chunks from `chunks.json`
- Loads pre-computed embeddings from `.npz` file
- Creates Qdrant collection with 1024-dimensional vectors
- Uploads all chunks with embeddings in batches

## Step 1 b: Upload Chunks to Qdrant Cloud by creating embedding using openrouter

Use `upload_to_qdrant.py` to upload chunks to Qdrant Cloud by creating embedding using openrouter BAAI_bge_large_en_v1.5 model. Make sure the embedding model is BAAI_bge_large_en_v1.5.

**Run once to upload:**
```bash
cd backend
python upload_to_qdrant.py --recreate
```
---

## STEP 2: Implement Retrieval Pipeline

**File: `backend/retrieval_pipeline.py`**

Implement these classes/functions:

| Class/Function | What it does |
|----------------|--------------|
| `OpenRouterEmbedder.__init__()` | Store API key, model (`baai/bge-large-en-v1.5`), base URL |
| `OpenRouterEmbedder.embed_query()` | Get embedding for a query via OpenRouter API (must match upload model) |
| `BM25Index.__init__()` | Tokenize chunks and build BM25 index |
| `BM25Index._tokenize()` | Convert text to lowercase word tokens |
| `BM25Index.search()` | Return top-k BM25 matches |
| `RetrievalPipeline.__init__()` | Initialize Qdrant client, embedder, BM25 index |
| `RetrievalPipeline.semantic_search()` | Query Qdrant with embedded query |
| `RetrievalPipeline.bm25_search()` | Run BM25 keyword search |
| `RetrievalPipeline.hybrid_search()` | Combine semantic + BM25 with weighted scores |
| `RetrievalPipeline.rerank()` | (Optional) Rerank using Cohere API |
| `RetrievalPipeline.retrieve()` | Full pipeline → returns `RetrievalResult` list |

**Test:**
```bash
python retrieval_pipeline.py "3D Gaussian Splatting"
```

---

## STEP 3: Implement RAG Generator

**File: `backend/rag_generate.py`**

Implement these methods:

| Method | What it does |
|--------|--------------|
| `RAGGenerator.__init__()` | Initialize config, retrieval pipeline, API key |
| `RAGGenerator.refine_query()` | (Optional) Use LLM to improve search query |
| `RAGGenerator._format_context()` | Format retrieved chunks into context string |
| `RAGGenerator._build_sources_metadata()` | Build unique sources list for citations |
| `RAGGenerator._call_llm()` | Call OpenRouter chat API to generate answer |
| `RAGGenerator.generate()` | Full RAG pipeline → returns answer + sources |

**Test:**
```bash
python rag_generate.py "What is 3D Gaussian Splatting?"
```

---

## STEP 4: Connect to api_server.py

Once everything works, update `api_server.py` to use your implementation:

**Change this line (around line 36):**
```python
from test_backend_integration import RAGGenerator, GenerationConfig, SYSTEM_PROMPT
```

**To:**
```python
from rag_generate import RAGGenerator, GenerationConfig, SYSTEM_PROMPT
```

Then run:
```bash
python api_server.py
```

Test with curl:
```bash
curl -N "http://localhost:8082/api/stream?query=3D%20Gaussian%20Splatting&top_k=5"
```

---

### 📋 Implementation Checklist

**Setup (do once):**
- [ ] Download `chunks.json` from Google Drive
- [ ] Get OpenRouter API key: https://openrouter.ai/keys
- [ ] Create Qdrant Cloud account: https://cloud.qdrant.io
- [ ] Create a Qdrant cluster (free tier is fine)
- [ ] Get Qdrant URL and API key from dashboard
- [ ] (Optional) Get Cohere API key for reranking: https://dashboard.cohere.com

**Step 1 - Upload to Qdrant:**
- [ ] Create `upload_to_qdrant.py`
- [ ] Implement `load_chunks()`
- [ ] Implement `get_embeddings_batch()`
- [ ] Implement `create_qdrant_collection()`
- [ ] Implement `upload_chunks_to_qdrant()`
- [ ] Run the script: `python upload_to_qdrant.py`
- [ ] Verify in Qdrant dashboard that vectors are uploaded

**Step 2 - Retrieval Pipeline:**
- [ ] Create `retrieval_pipeline.py`
- [ ] Implement `OpenRouterEmbedder` class
- [ ] Implement `BM25Index` class
- [ ] Implement `RetrievalPipeline.__init__()`
- [ ] Implement `semantic_search()`
- [ ] Implement `bm25_search()`
- [ ] Implement `hybrid_search()`
- [ ] Implement `rerank()` (optional)
- [ ] Implement `retrieve()`
- [ ] Test: retrieval returns results

**Step 3 - RAG Generator:**
- [ ] Create `rag_generate.py`
- [ ] Implement `RAGGenerator.__init__()`
- [ ] Implement `refine_query()` (optional)
- [ ] Implement `_format_context()`
- [ ] Implement `_build_sources_metadata()`
- [ ] Implement `_call_llm()`
- [ ] Implement `generate()`
- [ ] Test: `python rag_generate.py "test query"`

**Step 4 - Integration:**
- [ ] Update import in `api_server.py`
- [ ] Run `python api_server.py`
- [ ] Test with curl
- [ ] Test with frontend UI

---

### 💡 Tips for Success

1. **Start with Step 1** - You can't do retrieval without vectors in Qdrant
2. **Test each function individually** before moving on
3. **Use print statements** to debug API responses
4. **Check API costs** - OpenRouter shows usage at https://openrouter.ai/activity
5. **Use cheaper models for testing** (`gpt-3.5-turbo` instead of `gpt-4`)
6. **Read error messages carefully** - they usually tell you what's wrong

---

## 7. Deployment Guide

This section covers deploying your full-stack RAG application to production using free hosting platforms.

### Deployment Architecture

- **Frontend**: Deploy to Vercel (free tier)
- **Backend**: Deploy to Render (free tier)
- **Vector Database**: Qdrant Cloud (free tier)
- **APIs**: OpenRouter (pay-as-you-go)

### Prerequisites for Deployment

Before deploying, ensure you have:

1. ✅ Working local development setup
2. ✅ All API keys configured in `.env`
3. ✅ GitHub account for code hosting
4. ✅ Vercel account (sign up at https://vercel.com)
5. ✅ Render account (sign up at https://render.com)

---

### Step 1: Prepare Your Code for Deployment

#### a. Create `.gitignore` File

Create a `.gitignore` file in your project root to exclude sensitive files:

```gitignore
# Dependencies
node_modules/
.next/
venv/
__pycache__/

# Environment variables
.env
.env.local
.env*.local

# Build outputs
/build
/dist
/.next/
/out/

# OS files
.DS_Store
*.log

# IDE
.vscode/
.idea/
```

#### b. Update Backend for Production

Ensure your `api_server.py` reads the port from environment variables (already configured):

```python
# This is already in your api_server.py
port = int(os.getenv("PORT", 8082))
```
---

### Step 2: Push Code to GitHub

1. **Initialize Git Repository**:
   ```bash
   cd /path/to/your/project
   git init
   git add .
   git commit -m "Initial commit: SIGGRAPH RAG application"
   ```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Create a new repository (e.g., `siggraph-rag`)
   - Don't initialize with README (you already have one)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/siggraph-rag.git
   git branch -M main
   git push -u origin main
   ```

---

### Step 3: Deploy Backend to Render

#### a. Create New Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

   - **Name**: `siggraph-rag-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn api_server:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`

#### b. Configure Environment Variables

In the Render dashboard, add these environment variables:

```
OPENROUTER_API_KEY=sk-or-v1-...
QDRANT_URL=https://27fbf31a-e716-4bb7-b37c-1844fc21212e.eu-west-2-0.aws.cloud.qdrant.io:6333
QDRANT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIiwic3ViamVjdCI6ImFwaS1rZXk6NmRkNDNlYjktNWQwZS00MmI0LThlNDktNjU3MGUwYmY4ZTQxIn0.ahoNr4TRjy2VtcsZWUH-L87c0yaf1T9xSn_g53tQKtw
EMBEDDING_MODEL=baai/bge-large-en-v1.5
LLM_MODEL=openai/gpt-4o
```

**Memory Optimization Tips**:
- Use `RERANKER_TYPE=cohere` instead of `cross-encoder` to avoid downloading large models
- If you must use local reranking, use smaller models like `cross-encoder/ms-marco-TinyBERT-L-2-v2`

#### c. Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Your backend will be live at: `https://siggraph-rag-qkdt.onrender.com`

#### d. Verify Deployment

Test your backend:
```bash
curl https://siggraph-rag-qkdt.onrender.com/health
```

Expected response:
```json
{"status":"healthy","rag_initialized":true,"timestamp":1234567890}
```

**Important**: Render's free tier spins down after 15 minutes of inactivity. First request after sleep takes ~30 seconds to wake up.

---

### Step 4: Deploy Frontend to Vercel

#### a. Install Vercel CLI

```bash
npm install -g vercel
```

#### b. Navigate to Frontend Directory

```bash
cd frontend
```

#### c. Configure Environment Variable

Create `.env.production` file:

```bash
NEXT_PUBLIC_API_URL=https://siggraph-rag-qkdt.onrender.com
```

#### d. Deploy to Vercel

```bash
vercel login
vercel --prod
```

Follow the prompts

#### e. Add Environment Variable in Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://siggraph-rag-backend.onrender.com`
   - **Environments**: Production, Preview, Development

5. Redeploy:
   ```bash
   vercel --prod
   ```

Your frontend will be live at: `https://siggraph-czlc0bwja-udayamanojs-projects.vercel.app/`

---

### Step 5: Test Full-Stack Deployment

1. **Open your frontend URL** in a browser: https://siggraph-czlc0bwja-udayamanojs-projects.vercel.app/
2. **Submit a test query**: "What is 3D Gaussian Splatting?"
3. **Verify**:
   - ✅ Connection established
   - ✅ Progress updates appear
   - ✅ Answer streams in real-time
   - ✅ Source papers displayed with links

---

### Troubleshooting Deployment Issues

#### Backend Issues

**Problem**: Backend returns 404
- **Solution**: Check `Start Command` is correct: `uvicorn api_server:app --host 0.0.0.0 --port $PORT`

**Problem**: Backend crashes on startup
- **Solution**: Check logs in Render dashboard, verify all environment variables are set

**Problem**: "No open ports detected"
- **Solution**: Ensure your server binds to `0.0.0.0` and uses `$PORT` environment variable

#### Frontend Issues

**Problem**: "Connection error" in browser
- **Solution**: Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel environment variables

**Problem**: Frontend shows old version
- **Solution**: Clear Vercel cache and redeploy: `vercel --prod --force`

**Problem**: CORS errors
- **Solution**: Verify backend has CORS middleware configured (already in `api_server.py`)

#### General Issues

**Problem**: Slow first request (30+ seconds)
- **Solution**: Normal for Render free tier - backend is waking up from sleep

**Problem**: API costs too high
- **Solution**: Use cheaper models for testing (e.g., `gpt-3.5-turbo` instead of `gpt-4`)

---

### Cost Optimization

#### Free Tier Limits

- **Vercel**: Unlimited deployments, 100GB bandwidth/month
- **Render**: 750 hours/month (enough for one service), spins down after 15min inactivity
- **Qdrant Cloud**: 1GB storage, 1M vectors
- **OpenRouter**: Pay-as-you-go (no free tier)

#### Reducing API Costs

1. **Use cheaper models for development**:
   ```
   LLM_MODEL=gpt-3.5-turbo  # ~$0.001/1K tokens vs $0.01/1K for GPT-4
   # Note: Keep EMBEDDING_MODEL=baai/bge-large-en-v1.5 to match uploaded embeddings
   ```

2. **Reduce retrieval size**:
   ```python
   retrieval_top_k=5  # Instead of 8
   ```

3. **Disable query refinement for testing**:
   ```python
   refine_query=False
   ```

4. **Cache common queries** (advanced):
   - Implement Redis caching for frequent questions

---

### Monitoring and Maintenance

#### Check Backend Logs

Render Dashboard → Your Service → Logs

#### Check Frontend Logs

Vercel Dashboard → Your Project → Deployments → View Logs

#### Monitor API Usage

- OpenRouter: https://openrouter.ai/activity
- Cohere: https://dashboard.cohere.com/billing
- Qdrant: https://cloud.qdrant.io

#### Update Deployment

When you make code changes:

```bash
# Push to GitHub
git add .
git commit -m "Your changes"
git push origin main

# Render will auto-deploy backend
# Redeploy frontend
cd frontend
vercel --prod
```

---

### Production Best Practices

1. **Environment Variables**: Never commit API keys to Git
2. **Error Handling**: Add comprehensive error messages for debugging
3. **Rate Limiting**: Implement rate limiting to prevent API abuse
4. **Monitoring**: Set up uptime monitoring (e.g., UptimeRobot)
5. **Backups**: Regularly backup your Qdrant database
6. **Documentation**: Keep README updated with deployment changes
7. **Testing**: Test on staging environment before production deployment

---

## 8. Project Structure

Your final project structure should look like this:

```
siggraph-rag/
├── backend/
│   ├── api_server.py           # FastAPI server (provided)
│   ├── rag_generate.py         # RAG orchestration (you implement)
│   ├── retrieval_pipeline.py   # Retrieval logic (you implement)
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # Environment variables (not in git)
│   ├── .env.example            # Example env file
│   └── chunks.json             # Paper data
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # Main page
│   │   │   └── layout.tsx      # Root layout
│   │   ├── components/
│   │   │   └── rag/            # RAG UI components
│   │   └── hooks/
│   │       ├── useRAGStream.ts # SSE hook (recommended)
│   │       └── useRAGWebSocket.ts # WebSocket hook
│   ├── package.json
│   ├── .env.local              # Local env (not in git)
│   └── .env.production         # Production env (not in git)
├── .gitignore
└── README.md
```

---

## 9. Additional Resources

### Documentation
- **FastAPI**: https://fastapi.tiangolo.com
- **Next.js**: https://nextjs.org/docs
- **Qdrant**: https://qdrant.tech/documentation
- **OpenRouter**: https://openrouter.ai/docs

### API References
- **OpenAI API**: https://platform.openai.com/docs/api-reference
- **Cohere Rerank**: https://docs.cohere.com/reference/rerank
- **Qdrant Client**: https://qdrant.tech/documentation/interfaces

### Learning Resources
- **RAG Tutorial**: https://www.pinecone.io/learn/retrieval-augmented-generation
- **Vector Search**: https://www.pinecone.io/learn/vector-search
- **Semantic Search**: https://www.sbert.net/examples/applications/semantic-search/README.html

### Community
- **FastAPI Discord**: https://discord.gg/fastapi
- **Next.js Discord**: https://discord.gg/nextjs
- **Qdrant Discord**: https://discord.gg/qdrant

---

## 10. Submission Checklist

Before submitting your project, ensure:

- [ ] Backend runs locally without errors
- [ ] Frontend runs locally and connects to backend
- [ ] All API endpoints return correct responses
- [ ] SSE streaming works properly
- [ ] Source citations appear correctly
- [ ] Code is well-documented with comments
- [ ] Environment variables are documented in `.env.example`
- [ ] `.gitignore` excludes sensitive files
- [ ] README is updated with your implementation notes
- [ ] Backend is deployed to Render (or alternative)
- [ ] Frontend is deployed to Vercel (or alternative)
- [ ] Deployed app is fully functional

---

## 11. Support

If you encounter issues:

1. **Check the logs**: Backend (Render) and Frontend (Vercel) dashboards
2. **Review this README**: Most common issues are covered
3. **Search GitHub Issues**: Check if others had similar problems
4. **Ask for help**: Post in circle or as your TA with:
   - Error message
   - What you tried
   - Relevant code snippets
   - Environment (local/deployed)

---

**Good luck building your RAG application! 🚀**
