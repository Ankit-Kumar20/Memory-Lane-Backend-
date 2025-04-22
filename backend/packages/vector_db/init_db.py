import cassio
from dotenv import load_dotenv
import os

load_dotenv()

def init_db():
    try:
        cassio.init(
            database_id=os.environ.get("ASTRA_DB_ID"),
            token=os.environ.get("ASTRA_DB_TOKEN"),
            keyspace=os.environ.get("ASTRA_DB_KEYSPACE")
        )
        print("astra db connected")
    except Exception as err:
        print(err)