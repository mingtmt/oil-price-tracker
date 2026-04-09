# Oil Price Tracker — Frontend

A modern React dashboard for tracking Vietnam petroleum prices (Petrolimex), built with Vite, Tailwind CSS v4, Ant Design, and Recharts.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)

---

## Overview

The frontend provides a real-time dashboard to:

- View **latest petroleum prices** (Vùng 1 & Vùng 2) published by Petrolimex
- Analyze **price history trends** via an interactive line chart
- Simulate a **virtual gas station** — select a vehicle and fuel type to calculate the total refueling cost

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | ^19 | UI framework |
| [Vite](https://vite.dev/) | ^8 | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com/) | ^4 | Utility-first styling (Vite plugin) |
| [Ant Design](https://ant.design/) | ^6 | UI component library (cards, layout, progress) |
| [Recharts](https://recharts.org/) | ^3 | Composable charting library |
| [Axios](https://axios-http.com/) | ^1 | HTTP client |
| [Lucide React](https://lucide.dev/) | ^1 | Icon library |

---

## Project Structure

```
frontend/
├── .env                    # Local environment variables (git-ignored)
├── index.html              # Entry HTML file
├── vite.config.js          # Vite + Tailwind plugin configuration
├── eslint.config.js        # ESLint rules
├── package.json
└── src/
    ├── main.jsx            # React app entry point
    ├── App.jsx             # Root component & data orchestration
    ├── index.css           # Global styles
    ├── api/
    │   └── axios.js        # Axios instance with base URL
    └── components/
        ├── PriceCard.jsx   # Fuel type price card (clickable)
        ├── HistoryChart.jsx # Price history line chart
        └── GasStation.jsx  # Virtual gas station simulator
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A running [backend API](../backend/README.md) at `http://localhost:8000`

### Installation

```bash
cd frontend
npm install
```

### Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:5173** (default Vite port).

---

## Environment Variables

The app reads environment variables via [Vite's `import.meta.env`](https://vite.dev/guide/env-and-mode). Create a `.env` file in the `frontend/` directory by copying the provided example:

```bash
# Run from the frontend/ directory
cp .env.example .env
```

Or create it manually:

```bash
# frontend/.env
VITE_API_URL=http://localhost:8000
```

> [!IMPORTANT]
> All variables exposed to the browser **must** be prefixed with `VITE_`. Variables without this prefix are not accessible in the client-side code.

### Available Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | Base URL of the FastAPI backend |

### How it's used

The value is picked up in [`src/api/axios.js`](src/api/axios.js) with a fallback to `localhost`:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});
```

> [!NOTE]
> `.env` is git-ignored. Commit a `.env.example` file with placeholder values to share the required variables with your team.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite development server with HMR |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint on all source files |
