'use client'
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from 'zod'; 
import { Button } from '@/components/ui/button';
import {
    InputOTP,
    InputOTPGroup, 
    InputOTPSlot,
} from "@/components/ui/input-otp"

const VerifyAccount = () => {

    const router = useRouter(); // for redirecting user to any where
    const params = useParams<{ username: string }>(); // to access url params
    const { toast } = useToast();

    // zod implementation starts here
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(
            verifySchema
        )
    });

    const [code, setCode] = useState("")

    const onSubmit = async () => {
        try {
            console.log(code);
            const response = await axios.post('/api/verifyCode', {
                username: params.username,
                code: code
            });

            toast({
                title: "Success",
                description: response.data.message
            })

            router.replace(`/sign-in`);
            // new method => replace method

        } catch (error) {

            console.error("Error in signup of user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMsg = axiosError.response?.data.message;

            toast({
                title: "Verification Failed",
                description: errorMsg,
                variant: "destructive"
            })
        }
    }

    return (
        <div className="flex justify-center items-center
         min-h-screen">

            <div className="w-full max-w-2xl p-8 space-y-8
             rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl
                        mb-6">
                        Join Mystery Messenger
                    </h1>
                    <p className="mb-4">Verify your account to start your anonymous adventure</p>
                </div>

                <div className="flex justify-center items-center text-center">

                    {/* <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-center items-center ml-8"> */}

                    <InputOTP maxLength={8} pattern={REGEXP_ONLY_DIGITS}
                        value={code}
                        onChange={(value) => setCode(value)}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                            <InputOTPSlot index={6} />
                            <InputOTPSlot index={7} />
                        </InputOTPGroup>
                    </InputOTP>


                    {/* </form> */}
                    {/* </Form> */}
                </div>

                <div className="flex justify-center items-center text-center">
                    <Button type="submit" className="bg-white text-black rounded-lg
                hover:bg-slate-800 hover:text-white transition-all text-sm
                 items-center text-center" onClick={onSubmit}>Submit</Button>
                </div>

            </div>

        </div>
    )
}

export default VerifyAccount

{/* <FormField
                                name="code"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verification Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="code" {...field} />
                                        </FormControl> 
<FormMessage />
                                    </FormItem >
                                
/> */}