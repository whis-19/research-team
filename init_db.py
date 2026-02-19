from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "research_survey")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "responses")

def init_db():
    try:
        print(f"Connecting to MongoDB at {MONGO_URI}...")
        # Added tlsAllowInvalidCertificates=True to bypass SSL errors for local dev
        client = MongoClient(MONGO_URI, tlsAllowInvalidCertificates=True)
        
        # Check if database exists (by checking if it's in the list of database names)
        # Note: MongoDB creates databases lazily, so it might not show up until we insert data.
        # But we can try to access it.
        db = client[DB_NAME]
        
        # Create collection if it doesn't exist (also lazy)
        # We can create an index to ensure it initializes and to improve performance
        collection = db[COLLECTION_NAME]
        
        print(f"Accessing database: '{DB_NAME}', collection: '{COLLECTION_NAME}'")
        
        # Create an index on 'submitted_at' for sorting/querying by time
        print("Creating index on 'submitted_at'...")
        collection.create_index("submitted_at")
        
        # Basic connectivity check
        print("Server info:", client.server_info())
        print("Database initialization complete. Connection successful.")
        
    except Exception as e:
        print(f"Failed to initialize database: {e}")

if __name__ == "__main__":
    init_db()
