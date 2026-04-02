import logging
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger
from crawler.fetcher import run_crawler, save_to_db

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def job_crawl_petrol():
    logging.info("--- Start automated job ---")
    data = run_crawler()
    if data:
        save_to_db(data)
        logging.info("--- Job completed successfully: Data available ---")
    else:
        logging.error("--- Job failed: No data available ---")

if __name__ == "__main__":
    scheduler = BlockingScheduler()
    
    # Morning job (8:00 AM)
    scheduler.add_job(
        job_crawl_petrol, 
        trigger=CronTrigger(hour=8, minute=0),
        misfire_grace_time=3600,
        id='morning_crawl',
        name='Crawling oil prices in the morning'
    )

    # Afternoon job (4:00 PM)
    scheduler.add_job(
        job_crawl_petrol, 
        trigger=CronTrigger(hour=16, minute=0),
        misfire_grace_time=3600,
        id='afternoon_crawl',
        name='Crawling oil prices in the afternoon'
    )

    logging.info("Scheduler started, waiting for jobs...")
    try:
        scheduler.start()
    except (KeyboardInterrupt, SystemExit):
        pass