'use client';

import React from 'react';
import Footer from '@/components/ui/Footer';
import constants from '@/constants';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const HomePage = () => {

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
                <section className="text-center mb-8 md:mb-12">
                    <h1 className="font-bold text-3xl md:text-5xl mb-4 ">{constants.APP_NAME_NORMAL}</h1>
                    <p className="text-xl md:text-2xl py-2 font-semibold text-gray-400">Empowering Your Team, One Task at a Time</p>
                    <p className="text-lg md:text-xl py-1 font-medium text-gray-500">Explore Project Hub - where your identity remains a secret</p>
                </section>

                <section className="text-center mb-12">
                    <h2 className="font-bold text-2xl md:text-4xl mb-4">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-black">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h3 className="font-semibold text-lg md:text-xl mb-2">📂 Create Projects</h3>
                            <p className="text-gray-600">Easily create and manage projects with a user-friendly interface.</p>
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h3 className="font-semibold text-lg md:text-xl mb-2">📊 Dashing Dashboard</h3>
                            <p className="text-gray-600">A comprehensive dashboard to view all your projects and tasks at a glance.</p>
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h3 className="font-semibold text-lg md:text-xl mb-2">👥 Team Collaboration</h3>
                            <p className="text-gray-600">Add your team to individual projects and collaborate efficiently.</p>
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h3 className="font-semibold text-lg md:text-xl mb-2">📝 Task Management</h3>
                            <p className="text-gray-600">Add tasks to projects with deadlines and track their progress.</p>
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h3 className="font-semibold text-lg md:text-xl mb-2">📅 Deadlines</h3>
                            <p className="text-gray-600">Set deadlines for each task to ensure timely completion.</p>
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h3 className="font-semibold text-lg md:text-xl mb-2">📧 Email Notifications</h3>
                            <p className="text-gray-600">Receive email updates for important project and task activities.</p>
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h3 className="font-semibold text-lg md:text-xl mb-2">⭐ Task Prioritization</h3>
                            <p className="text-gray-600">Prioritize tasks and use different colors based on priority levels.</p>
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h3 className="font-semibold text-lg md:text-xl mb-2">🔒 Role-Based Permissions</h3>
                            <p className="text-gray-600">Assign different permissions for project admins and members.</p>
                        </div>
                    </div>
                </section>

                <section className='text-center mb-8 md:mb-12'>
                    <Button className='p-4 font-sans bg-white text-slate-950
                     hover:bg-slate-300 hover:text-slate-800'>
                        <Link href='/sign-up' className='text-xl'>
                            Register for Free
                        </Link>
                    </Button>
                </section>
            </main>

            <Footer />
        </div>

    );
}

export default HomePage;
