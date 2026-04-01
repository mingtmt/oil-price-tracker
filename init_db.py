from backend.database import engine, Base
from backend.models import FuelPrice

print("Đang khởi tạo database...")
Base.metadata.create_all(bind=engine)
print("Đã tạo bảng fuel_prices thành công!")