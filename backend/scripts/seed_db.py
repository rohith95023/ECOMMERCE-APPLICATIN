import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME", "pickpack_db")

async def seed_data():
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DB_NAME]

    print("Clearing and re-seeding data for PickPack...")

    await db.categories.delete_many({})
    await db.products.delete_many({})

    now = datetime.utcnow()

    categories = [
        {"name": "Fruits", "icon": "🍎", "color": "#EF4444", "description": "Fresh seasonal fruits", "is_active": True, "sort_order": 1},
        {"name": "Vegetables", "icon": "🥦", "color": "#10B981", "description": "Farm-fresh vegetables", "is_active": True, "sort_order": 2},
        {"name": "Dairy", "icon": "🥛", "color": "#3B82F6", "description": "Premium dairy products", "is_active": True, "sort_order": 3},
        {"name": "Bakery", "icon": "🥐", "color": "#F59E0B", "description": "Freshly baked daily", "is_active": True, "sort_order": 4},
        {"name": "Snacks", "icon": "🍿", "color": "#8B5CF6", "description": "Curated snacks & treats", "is_active": True, "sort_order": 5},
    ]

    cat_results = await db.categories.insert_many(categories)
    cat_ids = list(cat_results.inserted_ids)
    print(f"Inserted {len(cat_ids)} categories.")

    products = [
        # Fruits
        {"name": "Fresh Fuji Apples", "description": "Crisp and sweet Fuji apples from curated orchards.", "price": 180.0, "unit": "1kg", "category_id": str(cat_ids[0]), "image_url": "https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?w=800&q=80", "is_available": True, "created_at": now, "updated_at": now},
        {"name": "Organic Bananas", "description": "Premium ripened bananas, rich in potassium.", "price": 60.0, "unit": "1 Dozen", "category_id": str(cat_ids[0]), "image_url": "https://images.unsplash.com/photo-1603833665858-e81b1c7e6000?w=800&q=80", "is_available": True, "created_at": now, "updated_at": now},
        {"name": "Juicy Oranges", "description": "Vitamin C-rich seasonal oranges, hand-picked.", "price": 120.0, "unit": "1kg", "category_id": str(cat_ids[0]), "image_url": "https://images.unsplash.com/photo-1547514701-42782101795e?w=800&q=80", "is_available": True, "created_at": now, "updated_at": now},
        # Vegetables
        {"name": "Green Bell Peppers", "description": "Crisp and vibrant green capsicum.", "price": 40.0, "unit": "500g", "category_id": str(cat_ids[1]), "image_url": "https://images.unsplash.com/photo-1563513307168-a4262ed67d41?w=800&q=80", "is_available": True, "created_at": now, "updated_at": now},
        {"name": "Baby Spinach", "description": "Tender and washed organic baby spinach leaves.", "price": 55.0, "unit": "200g", "category_id": str(cat_ids[1]), "image_url": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80", "is_available": True, "created_at": now, "updated_at": now},
        {"name": "Cherry Tomatoes", "description": "Vine-ripened sweet cherry tomatoes.", "price": 80.0, "unit": "250g", "category_id": str(cat_ids[1]), "image_url": "https://images.unsplash.com/photo-1546094096-0df4bcaad789?w=800&q=80", "is_available": True, "created_at": now, "updated_at": now},
        # Dairy
        {"name": "Farm Fresh Milk", "description": "Pasteurized cow milk from local farms.", "price": 75.0, "unit": "1L", "category_id": str(cat_ids[2]), "image_url": "https://images.unsplash.com/photo-1563636619-e910ef493994?w=800&q=80", "is_available": True, "created_at": now, "updated_at": now},
        {"name": "Greek Yogurt", "description": "Thick and creamy plain greek yogurt.", "price": 120.0, "unit": "500g", "category_id": str(cat_ids[2]), "image_url": "https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=800&q=80", "is_available": True, "created_at": now, "updated_at": now},
        # Bakery
        {"name": "Butter Croissants", "description": "Flaky, buttery, and fresh-baked every morning.", "price": 95.0, "unit": "2 pcs", "category_id": str(cat_ids[3]), "image_url": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80", "is_available": True, "created_at": now, "updated_at": now},
        {"name": "Sourdough Bread", "description": "Artisan slow-fermented classic sourdough.", "price": 150.0, "unit": "500g", "category_id": str(cat_ids[3]), "image_url": "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=800&q=80", "is_available": True, "created_at": now, "updated_at": now},
        # Snacks
        {"name": "Mixed Nuts Pack", "description": "Premium selection of cashews, almonds & walnuts.", "price": 250.0, "unit": "200g", "category_id": str(cat_ids[4]), "image_url": "https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=800&q=80", "is_available": True, "created_at": now, "updated_at": now},
        {"name": "Dark Chocolate Bar", "description": "70% cocoa, rich and smooth Belgian dark chocolate.", "price": 180.0, "unit": "100g", "category_id": str(cat_ids[4]), "image_url": "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&q=80", "is_available": True, "created_at": now, "updated_at": now},
    ]

    await db.products.insert_many(products)
    print(f"Inserted {len(products)} products.")
    print("Seed complete! All data is ready.")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_data())
