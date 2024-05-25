'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
    const { data: session } = useSession();
    const user = session?.user;

    return (
        <div className='grid grid-cols-4 text-center mb-4 mx-4'>
            <h1 className='text-lg font-bold font-sans 
             items-start text-start px-3 col-span-2'>
                <Link href='/'>Project Hub</Link>
            </h1>

            <div className='col-span-2 gap-2 justify-end'>

                {session && (
                    <>
                        <span className="mr-4 italic text-sm">
                            Welcome, {user?.username || user?.email}
                        </span>
                    </>
                )}

                <Button className="w-full md:w-auto bg-slate-100 text-black mx-4" variant='outline'>
                    <Link href="/dashboard">
                        Dashboard
                    </Link>
                </Button>

                {session ? (
                    <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
                        Logout
                    </Button>
                ) :
                    (
                        <Link href="/sign-in">
                            <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Login</Button>
                        </Link>
                    )}

            </div>

        </div>
    )
}

export default Navbar