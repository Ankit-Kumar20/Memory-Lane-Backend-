const {PrismaClient} = require('@prisma/client')

const client = new PrismaClient()

async function connection(){
    await client.$connect()
}

async function create(){
    await client.user.create({
        data:{
            email: "System_2",
            password: "oiahclk"
        }
    })
}

connection()
create()
