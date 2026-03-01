# 🛡️ Overwatch AI

**Overwatch AI** is a high-performance command center designed to intercept and expose AI-powered scams. Built with **Next.js 14**, it leverages Google’s **Gemini 2.5 Flash** multimodal models to provide real-time threat intelligence through a cinematic, futuristic interface.

---

## ✨ Core Features

### 🔍 Multimodal Threat Detection
* **Audio (Voice Notes):** Analyzes voice for AI synthesis artifacts, robotic formants, and classic scam scripts (e.g., fake emergencies).
* **Images (Screenshots):** Scans for phishing indicators, spoofed logos, and suspicious URLs.
* **Text/URLs:** Detects social engineering language, urgency tactics, and known scam patterns.

### ⚡ Cinematic Dashboard Interface
Built with **React**, **Tailwind CSS**, and **Framer Motion**, the UI features:
* **Futuristic Architecture:** Glassmorphism, responsive layouts, and glowing accents (`overwatch-green`, `overwatch-blue`, `overwatch-red`, `overwatch-amber`).
* **Dynamic State Machine:**
    * **Idle:** Initial dropzone and file selection.
    * **Scanning:** Real-time radar pulses and an active analyzing ticker.
    * **Verdict:** Detailed data visualization of the final security report.

### 🤖 Advanced AI Integration
* Powered by `gemini-2.5-flash` via the `@google/generative-ai` SDK.
* **Structured Intelligence:** Strict JSON schema enforcement ensures the app receives precise data:
    * Threat Level & Authenticity Score
    * Manipulation Tactics & Credibility Ratings
    * Comprehensive Analysis Report

---

## 🏗️ Application Architecture

### Frontend (`app/page.tsx`)
The primary client-side interface (`OverwatchApp`) encapsulates the UI state:
* **IdleView:** The entry point for file/text input.
* **ScanningView:** An immersive animation sequence simulating a deep security sweep.
* **VerdictView:** The final dashboard displaying the AI's findings.

### Backend (`app/api/scan/route.ts`)
A Next.js serverless API route that:
1.  Receives file and text payloads.
2.  Constructs dynamic system prompts based on media type.
3.  Securely interfaces with the Gemini API.
4.  Returns a parsed JSON report to the client.

### Global Styles (`app/globals.css`)
Contains the dark-mode aesthetic and custom CSS animations, including the signature "scanning sweep" effect.

---

## 🚀 Getting Started

### 1. Installation
```bash
git clone [https://github.com/your-username/overwatch-ai.git](https://github.com/your-username/overwatch-ai.git)
cd overwatch-ai
npm install
