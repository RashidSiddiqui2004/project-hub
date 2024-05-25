
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
import React, { useEffect, useState } from "react";
import { useToast } from "./use-toast";
import { useDebounceCallback } from "usehooks-ts"; 
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/ApiResponse"; 
import { MatchedUserInterface } from "@/types/ApiResponse";
import Image from "next/image";

export interface AddTaskProps {
    projectId: string
}

export const AddMemberDialog: React.FC<AddTaskProps> = ({ projectId }) => {
    const { toast } = useToast();
    const [memberName, setMemberName] = useState<string>('');
    const [memberId, setMemberId] = useState<string>('');
    const [memberNameMsg, setMemberNameMsg] = useState<string>('');
    const [matchedUsers, setMatchedUsers] = useState<MatchedUserInterface[]>([]);
    const [ischeckingUserName, setIscheckingUserName] = useState<boolean>(false);
    const [isSubmitting, setisSubmitting] = useState<boolean>(false);
    const debounced = useDebounceCallback(setMemberName, 500);


    const onSubmit = async () => {
        setisSubmitting(true)

        try {
            const response = await axios.post<ApiResponse>(
                '/api/project/add-member-to-project', { memberId, projectId }
            )

            toast({
                title: "Success",
                description: response.data.message
            })

            setisSubmitting(false);
        } catch (error) {
            console.error("Error in adding member", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMsg = axiosError.response?.data.message;

            toast({
                title: "Member Add Failed",
                description: errorMsg,
                variant: "destructive"
            })
            setisSubmitting(false);
        }
    }

    const selectUserFromList = (member: MatchedUserInterface) => {
        setMemberId(member._id);
        setMemberName(member.username);
    }

    useEffect(() => {

        const fetchPrefixUsers = async () => {
            if (memberName) {
                setIscheckingUserName(true);
                setMemberNameMsg('');

                try {
                    const response = await axios.get(`/api/user/user-exist?username=${memberName}`);
                    if (response.data) {
                        setMatchedUsers(response.data.matchedUsers);
                    }
                    setMemberNameMsg(response.data.message);

                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setMemberNameMsg(axiosError?.response?.data.message ??
                        "Error fetching users"
                    );
                    console.error(axiosError);
                }

                finally {
                    // this block will always execute
                    setIscheckingUserName(false);
                }
            }

        }
        fetchPrefixUsers();
    }, [projectId, memberName]);


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-slate-950 text-white text-xs p-1" title="Add new task"><Plus className="text-sm h-4"></Plus>Add Member</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-slate-950 text-white">
                <DialogHeader>
                    <DialogTitle>Add new Member to Project</DialogTitle>
                    <DialogDescription>
                        Type the username to add. Click save when you are done.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-5 items-center gap-4 bg-inherit">
                        <Label htmlFor="name" className="text-left">
                            Member Name
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
                                            width={50}
                                            height={50}
                                            className="rounded-full"
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <p className="font-semibold">{user.username}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    }


                    {ischeckingUserName && <Loader2 className="animate-spin" />}

                    {memberId !== '' && <p className={`text-sm ${memberNameMsg === 'No user found' ? 'text-red-400' : 'text-blue-400'}`}>
                        {memberNameMsg}
                    </p>}


                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting} className="bg-white text-black rounded-md
                         hover:bg-slate-800 hover:text-white transition-all text-sm" onClick={onSubmit}>
                            {
                                isSubmitting ?
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                    </>
                                    :
                                    "Add Member"
                            }
                        </Button>
                    </DialogFooter>
                </div>

            </DialogContent>
        </Dialog>
    )
}


{/* <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="grid gap-4 py-4">
                        <FormField
                            control={form.control}
                            name="membername"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>

                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="title" className="text-left">
                                                Username
                                            </Label>
                                            <Input
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    debounced(e.target.value);
                                                }} 
                                                value={memberName}
                                                className="col-span-3 bg-inherit text-white"
                                            />

                                        </div>

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
                                    "Add Member"
                            }
                        </Button>
                    </form>
                </Form> */}
