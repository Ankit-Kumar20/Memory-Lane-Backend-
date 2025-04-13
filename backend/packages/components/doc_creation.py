from langchain_core.documents import Document
from langchain_core.vectorstores import InMemoryVectorStore
from .embedding_layer import embd
from .LLM import llm
from .generator import tags_generator, summary_generator
### needs DB schema

vector_store = InMemoryVectorStore(embd)

def create_document(audio_id: int ,transcript: str) -> Document:
    summary = summary_generator(transcript)
    tags = tags_generator(5, summary)
    doc = Document(page_content=transcript,
                   meta_data={
                       'summary': summary,
                       'tags': tags,
                       'audio_id': audio_id
                   })
    
    return doc

