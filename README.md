# Oil Price Tracker

> A full-stack web application that automatically tracks and visualizes Vietnam's petroleum prices published by [Petrolimex](https://www.petrolimex.com.vn/) — updated twice daily.

---

## Overview

**Oil Price Tracker** is a real-time dashboard that scrapes, stores, and visualizes official petroleum prices from Petrolimex — Vietnam's largest petroleum distributor. Whether you want to monitor fuel costs, analyze historical price trends, or simulate gas station expenses, this app has you covered.

### ✨ Key Features

- 📡 **Automated Price Crawling** — Headless Chrome crawler scrapes Petrolimex's official website and runs automatically at **8:00 AM** and **4:00 PM** daily via APScheduler.
- 📊 **Latest Price Dashboard** — Instantly view the most recent prices for all petroleum products (RON 95, RON 92, DO, HO...) across **Zone 1** and **Zone 2**.
- 📈 **Historical Price Charts** — Interactive line charts powered by Recharts let you explore price fluctuations over time for any fuel product.
- ⛽ **Virtual Gas Station Simulator** — Select a vehicle type and fuel grade to calculate your real refueling cost based on the latest prices.
- 🔄 **Idempotent Data Pipeline** — Upsert logic ensures the database never stores duplicate records; re-running the crawler on the same day safely updates existing entries.

---

## 🏗️ Architecture

```
oil-price-tracker/
├── backend/          # FastAPI REST API (Python)
│   ├── main.py       # API routes & CORS config
│   ├── models.py     # SQLAlchemy ORM (FuelPrice)
│   ├── schemas.py    # Pydantic response schemas
│   └── database.py   # DB engine & session factory
│
├── crawler/          # Data scraping layer (Python)
│   ├── fetcher.py    # Selenium + BeautifulSoup scraper
│   └── scheduler.py  # APScheduler cron jobs
│
├── frontend/         # React dashboard (Vite)
│   └── src/
│       ├── App.jsx
│       ├── components/
│       │   ├── PriceCard.jsx     # Fuel price card (clickable)
│       │   ├── HistoryChart.jsx  # Price history chart
│       │   └── GasStation.jsx    # Refueling cost simulator
│       └── api/axios.js          # HTTP client
│
├── init_db.py        # One-time DB table initializer
└── requirements.txt  # Python dependencies
```

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Ant Design, Recharts, Axios |
| **Backend** | FastAPI, Uvicorn, SQLAlchemy, Pydantic |
| **Database** | PostgreSQL |
| **Crawler** | Selenium (headless Chrome), BeautifulSoup4, APScheduler |

---

## Quick Start

### Prerequisites

- Python ≥ 3.10
- Node.js ≥ 18 & npm ≥ 9
- PostgreSQL (local or cloud, e.g. [Supabase](https://supabase.com/))
- Google Chrome (ChromeDriver is auto-managed)

### 1. Clone & install dependencies

```bash
git clone https://github.com/your-username/oil-price-tracker.git
cd oil-price-tracker

# Python dependencies
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Configure environment variables

```bash
# Project root — PostgreSQL connection
cp .env.example .env
# Edit .env → set DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Frontend — API base URL
cp frontend/.env.example frontend/.env
# Edit frontend/.env → set VITE_API_URL=http://localhost:8000
```

### 3. Initialize the database

```bash
python init_db.py
```

### 4. Run the application

Open **three terminals** from the project root:

```bash
# Terminal 1 — FastAPI backend
uvicorn backend.main:app --reload

# Terminal 2 — Frontend dev server
cd frontend && npm run dev

# Terminal 3 — (Optional) Run crawler once manually
python -m crawler.fetcher
```

| Service | URL |
|---|---|
| Frontend dashboard | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API docs (Swagger) | http://localhost:8000/docs |

---

## Detailed Documentation

- [Backend README](./backend/README.md) — API reference, DB schema, crawler details
- [Frontend README](./frontend/README.md) — Component overview, environment config, available scripts

---

## License

MIT © 2026
