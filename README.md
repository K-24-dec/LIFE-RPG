# 🚀 GatiAI – Multi-Modal AI Infrastructure Planning Platform

[![Live Application](https://img.shields.io/badge/Live%20Demo-gati--karthikk2.vercel.app-emerald?style=for-the-badge&logo=vercel)](https://gati-karthikk2.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Gemini AI](https://img.shields.io/badge/Powered%20By-Google%20Gemini%203.6%20Flash-8E75B2?style=for-the-badge&logo=google)](https://ai.google.dev/)

> **GatiAI** is an advanced multi-modal AI infrastructure planning platform inspired by India's **PM Gati Shakti National Master Plan**. It empowers urban planners, GIS engineers, and government departments to generate optimal transport corridors, analyze sub-surface utilities, evaluate environmental impact, and streamline inter-departmental clearances.

🌐 **Public Live Access Link:** [https://gati-karthikk2.vercel.app](https://gati-karthikk2.vercel.app)

---

## ✨ Key Features & Capabilities

- 🌐 **Public Live Web Application**: Hosted on Vercel with zero-configuration public access for all stakeholders.
- 🗺️ **2D Interactive GIS Map Planner**: Built with Leaflet to visualize corridor alignments, interactive waypoints, terrain difficulty scores, and ecological risk layers.
- 🏔️ **3D Terrain & Elevation Visualizer**: Powered by Three.js for interactive 3D spatial terrain inspection and vertical elevation profiles.
- 🕳️ **Underground Utility Intelligence**: Sub-surface mapping for detecting conflicts with underground pipelines, fiber optics, metro tunnels, and power grids.
- 🤖 **Gemini AI Master Planner**: Powered by `gemini-3.6-flash` via `@google/genai` for multi-criteria route optimization, decision summaries, and inter-departmental action checklists.
- 🏢 **Multi-Department Collaboration Portal**: Dedicated portal supporting unified coordination across **MoRTH**, **Indian Railways**, **MoEFCC**, **Inland Waterways Authority**, and **State Land Authorities**.
- 📄 **Automated DPR & PDF Exporter**: Instant executive project report generation (Detailed Project Report) with payback ROI analytics and export capabilities via `jspdf`.

---

## 🏗️ System Architecture

```
                                 ┌─────────────────────────────────┐
                                 │       React 19 + Vite Frontend │
                                 │   (TailwindCSS v4, Lucide, UI)  │
                                 └────────────────┬────────────────┘
                                                  │
                 ┌────────────────────────────────┼────────────────────────────────┐
                 │                                │                                │
┌────────────────┴───────────────┐ ┌──────────────┴───────────────┐ ┌──────────────┴───────────────┐
│     Leaflet 2D GIS Planner     │ │   Three.js 3D Terrain Engine │ │   Underground Intelligence   │
└────────────────────────────────┘ └───────────────────────────────┘ └───────────────────────────────┘
                                                  │
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │   Express.js API Backend        │
                                 │   (Dynamic Route & Risk Engine) │
                                 └────────────────┬────────────────┘
                                                  │
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │    Google Gemini 3.6 Flash     │
                                 │  (@google/genai Multi-Modal AI) │
                                 └─────────────────────────────────┘
```

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm** or **bun**

### 1. Clone the Repository
```bash
git clone https://github.com/K-24-dec/-gati.git
cd -gati
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables *(Optional for Gemini AI)*
Create a `.env` file in the project root:
```env
GEMINI_API_KEY=your_google_gemini_api_key
```
*(Note: If `GEMINI_API_KEY` is not provided, GatiAI uses intelligent built-in fallback analytics).*

### 4. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

---

## 📦 Scripts Overview

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Express server with Vite dev middleware on port 3000 |
| `npm run build` | Builds client static assets and bundles `server.ts` for production |
| `npm run start` | Serves the production bundle |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |

---

## 🌍 Public Live Access

The application is deployed publicly and accessible globally at:
🔗 **[https://gati-karthikk2.vercel.app](https://gati-karthikk2.vercel.app)**

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
