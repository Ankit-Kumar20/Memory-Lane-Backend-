import express from 'express'
import multer from 'multer'
import axios from 'axios'
import FormData from 'form-data';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage: storage})

router.post('/audio', upload.single('audio_file'), async function(req, res){
    const { user_id } = req.body;
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    audio_file_name = req.file.originalname;
    const buffer = req.file.buffer;

    const form = new FormData();
    form.append("user_id", user_id)
    form.append('audio_file', buffer, {
        filename: audio_file_name,
        contentType: 'audio/mpeg'
    })

})

export default router;