from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse, StreamingResponse, PlainTextResponse
from prisma import Prisma
from packages.transcription.trans import transcriber, config
from packages.vector_db.pinecone_client import create_index_name, pinecone_vector_store, pc, existing_indexes
from packages.components.embedding_layer import embd
from langchain_core.documents import Document
from packages.components.generator import tags_generator, summary_generator
from packages.components.chapter_llm import vecDB_store_chapter, chapter_timestamp, create_chapter_list
from packages.components.LLM import llm
from packages.AWS_S3.s3_client import folder_exists, add_audio, create_user_folder, retrieve_audio_content
from pydub import AudioSegment
from pydub.utils import which
import io
import time

client = Prisma()

app = FastAPI() 

@app.get('/')
def root():
    return {"message": "hello"}

@app.post('/upload')
async def Upload_audio(user_id : str = Form(...), email: str = Form(...), audio_file: UploadFile = File(...)):
    ## user space created
    index_name = user_id

    if index_name not in existing_indexes:
        create_index_name(index_name)

    file_content = await audio_file.read()
    file_name = audio_file.filename
    print(file_name) 

    ##added --> AWS_S3
    add_audio(email, audio_file_name = file_name, audio_file_content = file_content)

    ##assembly_ai
    s_t = time.time()
    transcript = transcriber.transcribe(file_content, config)
    summary = summary_generator(transcript.text)
    tags = tags_generator(5, summary)
    e_t = time.time()
    print(f'assembly_ai time duration: {e_t - s_t}')
    print(type(transcript.chapters[0]))

    doc = []
    chapter_list = create_chapter_list(transcript.chapters)
    document = Document(page_content=transcript.text,
                        metadata = {
                            'audio_file_name': file_name,
                            'summary': summary,
                            'tags': tags,
                            'chapters': chapter_list
                        })
    
    doc.append(document)

    ##pinecone_vector_store
    vector_store = pinecone_vector_store(index_name)

    vector_store.add_documents(doc)

    return({"message": "uploaded successfully"})


@app.post('/query')
async def query(user_id: str = Form(...), email: str = Form(...), query: str = Form(...)):
    ##pinecone_vector_store
    index_name = user_id
    vector_store = pinecone_vector_store(index_name)
    retrieved_doc = vector_store.similarity_search(query)

    audio_file_name = retrieved_doc[0].metadata['audio_file_name']
    print(type(audio_file_name))
    ##Inmemory_vector_store
    vecDB_store_chapter(retrieved_doc[0].metadata['chapters'])

    start_time, end_time = chapter_timestamp(query)
    query_res_text = llm.invoke(f"Reply in 3 lines. context: {retrieved_doc[0].page_content} . query: {query}")

    ##retrieval_from_AWS_S3
    audio_data = retrieve_audio_content(email, audio_file_name)

    ##audio_analysis
    # AudioSegment.converter = which("ffmpeg")
    # audio = AudioSegment.from_file(io.BytesIO(audio_data))
    # print(io.BytesIO(audio_data))
    # trimmed_audio = audio[start_time: end_time]

    # ##storing at buffer
    # buffer = io.BytesIO()
    # trimmed_audio.export(buffer, format='mp3')
    # buffer.seek(0)

    print(f"start_time: {start_time}, end_time: {end_time}")
    return {PlainTextResponse(query_res_text)}
    # return {"message": "hello", "llm_response": query_res_text}


@app.post('/query-audio-snppiet')
def audio_snippet(email: str = Form(...) ,query: str = Form(...) ):

    ##pinecone_vector_store
    vector_store = pinecone_vector_store(email)
    retrieved_doc = vector_store.similarity_search(query)
    audio_file_name = retrieved_doc[0].metadata['audio_file_name']
    
    print(type(audio_file_name))
    ##Inmemory_vector_store
    vecDB_store_chapter(retrieved_doc[0].metadata['chapters'])
    
    start_time, end_time = chapter_timestamp(query)
    
    audio_data = retrieve_audio_content(email, audio_file_name)

    ##audio_analysis
    AudioSegment.converter = which("ffmpeg")
    audio = AudioSegment.from_file(io.BytesIO(audio_data))
    print(io.BytesIO(audio_data))
    trimmed_audio = audio[start_time: end_time]

    ##storing at buffer
    buffer = io.BytesIO()
    trimmed_audio.export(buffer, format='mp3')
    buffer.seek(0)

    print(f"start_time: {start_time}, end_time: {end_time}")
    return StreamingResponse(buffer, media_type = "audio/mpeg")