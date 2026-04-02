# Sử dụng Python 3.14 bản slim
FROM python:3.14-slim

# Thiết lập thư mục làm việc
WORKDIR /app

# Cài đặt các thư viện cần thiết cho PostgreSQL (psycopg2)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements và cài đặt
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ mã nguồn
COPY . .

# Thiết lập PYTHONPATH để import được thư mục backend
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Port mặc định của FastAPI
EXPOSE 8000

# Lệnh chạy Backend (nhớ dùng 0.0.0.0 để Docker cho phép truy cập từ bên ngoài)
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]