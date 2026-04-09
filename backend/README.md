# Oil Price Tracker — Backend

A FastAPI backend that serves petroleum price data scraped from [Petrolimex](https://www.petrolimex.com.vn/), stored in a PostgreSQL database, with an automated crawler and scheduler.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [API Reference](#api-reference)
- [Crawler](#crawler)
- [Scheduler](#scheduler)
- [Running Everything](#running-everything)

---

## Overview

The backend consists of three main parts:

1. **FastAPI server** — Exposes REST endpoints for the frontend to consume
2. **Crawler** (`crawler/fetcher.py`) — Scrapes Petrolimex's official website using Selenium + BeautifulSoup

Data is stored in a PostgreSQL database with an idempotency constraint — each `(product_name, updated_date)` pair is unique, preventing duplicate records.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [FastAPI](https://fastapi.tiangolo.com/) | REST API framework |
| [Uvicorn](https://www.uvicorn.org/) | ASGI server |
| [SQLAlchemy](https://www.sqlalchemy.org/) | ORM & database engine |
| [PostgreSQL](https://www.postgresql.org/) | Relational database |
| [psycopg2](https://www.psycopg.org/) | PostgreSQL driver |
| [Pydantic](https://docs.pydantic.dev/) | Request/response schema validation |
| [Selenium](https://www.selenium.dev/) | Headless browser for crawling |
| [BeautifulSoup4](https://www.crummy.com/software/BeautifulSoup/) | HTML parsing |
| [python-dotenv](https://pypi.org/project/python-dotenv/) | Environment variable loading |

---

## Project Structure

```
oil-price-tracker/        ← project root
├── requirements.txt      # Python dependencies
├── init_db.py            # Script to initialize database tables
├── .env                  # Local environment variables (git-ignored)
│
├── backend/              # FastAPI application
│   ├── main.py           # App entry point, routes, CORS config
│   ├── models.py         # SQLAlchemy ORM model (FuelPrice)
│   ├── schemas.py        # Pydantic response schemas
│   └── database.py       # DB engine, session factory, Base
│
└── crawler/              # Data scraping layer
    ├── fetcher.py        # Selenium + BS4 scraper, DB writer
    └── scheduler.py      # APScheduler cron jobs (8 AM & 4 PM)
```

---

## Getting Started

### Prerequisites

- **Python** ≥ 3.10
- **PostgreSQL** (local or hosted, e.g. [Supabase](https://supabase.com/))
- **Google Chrome** + matching ChromeDriver (auto-managed by `webdriver-manager`)

### Installation

All commands are run from the **project root** (`oil-price-tracker/`).

```bash
# 1. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate      # macOS / Linux
# venv\Scripts\activate       # Windows

# 2. Install all dependencies
pip install -r requirements.txt

# 3. Copy and configure environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL
```

---

## Environment Variables

Create a `.env` file in the **project root** (not inside `backend/`):

```bash
# .env

# PostgreSQL connection string
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/mydb
```

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | ✅ Yes | `postgresql:///./test.db` | PostgreSQL connection string |

> [!IMPORTANT]
> The `DATABASE_URL` must start with `postgresql://` (not `sqlite://`). SQLite is **not** supported due to the `pool_size` configuration in `database.py`.

---

## Database

### Initialize Tables

Run this once before starting the server to create the `fuel_prices` table:

```bash
python init_db.py
```

Expected output:
```
Đang khởi tạo database...
Đã tạo bảng fuel_prices thành công!
```

### Schema — `fuel_prices` table

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `INTEGER` | PK, auto-increment | Record ID |
| `product_name` | `VARCHAR(100)` | NOT NULL | Fuel product name (e.g. `RON 95-III`) |
| `price_v1` | `INTEGER` | NOT NULL | Price for Zone 1 (VND/litre) |
| `price_v2` | `INTEGER` | NOT NULL | Price for Zone 2 (VND/litre) |
| `updated_date` | `DATE` | NOT NULL | Official Petrolimex price date |
| `created_at` | `DATETIME` | DEFAULT now() | Timestamp when the record was crawled |

> [!NOTE]
> A unique constraint on `(product_name, updated_date)` ensures idempotency — re-running the crawler on the same day will **update** the existing record rather than creating a duplicate.

---

## API Reference

Start the development server:

```bash
uvicorn backend.main:app --reload
```

The API will be available at **http://localhost:8000**.

Interactive docs (Swagger UI): **http://localhost:8000/docs**

---

### `GET /`

Health check endpoint.

**Response:**
```json
{ "message": "Welcome to Oil Price Tracker API" }
```

---

### `GET /prices/latest`

Returns the latest price for **all fuel products** (most recent `updated_date` in the database).

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "product_name": "RON 95-III",
    "price_v1": 21500,
    "price_v2": 21440,
    "updated_date": "2026-04-09",
    "created_at": "2026-04-09T08:05:12.123456"
  }
]
```

---

### `GET /prices/history/{product_name}`

Returns the **full price history** for a given fuel product, ordered by date ascending.

**Path parameter:** `product_name` — partial match, case-insensitive (e.g. `RON 95`)

**Response:** `200 OK` — same schema as `/prices/latest`, multiple records

**Error:** `404 Not Found` if no records match the product name.

---

### CORS

The API allows requests from the frontend dev server:

```python
allow_origins=["http://localhost:5173"]
```

Update this in `backend/main.py` when deploying to production.

---

## Crawler

The crawler (`crawler/fetcher.py`) scrapes the Petrolimex homepage using a **headless Chrome** browser.

### How it works

1. Opens `https://www.petrolimex.com.vn/` in headless Chrome
2. Waits for the `.header__pricePetrol` container to load
3. Parses the price table with BeautifulSoup — extracts `product_name`, `price_v1`, `price_v2`, and `updated_date`
4. Cleans price strings (removes formatting characters, returns integer VND value)
5. Saves to the database — **upserts** by `(product_name, updated_date)`

### Run manually

```bash
python -m crawler.fetcher
```

---

## Running Everything

In **three separate terminals** from the project root:

```bash
# Terminal 1 — FastAPI server
uvicorn backend.main:app --reload

# Terminal 2 - (Optional) Run crawler once manually
python -m crawler.fetcher
```
