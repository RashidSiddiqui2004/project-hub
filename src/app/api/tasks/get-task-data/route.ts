
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import mongoose from "mongoose";
import { authOptions } from "../../auth/[...nextauth]/options";
import MemberModel from "@/model/Member";
import TaskModel from "@/model/Task";

export async function POST(request: Request) {

    const { taskId } = await request.json();
    console.log(taskId);

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
        const user = await MemberModel.findOne({ _id: userId });

        if (!user) {
            return Response.json(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        }

        const task = await TaskModel.findOne({ _id: taskId }) 


        return Response.json({
            success: true,
            task: task,
        }, { status: 201 });

    } catch (error) {
        console.log("An unexpected error occured!", error);

        return Response.json({
            success: false,
            message: 'Error occured while fetching task'
        }, { status: 401 });
    }
}