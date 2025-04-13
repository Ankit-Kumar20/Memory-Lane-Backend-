const { betterAuth } = require ("better-auth");
const { prismaAdapter } = require("better-auth/adapters/prisma");
const { emailOTPClient } = require('better-auth/client/plugins')
const { PrismaClient } = require("@prisma/client");
require('dotenv').config();

const prisma = new PrismaClient();

const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    url: process.env.BETTER_AUTH_URL,
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    emailAndPassword: {
        enabled: true
    },
    plugins:[
        emailOTPClient()
    ],
    trustedOrigins: ["http://localhost:5173"]
});

module.exports = auth;