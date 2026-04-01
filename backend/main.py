from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, database

# Khởi tạo App
app = FastAPI(title="Oil Price Tracker API")

# CẤU HÌNH CORS (Rất quan trọng để React gọi được API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Trong thực tế nên giới hạn domain của React
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency để lấy DB Session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to Oil Price Tracker API"}

# API 1: Lấy giá mới nhất (Dashboard Overview)
@app.get("/prices/latest", response_model=List[schemas.FuelPrice])
def get_latest_prices(db: Session = Depends(get_db)):
    # Tìm ngày cập nhật mới nhất có trong DB
    latest_date = db.query(models.FuelPrice.updated_date).order_by(models.FuelPrice.updated_date.desc()).first()
    
    if not latest_date:
        return []
        
    return db.query(models.FuelPrice).filter(models.FuelPrice.updated_date == latest_date[0]).all()

# API 2: Lấy lịch sử giá của 1 sản phẩm (Chart Data)
@app.get("/prices/history/{product_name}", response_model=List[schemas.FuelPrice])
def get_price_history(product_name: str, db: Session = Depends(get_db)):
    prices = db.query(models.FuelPrice).filter(
        models.FuelPrice.product_name.ilike(f"%{product_name}%")
    ).order_by(models.FuelPrice.updated_date.asc()).all()
    
    if not prices:
        raise HTTPException(status_code=404, detail="Product not found")
    return prices