import { z } from 'zod';

export const usernameValidation = z.string()
    .min(4, "Username must be atleast 4 characters")
    .max(20, "Username must be atmost 20 characters") 

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({
        message:"Invalid email address"
    }),
    password: z.string().min(6,"Password must be atleast 6 characters")
})