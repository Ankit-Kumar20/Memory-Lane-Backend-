import client from './prisma_client.js'

async function connection_db(){
    try{
        await client.$connect()
        console.log("DB has been connected")
    }
    catch(err){
        console.log(err.message);
    }
}

export default connection_db