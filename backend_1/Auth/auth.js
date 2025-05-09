import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { emailOTP } from 'better-auth/plugins';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

var OTP = null;
var EMAIL = null;

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
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                OTP  = otp
                EMAIL = email
                console.log(`Sending OTP ${otp} to ${email} for ${type}`);
            },
        }),
    ],
    trustedOrigins: ["http://localhost:5173"]
});

export default auth