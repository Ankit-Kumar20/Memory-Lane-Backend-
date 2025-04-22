from langchain_community.vectorstores import Cassandra
from langchain_astradb import AstraDBVectorStore
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv
import os
load_dotenv()

embd = OpenAIEmbeddings()

# def create_vector_store(email: str)->Cassandra:
#     astra_vector_store = Cassandra(
#     embedding=embd,
#     table_name=email,
#     keyspace='my_key_space')
#     return astra_vector_store

def create_vector_store(email: str)->AstraDBVectorStore:
    astra_vector_store = AstraDBVectorStore(
    collection_name="astra_vector_langchain",
    embedding=embd,
    api_endpoint=os.getenv('ASTRA_DB_API_ENDPOINT'),
    token=os.getenv('ASTRA_DB_APPLICATION_TOKEN'),
    namespace='my_namespace',
    )
    return astra_vector_store




