import boto3
from dotenv import load_dotenv
import os
load_dotenv()

Bucket_name = 'memory-lane07'
print(Bucket_name)

s3 = boto3.client(
    's3',
    aws_access_key_id= os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION")
)

def folder_exists(folder_name):
    if not folder_name.endswith('/'):
        folder_name += '/'
    response = s3.list_objects_v2(
        Bucket=Bucket_name,
        Prefix=folder_name,
        MaxKeys=1
    )

    return ('Contents' in response)

def create_user_folder(email: str ):
    try:
        folder_name = f'{email}/'
        s3.put_object(
            Bucket = Bucket_name,
            Key = folder_name
        )
        print("User space is created inside the bucket: {Bucket_name}")
    except Exception as err:
        print(err)

def add_audio(email:str, audio_file_name: str, audio_file_content: bytes):
    ### folder{email} must exist
    try:
        s3.put_object(
            Bucket = Bucket_name,
            Key = f'{email}/{audio_file_name}',
            Body = audio_file_content
        )
        print(f'audio file {audio_file_name} has benn added to the bucket with prefix {email}/.')
    except Exception as err:
        print(err)

def retrieve_audio_content(email: str, audio_file_name: str):
    try:
        response = s3.get_object(
            Bucket = Bucket_name,
            Key = f'{email}/{audio_file_name}'
        )
        return response['Body'].read()
    except Exception as err:
        print(err)

# response = s3.list_buckets()

# for bucket in response['Buckets']:
#     print(bucket['Name'])
    

# print(response['Buckets'][0]['Name'])

# # bucket = s3.Bucket('memory-lane07')
# # bucket.put_object('audio/')
# create_user_folder('ankit')

# response  = s3.get_object(
#     Bucket = Bucket_name,
#     Key = '"ankit@gmail.com"/911-call-76801.mp3'
# )

# print(response['Body'].read())