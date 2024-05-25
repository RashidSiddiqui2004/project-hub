'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import axios from 'axios';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Project {
    _id: string;
    title: string;
    description: string;
    organisation: string;
    createdAt: Date;
}


const ProjectsDashboard = () => {
    const router = useRouter();

    const [userProjects, setUserProjects] = useState<Project[] | null>(null);

    useEffect(() => { 

        const fetchProjects = async () => {
            try {
                const projects = await axios.get('/api/project/get-all-projects');
                setUserProjects(projects.data.projects);
            } catch (error) {
                console.log('Error while fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">Projects Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProjects?.map((project: Project) => (
                    <div key={project._id} className="bg-slate-700 text-white p-4 rounded-lg shadow-md">
                        <h4 className="text-sm font-bold mb-2">{project.title}</h4>
                        <p className="text-sm float-right bg-slate-900 text-white p-2 rounded-lg">{project.organisation}</p>
                        <p className="text-sm">{project.description}</p>

                        <Button asChild className='my-1'>
                            <Link href={`/p/${project.title}`}>
                                View Project
                            </Link>
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProjectsDashboard