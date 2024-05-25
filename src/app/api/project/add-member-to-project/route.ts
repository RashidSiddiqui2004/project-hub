
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import MemberModel from "@/model/Member";
import ProjectModel from "@/model/Project";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { User } from "next-auth";

// route to add new members to a particular project
export async function POST(request: Request) {

    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
        return Response.json({
            success: false,
            message: 'Not Authenticated'
        }, { status: 401 });
    }

    const userId = user._id;

    // const userid = "664dada7640dcf65564a5dd0";
    // const userId = new mongoose.Types.ObjectId(userid);

    const { projectId, memberId } = await request.json();

    try {

        const membertoadd = await MemberModel.findOne({
            _id: memberId
        });

        if (!membertoadd) {
            return Response.json({
                success: false,
                message: 'Member not found!'
            }, { status: 401 });
        }

        const projectresponse = await ProjectModel.findOne({ _id: projectId, admin: userId });

        if (projectresponse) {

            // check if member already exists in project
            if (projectresponse.members.includes(membertoadd._id)) {
                return Response.json({
                    success: true,
                    message: 'Member already added to project',
                }, { status: 400 });
            }

            projectresponse.members.push(membertoadd._id);

            await projectresponse.save();

            return Response.json({
                success: true,
                message: 'New Member added',
            }, { status: 201 });
        }
        else {
            return Response.json({
                success: false,
                message: 'Project not found | Not Admin Error',
            }, { status: 401 });
        }

    } catch (error) {
        console.log("Failed to add new member to the project!");
        return Response.json({
            success: false,
            message: `Failed to Add Member`
        }, { status: 500 });
    }

}
