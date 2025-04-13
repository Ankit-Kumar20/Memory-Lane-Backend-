from dotenv import load_dotenv
from langchain_openai import OpenAI
import os

load_dotenv()

OpenAI.openai_api_key = os.getenv("OPENAI_API_KEY")