from .s3_client import s3, bucket

def create_user_folder(email: str ):
    try:
        bucket.put_object(f'{email}/')
        print("user space is created inside the bucket")
    except Exception as err:
        print(err)

def add_audio(email:str, audio_file_name: str):
    ### folder{email} must exist
    try:
        bucket.put_object(f'{email}/{audio_file_name}/', {audio_file_name})
        print(f'audio file {audio_file_name} has benn added to the bucket.')
    except Exception as err:
        print(err)