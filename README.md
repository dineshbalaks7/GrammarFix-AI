# GrammarFix AI

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=28&duration=3000&pause=1000&color=36BCF7&center=true&vCenter=true&width=850&lines=GrammarFix+AI;Write+with+Confidence.;Correct+Grammar+Instantly.;Make+Every+Word+Count." alt="GrammarFix AI" />
</p>

<p align="center">
  An intelligent AI-powered grammar correction platform that transforms your writing into clear, natural, and grammatically correct English.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/AI-Powered-blueviolet?style=flat-square" />
  <img src="https://img.shields.io/badge/Python-Backend-3776AB?style=flat-square&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square" />
</p>

---

## Overview

**GrammarFix AI** is a modern web application designed to make English writing more accurate, natural, and professional.

Powered by an AI-based language processing system, it analyzes user input, identifies grammatical errors, and generates corrected text while preserving the original meaning and context.

Whether you are writing emails, academic content, professional messages, or everyday conversations, GrammarFix AI helps you communicate more effectively.

<p align="center">
  <b>Write Better. Communicate Better.</b>
</p>

---

## Live Application

<p align="center">
  <a href="https://grammarfix-seven.vercel.app/">
    <img src="https://img.shields.io/badge/OPEN%20GRAMMARFIX%20AI-Visit%20Application-2563EB?style=for-the-badge&logo=vercel&logoColor=white" />
  </a>
</p>

**Frontend:** https://grammarfix-seven.vercel.app/

**Backend API:** https://grammarfix-api.onrender.com/

**API Documentation:** https://grammarfix-api.onrender.com/docs

---

## Features

<table>
  <tr>
    <td width="50%">
      <h3>Grammar Correction</h3>
      Automatically detects and corrects grammatical mistakes in your writing.
    </td>
    <td width="50%">
      <h3>Context Preservation</h3>
      Maintains the original meaning and intent while improving sentence structure.
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>Multiple Writing Modes</h3>
      Choose between Correct, Professional, and Clear writing modes.
    </td>
    <td width="50%">
      <h3>Spelling and Punctuation</h3>
      Improves spelling, punctuation, and incorrect word usage.
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>Correction Explanations</h3>
      Understand identified mistakes and the corrections made.
    </td>
    <td width="50%">
      <h3>Responsive Interface</h3>
      Enjoy a clean and accessible experience across desktop and mobile devices.
    </td>
  </tr>
</table>

---

## How It Works

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=19&pause=1500&color=16A34A&center=true&vCenter=true&width=700&lines=Enter+your+text;Choose+your+writing+mode;AI+analyzes+your+sentence;Get+corrected+results" alt="How GrammarFix AI works" />
</p>

```text
          USER INPUT
               |
               v
       React + Vite Frontend
               |
               v
          FastAPI Backend
               |
               v
       AI Grammar Processing
               |
               v
       Correction Generation
               |
               v
        Structured Response
               |
               v
       Corrected User Output
```

### Processing Workflow

1. The user enters text into the application.
2. The selected writing mode is included in the request.
3. The frontend sends the request to the FastAPI backend.
4. The AI processing service analyzes and corrects the text.
5. The backend returns the correction results.
6. The frontend displays corrected text and available explanations.

---

## Writing Modes

| Mode | Description |
|---|---|
| Correct | Fixes grammar, spelling, and punctuation while preserving the original writing style. |
| Professional | Improves grammar and makes the writing suitable for professional communication. |
| Clear | Improves readability using natural and simple sentence structures. |

---

## Technology Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=python,fastapi,react,vite,js,html,css,git,github,vercel" alt="Technology Stack" />
</p>

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript, CSS |
| Backend | Python, FastAPI |
| AI Processing | Language Model Inference |
| Data Validation | Pydantic |
| API Communication | REST API |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |
| Version Control | Git, GitHub |

---

## Project Structure

```text
GrammarFix-AI/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── schemas.py
│   │   │
│   │   ├── services/
│   │   │   └── grammar_service.py
│   │   │
│   │   └── utils/
│   │       └── error_handler.py
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## Getting Started

Follow these steps to run GrammarFix AI locally.

### Prerequisites

- Python 3.10+
- Node.js
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/GrammarFix-AI.git

cd GrammarFix-AI
```

### 2. Backend Setup

```bash
cd backend

python -m venv venv
```

Activate the virtual environment on Windows:

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file inside the backend directory.

Add the environment variables required by your configured AI service.

Example:

```env
GEMINI_API_KEY=your_api_key
GEMINI_MODEL=your_configured_model
```

Keep your API credentials private. Never commit `.env` files to GitHub.

### 4. Start the Backend

```bash
uvicorn app.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### 5. Frontend Setup

Open another terminal:

```bash
cd frontend

npm install

npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## API Documentation

GrammarFix AI exposes REST API endpoints through FastAPI.

### Available Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API welcome message |
| GET | `/health` | Check backend health |
| POST | `/correct` | Process grammar correction |

### Grammar Correction Request

**Endpoint:**

```http
POST /correct
```

**Request Body:**

```json
{
  "text": "I doesn't like the weather.",
  "mode": "correct"
}
```

**Response:**

```json
{
  "corrected_text": "I don't like the weather.",
  "mistakes": [
    {
      "original": "doesn't",
      "corrected": "don't",
      "explanation": "The subject 'I' requires 'don't' rather than 'doesn't'."
    }
  ]
}
```

---

## Deployment

### Frontend – Vercel

The React application is deployed using Vercel.

Deployment configuration:

- Framework: Vite
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

### Backend – Render

The FastAPI application is deployed using Render.

Deployment configuration:

- Runtime: Python
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Configure the required backend environment variables in Render.

---

## Future Improvements

- Enhanced contextual grammar correction.
- More advanced writing assistance.
- Detailed mistake highlighting.
- Improved correction accuracy.
- Support for longer documents.
- Performance optimization.
- Additional writing styles.
- Improved user experience.

---

## Developer

<p align="center">
  <b>Dinesh Bala KS</b><br/>
  B.Tech – Artificial Intelligence and Data Science
</p>

<p align="center">
  <a href="https://github.com/YOUR_USERNAME">GitHub</a> |
  <a href="https://www.linkedin.com/in/dinesh-bala-ks-1a077a292/">LinkedIn</a>
</p>

---

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=22&duration=3500&pause=1000&color=36BCF7&center=true&vCenter=true&width=650&lines=GrammarFix+AI;Write+Better.+Communicate+Better." alt="GrammarFix AI Footer" />
</p>

<p align="center">
  <sub>Built with Python, React, FastAPI and Artificial Intelligence.</sub>
</p>
