from pydantic import BaseModel
from datetime import date, datetime
from typing import List

class FuelPriceBase(BaseModel):
    product_name: str
    price_v1: int
    price_v2: int
    updated_date: date

class FuelPrice(FuelPriceBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True # Cho phép Pydantic làm việc với SQLAlchemy models