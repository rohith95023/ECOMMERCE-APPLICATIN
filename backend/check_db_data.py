import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def check_data():
    client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
    db = client[os.getenv("DB_NAME", "pickpack_db")]
    
    print("Categories:")
    async for cat in db.categories.find():
        print(cat)
        
    print("\nProducts:")
    async for prod in db.products.find().limit(1):
        print(prod)

if __name__ == "__main__":
    asyncio.run(check_data())
