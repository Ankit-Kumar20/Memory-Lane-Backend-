from langchain_core.documents import Document
from pydantic import BaseModel
from langchain_core.vectorstores import InMemoryVectorStore
from .embedding_layer import embd
from typing import List, Dict, Any

vector_store_chapter = InMemoryVectorStore(embd)

class chapter_schema(BaseModel):
    summary: str
    gist: str
    headline: str
    start: int
    end: int

# dic = chapter_schema()

def vecDB_store_chapter(arr: list)->None:
    doc = []
    for chapter in arr:
        document = Document(page_content=chapter.headline,
                            metadata = {
                                'start': chapter.start,
                                'end': chapter.end
                            })
        doc.append(document)
    vector_store_chapter.add_documents(doc)


def chapter_timestamp(query: str, vector_store_chapter = vector_store_chapter) -> list:
    res_doc = vector_store_chapter.similarity_search(query)
    time_stamp = [res_doc[0].metadata['start'], res_doc[0].metadata['end']]
    return time_stamp

def delete_vector_store_chapter():
    vector_store_chapter.delete()


        
    

    
        

