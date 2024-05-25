
import 'next-auth'
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface User {
        _id?: string;
        username?: string;
        image?:string;
        isVerified?: boolean;
        organisation?: string;
    }
    interface Session {
        // all properties defined above for user
        user: {
            _id?: string;
            username?: string;
            image?: string;
            isVerified?: boolean;
            organisation?: string;
            fullname?: string;
        } & DefaultSession['user']
    }
}

// second-method
declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        username?: string;
        image?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        organisation?: string;
        fullname?: string;
    }
}