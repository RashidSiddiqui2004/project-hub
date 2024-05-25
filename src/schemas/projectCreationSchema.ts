
import { z } from 'zod';

export const projectNameValidation = z.string()
    .min(4, "Project name must be atleast 4 characters")
    .max(50, "Project name must be atmost 50 characters") 

export const projectCreationSchema = z.object({
    projectTitle: projectNameValidation,
    projectDescription: z.string().min(10).max(320),
    githubRepo: z.string().url(),
    organisation: z.string().min(1, "Organisation name is required"),
    deadline: z.date(),
})