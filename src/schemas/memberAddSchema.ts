
import { z } from 'zod';

export const memberNameValidation = z.string()
    .min(4, "Username must be atleast 4 characters")
    .max(20, "Username must be atmost 20 characters")

export const memberAddSchema = z.object({
    membername: memberNameValidation,
})
