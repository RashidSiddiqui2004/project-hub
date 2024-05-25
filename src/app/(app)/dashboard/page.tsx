
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ProjectsDashboard from "@/components/ui/ProjectsDashboard";
import Footer from "@/components/ui/Footer";
import Image from "next/image";



const Dashboard: React.FC = async () => {
    // const router = useRouter();  
    const session = await getServerSession(authOptions);
    let user;
    let loading = true;

    if (session && session.user) {
        user = session.user as User;
        loading = false;

    } else {
        loading = false;
        return;
    }

    if (loading) {
        return <div className="flex justify-center items-center mb-6 text-center text-lg p-6">Loading...</div>;
    }

    if (!user) {
        return <div>Redirecting to login...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            <div className="bg-slate-800 p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        {user && (
                            <>
                                <Image
                                    src={user.image || 'https://utfs.io/f/46a4f5cb-73fb-4eef-a8b4-944b4cee1ab7-8kohli.jpeg'} // Default profile image
                                    alt="User Profile"
                                    width={40}
                                    height={5}
                                    className="rounded-full mr-4"
                                />
                                <div>
                                    <h2 className="text-xl font-bold">{user.username}</h2>
                                    <p className="text-white">{user.email}</p>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex space-x-4">
                        <Button asChild>
                            <Link href="/create-project">Create New Project</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/upload-image">Update Profile Image</Link>
                        </Button>
                        {/* <Button asChild>
                            <Link href="/request-project-member-add">Request to Join Project</Link>
                        </Button> */}
                    </div>
                </div>

                <ProjectsDashboard />

                <Footer />
            </div>
        </div>
    );
};

export default Dashboard;
