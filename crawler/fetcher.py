import logging
import re
from datetime import datetime
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from backend.database import SessionLocal
from backend.models import FuelPrice
from sqlalchemy.orm import Session

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def save_to_db(data_list):
    """
    LOAD: Lưu dữ liệu vào PostgreSQL. 
    Kiểm tra trùng lặp trước khi chèn (Upsert logic).
    """
    db: Session = SessionLocal()
    logging.info(f"Bắt đầu lưu {len(data_list)} bản ghi vào Database...")
    
    try:
        count_added = 0
        count_updated = 0
        
        for item in data_list:
            # Kiểm tra xem sản phẩm này vào ngày này đã tồn tại chưa
            existing_record = db.query(FuelPrice).filter(
                FuelPrice.product_name == item['product_name'],
                FuelPrice.updated_date == item['updated_date']
            ).first()

            if existing_record:
                # Nếu tồn tại rồi, cập nhật giá mới (phòng trường hợp giá đổi trong ngày)
                existing_record.price_v1 = item['price_v1']
                existing_record.price_v2 = item['price_v2']
                count_updated += 1
            else:
                # Nếu chưa có, tạo bản ghi mới
                new_price = FuelPrice(
                    product_name=item['product_name'],
                    price_v1=item['price_v1'],
                    price_v2=item['price_v2'],
                    updated_date=item['updated_date']
                )
                db.add(new_price)
                count_added += 1
        
        db.commit()
        logging.info(f"Hoàn tất: Thêm mới {count_added}, Cập nhật {count_updated}.")
        
    except Exception as e:
        db.rollback()
        logging.error(f"Lỗi khi lưu Database: {e}")
    finally:
        db.close()

def clean_price(price_str):
    if not price_str: return 0
    clean_val = re.sub(r'[^\d]', '', price_str)
    return int(clean_val) if clean_val else 0

def run_crawler():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    
    oil_data = []
    
    try:
        url = "https://www.petrolimex.com.vn/"
        logging.info(f"Đang cào dữ liệu từ {url}...")
        driver.get(url)

        wait = WebDriverWait(driver, 15)
        # Nhắm vào div cha chứa toàn bộ bảng giá
        container = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "menu-mobile__pricePetrol")))
        
        html_content = container.get_attribute('innerHTML')
        soup = BeautifulSoup(html_content, "html.parser")
        
        # 1. Trích xuất ngày cập nhật từ thẻ <p class="f-info">
        info_text = soup.find("p", class_="f-info").get_text()
        date_match = re.search(r'(\d{1,2}/\d{1,2}/\d{4})', info_text)
        update_date_str = date_match.group(1) if date_match else datetime.now().strftime('%d/%m/%Y')
        db_date = datetime.strptime(update_date_str, '%d/%m/%Y').date()

        # 2. Duyệt qua các hàng trong tbody
        rows = soup.select("table tbody tr")
        for row in rows:
            cols = row.find_all("td")
            if len(cols) == 3:
                product_name = cols[0].get_text(strip=True)
                price_v1 = clean_price(cols[1].get_text(strip=True))
                price_v2 = clean_price(cols[2].get_text(strip=True))
                
                oil_data.append({
                    "product_name": product_name,
                    "price_v1": price_v1,
                    "price_v2": price_v2,
                    "updated_date": db_date
                })

        logging.info(f"Đã trích xuất thành công {len(oil_data)} sản phẩm ngày {db_date}.")
        return oil_data

    except Exception as e:
        logging.error(f"Lỗi: {e}")
        return []
    finally:
        driver.quit()

if __name__ == "__main__":
    # 1. EXTRACT & TRANSFORM
    scraped_data = run_crawler()
    
    # 2. LOAD
    if scraped_data:
        save_to_db(scraped_data)
    else:
        logging.warning("Không có dữ liệu để lưu.")