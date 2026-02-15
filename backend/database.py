
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "chalktalk_ai")

client = None
db = None

def get_database():
    global client, db
    if db is None:
        if not MONGO_URI:
            print("WARNING: MONGO_URI not set")
            return None
        client = AsyncIOMotorClient(MONGO_URI)
        db = client[MONGO_DB_NAME]
    return db

async def close_database():
    global client
    if client:
        client.close()
        client = None

# Helpers to convert MongoDB objects to JSON serializable format
def fix_id(doc):
    if doc and "_id" in doc:
        if "id" not in doc:
            doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc
