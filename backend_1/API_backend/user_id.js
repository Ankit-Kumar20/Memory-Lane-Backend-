import express from 'express'
import client from '../DB/prisma_client.js'
const router = express.Router()

router.post('/user_id', async function(req, res){
    const {email} = req.body
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
})

export default router