
'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signInSchema } from "@/schemas/signInSchema"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { signIn, useSession } from "next-auth/react";
import { useState } from "react"
import constants from "@/constants";

// zod ka implementation kaise krna hai wo bhi pdh lete hai

// axios to chahiye hi for requests
const SignIn = () => {

    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setisSubmitting] = useState(false);
    // useDebounceValue is used to delay the setting of value of a variable (time in ms)

    // zod implementation starts here

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(
            signInSchema
        ),
        defaultValues: {
            identifier: '',
            password: '',
        }
    });


    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setisSubmitting(true)

        //  we're using next-auth so the signin will be done with the
        // help of next-auth not manually => no API call here

        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });

        // console.log(result);

        if (result?.error) {
            toast({
                title: "Log-In Failed",
                description: "Incorrect username or password",
                variant: "destructive",
            })
        }

        if (result?.url) {
            router.replace('/dashboard');
        }

        setisSubmitting(false);
    }

    const { data: session } = useSession();

    if (session && session.user) {
        router.replace('/dashboard');
        return;
    }

    return (
        <div className="flex justify-center items-center
         min-h-screen">

            <div className="w-full max-w-2xl p-8 space-y-8
             rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-4xl
                        mb-6">
                        Join {constants.APP_NAME_NORMAL}
                    </h1>
                    <p className="text-xl md:text-2xl py-2 font-semibold text-gray-400">Empowering Your Team, One Task at a Time</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6">

                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Username"
                                            {...field} className="text-black" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="password" type="password"
                                            {...field} className="text-black" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isSubmitting} className="bg-white text-black rounded-md
                         hover:bg-slate-800 hover:text-white transition-all text-sm">
                            {
                                isSubmitting ?
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                    </>
                                    :
                                    "SignIn"
                            }
                        </Button>
                    </form>
                </Form>

                <div className="text-left mt-4">
                    <p>
                        Don&apos;st have an account ?
                        <Button className="bg-slate-200 ml-2 text-slate-950 font-semibold rounded-md
                         hover:bg-slate-800 hover:text-white transition-all text-sm">
                            <Link href="/sign-up">
                                Sign Up
                            </Link>
                        </Button>
                    </p>
                </div>
            </div>

        </div>
    )
}

export default SignIn