# Final Project in Afeka College

#  StartupCoach

StartupCoach is an AI-powered startup advisory platform that combines:

- Retrieval-Augmented Generation (RAG)
- Machine Learning startup success prediction
- Supabase prediction history storage
- OpenAI-powered startup mentoring

The goal is to help early-stage founders validate ideas, make better business decisions, and receive practical guidance based on startup best practices.

---

## Features

###  AI Startup Coach

Ask startup-related questions and receive practical guidance powered by:

- OpenAI GPT
- Custom startup knowledge base
- Retrieval-Augmented Generation (RAG)

Examples:

- Customer validation
- Product-market fit
- Pricing
- MVP development
- Founder decision making

---

###  Startup Success Prediction

Predict the probability of startup success using a machine learning model trained on Crunchbase startup funding data.

Input features include:

- Funding amount
- Funding rounds
- Founded year
- Market sector
- Country
- Investment types

Output:

- Success probability
- Predicted outcome (Success / Failure)

---

###  Prediction History

All predictions are stored in Supabase and can be:

- Viewed
- Reviewed
- Deleted

This allows founders to track previous startup evaluations.

---

## Technology Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS

### Backend

- FastAPI
- Python

### AI Layer

- OpenAI GPT-4.1 Mini
- RAG Pipeline
- Sentence Transformers
- Multilingual E5 Embeddings

### Database

- Supabase

### Machine Learning

- Scikit-Learn
- Random Forest Classifier
- Crunchbase Startup Dataset

---

## Project Architecture

Frontend (Next.js)
↓
FastAPI Backend
↓
├── Startup Prediction Model
├── RAG Knowledge Retrieval
├── OpenAI Coaching Engine
└── Supabase History Storage

---

## Running the Project

### Backend

```bash
cd backend
uvicorn main:app --reload
```

Backend:

```
http://127.0.0.1:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```
http://localhost:3000
```

---

## Environment Variables

Create a `.env` file:

```env
OPENAI_API_KEY=your_key_here

SUPABASE_URL=your_url_here
SUPABASE_KEY=your_key_here
```

---

## Future Improvements

- Multi-user authentication
- Founder profiles
- Startup-specific memory
- Improved prediction models
- Dashboard analytics
- Hebrew startup knowledge base expansion

---

## Author

Nadav Daniel

Final B.Sc. Project – Computer Science

2026