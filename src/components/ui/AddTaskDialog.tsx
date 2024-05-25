'use client';

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus } from 'lucide-react';
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import React, { useEffect, useState } from "react";
import { useToast } from "./use-toast";
import { useDebounceCallback } from "usehooks-ts";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form";
import { taskCreationSchema } from "@/schemas/taskCreationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"
import axios, { AxiosError } from 'axios';
import { ApiResponse, MatchedUserInterface } from "@/types/ApiResponse";
import { UserTooltipItem } from "./animated-tooltip";
import Image from "next/image";

export interface AddTaskProps {
    projectId: string;
    projectMembers: UserTooltipItem[];
}

export const AddTaskDialog: React.FC<AddTaskProps> = ({ projectId, projectMembers }) => {
    const { toast } = useToast();
    const [taskName, setTaskName] = useState<string>('');
    const [deadline, setDeadline] = useState<Date>();
    const [tasknameMessage, setTasknameMsg] = useState<string>('');
    const [ischeckingTaskName, setIscheckingTaskname] = useState<boolean>(false);
    const [isSubmitting, setisSubmitting] = useState<boolean>(false);
    const debounced = useDebounceCallback(setTaskName, 500);
    const [memberName, setMemberName] = useState<string>('');
    const [memberId, setMemberId] = useState<string>('');
    const [matchedUsers, setMatchedUsers] = useState<MatchedUserInterface[]>([]);

    const selectUserFromList = (member: MatchedUserInterface) => {
        setMemberId(member._id);
        setMemberName(member.username);
    }

    const form = useForm<z.infer<typeof taskCreationSchema>>({
        resolver: zodResolver(
            taskCreationSchema
        ),
        defaultValues: {
            taskTitle: '',
            taskDescription: '',
            link: '',
            deadline: new Date(),
        }
    });

    const onSubmit = async (data: z.infer<typeof taskCreationSchema>) => {
        setisSubmitting(true)

        try {
            const response = await axios.post<ApiResponse>(
                '/api/tasks/add-task', { ...data, deadline, projectId, assignedTo: memberId }
            )

            toast({
                title: "Success",
                description: response.data.message
            })

            setisSubmitting(false);
        } catch (error) {
            console.error("Error in creating task", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMsg = axiosError.response?.data.message;

            toast({
                title: "Task Adding Failed",
                description: errorMsg,
                variant: "destructive"
            })
            setisSubmitting(false);
        }
    }

    useEffect(() => {

        const fetchPrefixUsers = async () => {
            if (memberName) {

                try {
                    const response = await axios.get(`/api/user/user-exist?username=${memberName}`);
                    if (response.data) {
                        setMatchedUsers(response.data.matchedUsers);
                    }

                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    console.error(axiosError);
                }

            }

        }
        fetchPrefixUsers();
    }, [memberName]);


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-slate-950 text-white text-xs p-1" title="Add new task"><Plus className="text-sm h-4"></Plus>Add Task</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-slate-950 text-white">
                <DialogHeader>
                    <DialogTitle>Add new Task</DialogTitle>
                    <DialogDescription>
                        Add details for new task. Click save when you are done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="grid gap-4 py-4">
                        <FormField
                            control={form.control}
                            name="taskTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>

                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="title" className="text-left">
                                                Task Title
                                            </Label>
                                            <Input
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    debounced(e.target.value);
                                                }}
                                                className="col-span-3 bg-inherit text-white"
                                            />
                                        </div>
                                    </FormControl>

                                    {ischeckingTaskName && <Loader2 className="animate-spin" />}

                                    <p className={`text-sm ${tasknameMessage === 'Task name is unique' ? 'text-blue-400' : 'text-red-400'}`}>
                                        {tasknameMessage}
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="taskDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="description" className="text-left">
                                                Task Description
                                            </Label>
                                            <Input
                                                className="col-span-3 bg-inherit text-white"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="link"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="task-link" className="text-left">
                                                Task Link
                                            </Label>
                                            <Input
                                                className="col-span-3 bg-inherit text-white"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* give a feature to select users on project */}
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-5 items-center gap-4 bg-inherit">
                                <Label htmlFor="name" className="text-left">
                                    Asssigned To
                                </Label>
                                <Input
                                    id="membername"
                                    defaultValue="Rashid"
                                    value={memberName}
                                    onChange={(e) => { setMemberName(e.target.value) }}
                                    className="col-span-4 bg-inherit"
                                />
                            </div>

                            {
                                memberId == '' &&
                                <ul className="">
                                    {matchedUsers.map((user) => (
                                        <li
                                            key={user._id}
                                            className="flex items-center p-2 w-full border-gray-200 rounded cursor-pointer 
                                                hover:shadow-md border-l-2 border-r-2"
                                            onClick={() => { selectUserFromList(user) }}
                                        >
                                            <div className="flex-shrink-0">
                                                <Image
                                                    src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
                                                    alt={user.username}
                                                    width={40}
                                                    height={20}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <p className="font-semibold">{user.username}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            }


                            {/* {ischeckingUserName && <Loader2 className="animate-spin" />}

                            {memberId !== '' && <p className={`text-sm ${memberNameMsg === 'No user found' ? 'text-red-400' : 'text-blue-400'}`}>
                                {memberNameMsg}
                            </p>} */}

                        </div>

                        {/* <FormField
                            control={form.control}
                            name="assignedTo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="assignedTo" className="text-left">
                                                Assigned To
                                            </Label>
                                            <Input
                                                className="col-span-3 bg-inherit text-white"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

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
                                    "Create Task"
                            }
                        </Button>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    )
}
