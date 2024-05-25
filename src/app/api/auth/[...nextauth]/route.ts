import NextAuth from "next-auth/next";
import { authOptions } from "./options";
import nextAuth from "next-auth";


// this file is quite easy as compared to options.ts file

const handler = nextAuth(authOptions)

// these names are really important b/c next-auth is a framework

export { handler as GET, handler as POST };