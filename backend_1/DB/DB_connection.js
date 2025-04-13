const client = require('./prisma_client')

async function connection_db(){
    try{
        await client.$connect()
        console.log("DB has been connected")
    }
    catch(err){
        console.log(err.message);
    }
}

module.exports = connection_db