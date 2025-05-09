import express from 'express'
import multer from 'multer'
import axios from 'axios'
import FormData from 'form-data';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage: storage})

async function get_user_id(email){
    try{
        const response = await client.user.findFirst(
            {
                where: {
                    "email": email
                }
            }
        )
        console.log(response.id);
        console.log(typeof(response.id));
        res.status(201).send(response.id);
    }
    catch(err){
        console.log(err.message)
    }
}

router.post('/upload', upload.single('audio_file'), async function(req, res){
    const { email } = req.body.email;
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    audio_file_name = req.file.originalname;
    const buffer = req.file.buffer;

    user_id = await get_user_id(email)

    const form = new FormData();
    form.append("user_email", email)
    form.append("user_id", user_id)
    form.append('audio_file', buffer, {
        filename: audio_file_name,
        contentType: 'audio/mpeg'
    })

    try{
        const response = await axios.post('http://127.0.0.1:8000/upload', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        console.log(response.data)
    }
    catch(err){
        console.log(err.message)
    }

})

export default router;