import dbConnect from "@/lib/dbConnect";
import MemberModel from "@/model/Member";
import { sendVerificationEmail } from "@/schemas/sendVerificationEmail";
import bcyrpt from 'bcryptjs';

// Function is explicitly named as post, get, patch, delete in next.js
// route is handled implicitly in next.js as just the folder structure handles the routes

export async function POST(request: Request) {

    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        const existingUsersByUsername = await MemberModel.findOne({
            username,
            isVerified: true,
        })

        if (existingUsersByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username already taken!"
                },
                {
                    status: 400
                }
            )
        }

        const existingUsersByEmail = await MemberModel.findOne({
            email,
            isVerified: true
        });

        const verifyCode = Math.floor(10000000 + Math.random() * 900000).toString();

        if (existingUsersByEmail) {
            if (existingUsersByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exists with this email!"
                    },
                    {
                        status: 400
                    }
                )
            }
            else {
                const hashedPassword = await bcyrpt.hash(password, 10);

                existingUsersByEmail.password = hashedPassword;
                existingUsersByEmail.verifyCode = verifyCode;
                existingUsersByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUsersByEmail.save();
            }
        }
        else {
            const hashedPassword = await bcyrpt.hash(password, 10);
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new MemberModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                isVerified: true,
                verifyCodeExpiry: expiryDate,
                isAcceptingMsg: true,
            })

            await newUser.save();
        }

        // send verification email

        const mailResponse = await sendVerificationEmail(email, username, verifyCode);

        if (!mailResponse.success) {
            return Response.json({
                success: false,
                message: mailResponse.message
            }, { status: 500 })
        }

        return Response.json({
            success: true,
            message: "User registered successfully."
        }, { status: 201 })

    }
    catch (error) {
        console.log("Error registering user!");

        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )

    }
}