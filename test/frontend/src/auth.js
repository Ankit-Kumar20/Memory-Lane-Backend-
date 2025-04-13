const { betterAuth } = require( "better-auth");
// const { authClient }  = require("@/lib/auth-client"); 
const { prismaAdapter } = require("better-auth/adapters/prisma");
const { PrismaClient } = require("@prisma/client");
require('dotenv').config();

const prisma = new PrismaClient()

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    url: process.env.BETTER_AUTH_URL,
    database: prismaAdapter(prisma, {
        provider: "postgressql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {    
        enabled: true
    },
    trustedOrigins: () => ["http://localhost:5173"]
})

// module.default.exports = auth