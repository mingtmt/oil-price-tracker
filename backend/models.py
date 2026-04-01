from sqlalchemy import Column, Integer, String, Date, DateTime
from datetime import datetime
from .database import Base

class FuelPrice(Base):
    __tablename__ = "fuel_prices"

    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String(100), nullable=False)
    price_v1 = Column(Integer, nullable=False)
    price_v2 = Column(Integer, nullable=False)
    # Ngày niêm yết của Petrolimex
    updated_date = Column(Date, nullable=False)
    # Thời điểm cào dữ liệu
    created_at = Column(DateTime, default=datetime.now)

    # Ràng buộc: Một sản phẩm trong một ngày chỉ có một bản ghi duy nhất
    # Điều này cực kỳ quan trọng để tránh trùng lặp dữ liệu (Idempotency)
    __table_args__ = (
        {"sqlite_autoincrement": True}, # Nếu dùng sqlite
    )