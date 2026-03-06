import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def test_conn():
    uri = os.getenv("MONGODB_URI")
    print(f"Testing connection to: {uri}")
    try:
        client = AsyncIOMotorClient(uri)
        info = await client.server_info()
        print(f"Server Info: {info}")
        db = client[os.getenv("DB_NAME", "pickpack_db")]
        count = await db.categories.count_documents({})
        print(f"Categories count: {count}")
        user_count = await db.users.count_documents({})
        print(f"Users count: {user_count}")
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_conn())
