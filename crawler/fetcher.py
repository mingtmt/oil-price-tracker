import logging
import os
import re
from dotenv import load_dotenv
from datetime import datetime
from typing import List, Dict, Any
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

load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def save_to_db(data_list: List[Dict[str, Any]]) -> None:
    """
    Save data to database.

    Input: List of dictionaries containing data to be saved.
    """

    db: Session = SessionLocal()
    logging.info(f"Saving {len(data_list)} records to Database...")

    try:
        # Initialize counters
        count_added = 0
        count_updated = 0
        
        # Iterate over the data list
        for item in data_list:
            # Check if the record already exists
            existing_record = db.query(FuelPrice).filter(
                FuelPrice.product_name == item['product_name'],
                FuelPrice.updated_date == item['updated_date']
            ).first()

            if existing_record:
                # If record exists, update new price
                existing_record.price_v1 = item['price_v1']
                existing_record.price_v2 = item['price_v2']
                count_updated += 1
            else:
                # If record doesn't exist, create a new record
                new_price = FuelPrice(
                    product_name=item['product_name'],
                    price_v1=item['price_v1'],
                    price_v2=item['price_v2'],
                    updated_date=item['updated_date']
                )
                db.add(new_price)
                count_added += 1

        # Commit the changes
        db.commit()
        logging.info(f"Completed: Added {count_added}, Updated {count_updated}.")

    except Exception as e:
        # Rollback the changes if an error occurs
        db.rollback()
        logging.error(f"Error saving data to Database: {e}")

    finally:
        # Close the database session
        db.close()

def clean_price(price_str: str) -> int:
    """
    Clean price string crawled from website.

    Input: Price string.
    Return: Cleaned price as integer.
    """
    # Check if the price string is empty
    if not price_str: 
        return 0
    
    # Remove all non-digit characters
    clean_val = re.sub(r'[^\d]', '', price_str)
    
    # Return the cleaned value as integer if it is not empty
    return int(clean_val) if clean_val else 0

def run_crawler():
    """
    Crawl data from the website and save it to the database.

    The function uses selenium to open the website in headless mode,
    and then uses BeautifulSoup to extract the data from the webpage.

    The data is then cleaned and saved to the database.

    Returns:
        A list of dictionaries containing the data.
    """
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    driver_path = os.getenv("CHROMEDRIVER_BIN")
    
    if driver_path and os.path.exists(driver_path):
        service = Service(driver_path)
    else:
        from webdriver_manager.chrome import ChromeDriverManager
        service = Service(ChromeDriverManager().install())
        
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    oil_data = []
    
    try:
        url = "https://www.petrolimex.com.vn/"
        logging.info(f"Crawling data from {url}...")
        driver.get(url)

        wait = WebDriverWait(driver, 15)
        # Select the container that holds the price information
        container = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "header__pricePetrol")))
        
        html_content = container.get_attribute('innerHTML')
        soup = BeautifulSoup(html_content, "html.parser")
        
        # Get the update date from the info text
        info_text = soup.find("p", class_="f-info").get_text()
        date_match = re.search(r'(\d{1,2}/\d{1,2}/\d{4})', info_text)
        update_date_str = date_match.group(1) if date_match else datetime.now().strftime('%d/%m/%Y')
        db_date = datetime.strptime(update_date_str, '%d/%m/%Y').date()

        # Extract rows data from the table
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

        logging.info(f"Extracted {len(oil_data)} products for date {db_date}.")
        return oil_data

    except Exception as e:
        logging.error(f"Error crawling data: {e}")
        return []
    finally:
        driver.quit()

if __name__ == "__main__":
    # Extract and transform data from the website
    scraped_data = run_crawler()
    
    # Save the cleaned data to the database
    if scraped_data:
        save_to_db(scraped_data)
    else:
        logging.warning("No data to save.")