import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME", "pickpack_db")

async def init_db():
    print(f"Connecting to {DB_NAME}...")
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DB_NAME]
    
    # Create Indexes
    await db.users.create_index("email", unique=True)
    await db.categories.create_index("name", unique=True)
    await db.products.create_index("name")
    await db.orders.create_index("order_number", unique=True)
    await db.orders.create_index("customer_id")
    
    # Initial data (optional)
    categories = [
        {"name": "Fruits", "is_active": True, "sort_order": 1, "icon": "🍎", "color": "#FFC107"},
        {"name": "Vegetables", "is_active": True, "sort_order": 2, "icon": "🥬", "color": "#4CAF50"},
        {"name": "Dairy", "is_active": True, "sort_order": 3, "icon": "🥛", "color": "#2196F3"}
    ]
    
    for cat in categories:
        await db.categories.update_one({"name": cat["name"]}, {"$set": cat}, upsert=True)
        
    print("Database initialized successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(init_db())
