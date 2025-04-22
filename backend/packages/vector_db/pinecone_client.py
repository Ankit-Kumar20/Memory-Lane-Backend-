from pinecone import Pinecone, ServerlessSpec
from langchain_community.vectorstores import Pinecone as Pine
# from langchian_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings
import requests
import json
from dotenv import load_dotenv
import os
load_dotenv()

embd = OpenAIEmbeddings()

pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'),)
existing_indexes = [index_info["name"] for index_info in pc.list_indexes()]
print(existing_indexes)

def create_index_name(index_name: str):
        ##index_name --> user_id
        pc.create_index(
        name=index_name,
        dimension=1536, # Replace with your model dimensions
        metric="cosine", # Replace with your model metric
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        ))
        print(f"index: {index_name} has been created")

def pinecone_vector_store(index_name: str):

    vector_store = Pine.from_existing_index(
        index_name=index_name,
        embedding=embd,
        # namespace="default"
    )

    return vector_store

# def add_doc_to_pinecone_vector_store(index_name: str, doc: list):
    
#     vector_store = Pine.from_documents(
#         documents=doc,
#         index_name = index_name,
#         embedding = embd,
#         namespace = 'default'
#     )

#     return vector_store

