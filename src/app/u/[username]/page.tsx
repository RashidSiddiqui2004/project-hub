
'use client';

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { messageSchema } from '@/schemas/messageSchema'
import { useParams } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';

const UserPage = () => {

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: "",
        },
    })

    const params = useParams<{ username: string }>(); // to access url params
    const username = params.username;

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {

        try {
            const message = data.content;

            const response = (await axios.post<ApiResponse>('/api/send-message', {
                username,
                content: message
            }))

            toast({
                title: "Message Sent successfully",
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify(data.content, null, 2)}</code>
                    </pre>
                ),
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;

            toast({
                title: "Error Sending Message",
                description: axiosError.response?.data.message ||
                    "Failed to send message",
                variant: "destructive",
            })
        }

    }

    return (
        <div>
            <main className='flex-grow flex flex-col items-center
                 justify-center px-4 md:px-24 py-12'>
                <section className='text-center mb-8 md:mb-12'>
                    <h1 className='font-bold text-2xl md:text-4xl mb-2'>Anonymous Feedback</h1>
                    <p className='text-lg md:text-sm py-1 font-semibold'>Explore Mystery message - where your identity remains a sceret</p>
                </section>

                <section id='message-field' className='w-screen pl-[25vw]'>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Send Anonymous message to @{username}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Type your message here..."
                                                {...field} className=' text-slate-950 h-20' />
                                        </FormControl>
                                        <FormDescription>
                                            Your anonymous response to @{username}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Send Message</Button>
                        </form>
                    </Form>
                </section>
            </main>
        </div>
    )
}

export default UserPage