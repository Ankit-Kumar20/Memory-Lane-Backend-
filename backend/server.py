from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse, StreamingResponse
from prisma import Prisma
from packages.transcription.trans import transcriber, config
from langchain_core.vectorstores import InMemoryVectorStore
from packages.components.embedding_layer import embd
from langchain_core.documents import Document
from packages.components.generator import tags_generator, summary_generator
from packages.components.chapter_llm import vecDB_store_chapter, chapter_timestamp
from packages.components.LLM import llm
from packages.AWS_S3.s3_client import folder_exists, add_audio, create_user_folder, retrieve_audio_content
from pydub import AudioSegment
from pydub.utils import which
import io

client = Prisma()

vector_store = InMemoryVectorStore(embd)

app = FastAPI()

# @app.on_event('startup')
# async def starting():
#     # try:
#     #     await client.connect()
#     # except Exception as err:
#     #     print(err)

@app.get('/')
def root():
    return {"message": "hello"}

## making of embeddings
@app.post('/upload')
async def Upload_audio(email : str = Form(...), audio_id: int = Form(...), audio_file: UploadFile = File(...)):
    ## user space created
    if(not folder_exists(email)):
        create_user_folder(email)

    file_content = await audio_file.read()
    print("hello")
    file_name = audio_file.filename
    print(file_name) 

    add_audio(email, audio_file_name = file_name, audio_file_content = file_content)

    transcript = transcriber.transcribe(file_content, config)
    summary = summary_generator(transcript.text)
    tags = tags_generator(5, summary)

    print(type(transcript.chapters[0]))

    AudioSegment.converter = which("ffmpeg")
    audio = AudioSegment.from_file(io.BytesIO(file_content))
    print(io.BytesIO(file_content))
    trimmed_audio = audio[2000:10000]

    buffer = io.BytesIO()
    trimmed_audio.export(buffer, format='mp3')
    buffer.seek(0)
    # trimmed_audio = io.BytesIO(trimmed_audio)
    doc = []
    document = Document(page_content=transcript.text,
                        metadata = {
                            'audio_file_name': file_name,
                            'summary': summary,
                            'tags': tags,
                            'chapters': transcript.chapters
                        })
    
    doc.append(document)
    
    vector_store.add_documents(doc)
    # print(f"file_content : {file_content}")

    # return {"message": "successfully uploaded"}
    return({"message": "uploaded successfully"})


@app.post('/query')
async def query(email: str = Form(...), query: str = Form(...)):

    retrieved_doc = vector_store.similarity_search(query)
    print(type(retrieved_doc[0].metadata['chapters']))
    audio_file_name = retrieved_doc[0].metadata['audio_file_name']
    print(type(audio_file_name))
    vecDB_store_chapter(retrieved_doc[0].metadata['chapters'])
    start_time, end_time = chapter_timestamp(query)

    query_res_text = llm.invoke(f"Reply in 3 lines. context: {retrieved_doc[0].page_content} . query: {query}")

    audio_data = retrieve_audio_content(email, audio_file_name)

    AudioSegment.converter = which("ffmpeg")
    audio = AudioSegment.from_file(io.BytesIO(audio_data))
    print(io.BytesIO(audio_data))
    trimmed_audio = audio[start_time: end_time]

    buffer = io.BytesIO()
    trimmed_audio.export(buffer, format='mp3')
    buffer.seek(0)

    # try:
    ##   audio-retrieval process from AWS S3:
    
    #     audio_file_binary = await client.audio.findFirst(
    #         where = {
    #             'audio_id': audio_id
    #         }
    #     )

    #     audio = AudioSegment.from_file(io.BytesIO(audio_file_binary))
    #     trimmed_audio = audio[start_time, end_time]
    #     trimmed_audio.export('trimmed_audio.mp3', format = 'mp3')

    # except Exception as err:
    #     print(err)
    print(f"start_time: {start_time}, end_time: {end_time}")
    return StreamingResponse(buffer, media_type = "audio/mpeg")
    # return {"message": "hello", "llm_response": query_res_text}