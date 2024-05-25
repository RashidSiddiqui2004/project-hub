
import { NextAuthOptions } from "next-auth"
import bcrypt from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from "@/lib/dbConnect";
import MemberModel from "@/model/Member";
 
export const authOptions: NextAuthOptions = {
    // we can add more providers here like google, twitter, linkedin
    // in a single object in providers object
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: 'Credentials',
            credentials: {
                username: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any, req): Promise<any> {
                await dbConnect();

                try {
                    const user = await MemberModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })

                    if (!user) {
                        throw new Error('No user found with this email!');
                    }

                    if (!user.isVerified) {
                        throw new Error('Pls verify your account first!');
                    }

                    const isPasswordcorrect = await bcrypt.compare(credentials.password, user.password);

                    if (isPasswordcorrect) {
                        return user;
                    }
                    else {
                        throw new Error('Incorrect password!');
                    }
                }
                catch (error: any) {
                    throw new Error(error);
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            // session ke pass token aur session

            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified; 
                session.user.username = token.username;
                session.user.fullname = token.fullname;
                session.user.organisation = token.organisation;
            }

            return session;
        },

        async jwt({ token, user }) {
            // jwt ke pass token aur user ka access hai jo upar define kiya hai

            if (user) {
                token._id = user._id?.toString();
                token.username = user.username;
                token.isVerified = user.isVerified; 
            }
            return token;
        }
    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXT_AUTH_SECRET,
};