'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import Footer from "@/components/ui/Footer";
import { projectCreationSchema } from "@/schemas/projectCreationSchema";
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const CreateProject = () => {
    const { toast } = useToast();

    const [projectName, setProjectName] = useState<string>('');
    const [projectnameMessage, setprojectnameMsg] = useState<string>('');
    const [ischeckingprojectname, setIscheckingprojectname] = useState<boolean>(false);
    const [isSubmitting, setisSubmitting] = useState<boolean>(false);
    const debounced = useDebounceCallback(setProjectName, 500)

    const router = useRouter();

    const form = useForm<z.infer<typeof projectCreationSchema>>({
        resolver: zodResolver(
            projectCreationSchema
        ),
        defaultValues: {
            projectTitle: '',
            projectDescription: '',
            githubRepo: '',
            organisation: '',
            deadline: new Date(),
        }
    });

    useEffect(() => {

        const checkGroupnameUnique = async () => {
            if (projectName) {
                setIscheckingprojectname(true);
                setprojectnameMsg('');

                try {
                    const response = await axios.get(`/api/check-projectName-unique?projectname=${projectName}`);

                    setprojectnameMsg(response.data.message);

                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setprojectnameMsg(axiosError?.response?.data.message ??
                        "Error checking project name"
                    );
                    console.error(axiosError);
                }

                finally {
                    // this block will always execute
                    setIscheckingprojectname(false);
                }
            }

        }
        checkGroupnameUnique();
    }, [projectName]);

    const [deadline, setDeadline] = useState<Date>()

    const onSubmit = async (data: z.infer<typeof projectCreationSchema>) => {
        setisSubmitting(true)

        try {
            const response = await axios.post<ApiResponse>(
                '/api/project/create-project', { ...data, deadline }
            )

            toast({
                title: "Success",
                description: response.data.message
            })

            setisSubmitting(false);

            router.replace(`/p/${projectName}`);

        } catch (error) {
            console.error("Error in creating project", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMsg = axiosError.response?.data.message;

            toast({
                title: "Project Creation Failed",
                description: errorMsg,
                variant: "destructive"
            })
            setisSubmitting(false);
        }
    }

    return (
        <div className="items-center min-h-screen">

            <div className="w-full p-8 space-y-8
             rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-4xl
        mb-6">
                        Create a New Project
                    </h1>
                    {/* <p className="mb-4">Start an anonymous discussion or poll with your group members</p> */}
                </div>


                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6">
                        <FormField
                            control={form.control}
                            name="projectTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="project-name"
                                            className="text-black italic"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debounced(e.target.value);
                                            }} />

                                    </FormControl>

                                    {ischeckingprojectname && <Loader2 className="animate-spin" />}

                                    <p className={`text-sm ${projectnameMessage === 'Project name is unique' ? 'text-blue-400' : 'text-red-400'}`}>
                                        {projectnameMessage}
                                    </p>

                                    <FormDescription>
                                        This is your project-name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="projectDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Project Description"
                                            className="text-black"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your project&apos;s description.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="githubRepo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Github Repository Link</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Project Description"
                                            className="text-black"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your project&apos;s Github repo link.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="organisation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Organisation</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Project Organisation"
                                            className="text-black"
                                            {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your project&apos;s organisation.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="deadline"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[280px] justify-start text-left font-normal text-black",
                                                        !deadline && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {deadline ? format(deadline, "PPP") : <span>Pick deadline of the project</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={deadline}
                                                    onSelect={setDeadline}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
 
                                    </FormControl>
                                    <FormDescription>
                                        This is your project&apos;s deadline.
                                    </FormDescription>
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
                                    "Create Project"
                            }
                        </Button>
                    </form>
                </Form>

            </div>

            <Footer />
        </div>
    )


}

export default CreateProject