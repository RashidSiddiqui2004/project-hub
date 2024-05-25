
import { z } from 'zod';

export const taskNameValidation = z.string()
    .min(4, "Project name must be atleast 4 characters")
    .max(50, "Project name must be atmost 50 characters")

export const taskCreationSchema = z.object({
    taskTitle: taskNameValidation,
    taskDescription: z.string().min(25).max(320),
    link: z.string().url(),
    // assignedTo: z.string().min(1, "Assignee is required"),
    deadline: z.date(),
})
