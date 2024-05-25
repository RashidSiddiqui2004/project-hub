'use client';

import { IProject } from '@/model/Project';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { format } from 'date-fns';
import Task from '@/components/ui/Task';
import { AnimatedTooltip, UserTooltipItem } from '@/components/ui/animated-tooltip';
import { AddTaskDialog } from '@/components/ui/AddTaskDialog';
import { AddMemberDialog } from '@/components/ui/AddMemberDialog';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCcw } from 'lucide-react';

const Project = () => {
    const params = useParams<{ projectName: string }>();
    const projectName = params.projectName;
    const [projectAdmin, setProjectAdmin] = useState('');
    const [project, setProject] = useState<IProject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [projectMembers, setProjectMembers] = useState<UserTooltipItem[]>([]);

    const fetchProjectMembers = async (userId: string) => {
        try {
            const response = await axios.get(`/api/project/get-member/${userId}`);
            const newUser = response.data.user;

            setProjectMembers((prevMembers) => {
                if (prevMembers.some(member => member._id === newUser._id)) {
                    return prevMembers;
                } else {
                    return [...prevMembers, newUser];
                }
            });

        } catch (error) {
            setError('Error while fetching project member details');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

  
    useEffect(() => {
        const fetchProjectDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/project/get-project/${projectName}`);
                const projectData = response.data.projects;
                setProject(projectData);

                const admin = await axios.get(`/api/project/get-member/${projectData.admin}`);
                setProjectAdmin(admin.data.user.username);

                const members = projectData.members;

                members.map(async (member: string) => {
                    await fetchProjectMembers(member);
                })

            } catch (error) {
                setError('Error while fetching project details');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [projectName])

    if (loading) {
        return <div className="flex justify-center items-center mb-6 text-center text-lg p-6">Loading...</div>;
    }
    if (error) {
        return <div className="flex justify-center items-center mb-6 text-center text-lg p-6">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-950 p-3">
            <div className="px-6 py-1 rounded-lg shadow-md text-white text-sm">

                <div className='grid grid-cols-6 mb-3'>
                    <div className='flex flex-row gap-1 col-span-2'>
                        <h1 className="text-xl font-bold text-left">{project?.projectTitle}</h1>
                        <p className="mb-2">
                            <strong className='bg-orange-400 text-white py-1 px-2 mx-3 rounded-sm'> {project?.organisation}</strong>
                        </p>
                    </div>
                    <a href={project?.githubRepo} target='_blank'
                        className="bg-slate-200 mx-4 text-slate-900 px-2 py-1 col-span-1 
                     rounded-lg h-fit w-fit hover:scale-95 transition-all">GitHub Repository</a>
                    <p className="col-span-1">
                    </p>
                    <p className="col-span-1 float-right text-red-400">
                        <strong>Deadline:</strong> {project?.deadline ? format(new Date(project.deadline), 'PPP') : 'No deadline'}
                    </p>

                    {/* <Button
                        className='flex pt-3 w-fit justify-end items-end'
                        onClick={(e) => {
                            e.preventDefault();
                            fetchProjectDetails();
                        }}
                    >

                        {loading ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                        ) : (
                            <div className='flex flex-row gap-2'>
                                <RefreshCcw className='h-4 w-4 bg-slate-900' /><span>Refresh</span>
                            </div>
                        )}

                    </Button> */}
                </div>

                <div className='float-right'>
                    <h2 className='p-2 text-xs'>Project ID</h2>
                    <h2 className='bg-slate-800 text-gray-200 p-2 text-xs rounded-md'>{project?._id}</h2>
                </div>
                <p className="mb-2">
                    {project?.projectDescription || 'No description provided'}
                </p>

                <p className="mb-2 bg-slate-800 text-gray-200 p-2 text-xs rounded-md w-fit">
                    <strong>Admin:</strong> {projectAdmin}
                </p>
                <div className='float-right flex gap-1 my-[2px]'>
                    <AddMemberDialog projectId={project?._id} />
                    <AddTaskDialog projectId={project?._id} projectMembers={projectMembers} />
                </div>
                <p className='mb-1'>
                    Project Team
                </p>
                <div className="flex flex-row items-center justify-left mb-10 w-full">
                    {
                        <AnimatedTooltip items={projectMembers} />
                    }
                </div>


                <div className='flex flex-row'>
                    {project?.tasks && project.tasks.map((task, index) => {
                        return (
                            <Task key={index} taskId={task._id} />
                        )
                    })}
                </div>
            </div>
        </div>
    );

};

export default Project