
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import mongoose from "mongoose";
import { authOptions } from "../../../auth/[...nextauth]/options";
import MemberModel from "@/model/Member";
import ProjectModel from "@/model/Project";

export async function GET(request: Request, { params }: { params: { projectId: string } }) {
    
    const projectId = params.projectId;

    await dbConnect();

    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;

    if (!session || !_user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }
 
    const userId = new mongoose.Types.ObjectId(_user._id);

    try {
        const user = await MemberModel.findOne({_id:userId});

        if (!user) {
            return Response.json(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        }

        const projects = await ProjectModel.findOne({ admin: userId, projectTitle: projectId })

        //these are project IDs with title, organisation and creation time =>
        //show these on dashboard

        return Response.json({
            success: true,
            projects: projects,
        }, { status: 201 });

    } catch (error) {
        console.log("An unexpected error occured!", error);

        return Response.json({
            success: false,
            message: 'Error occured while fetching projects'
        }, { status: 401 });
    }
}