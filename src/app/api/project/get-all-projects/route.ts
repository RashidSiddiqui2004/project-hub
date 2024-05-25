
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import mongoose from "mongoose";
import { authOptions } from "../../auth/[...nextauth]/options";
import MemberModel from "@/model/Member";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;

    if (!session || !_user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    // const userid = "663f0883fc55e206ba56ce9c";
    // const userId = new mongoose.Types.ObjectId(userid);

    const userId = new mongoose.Types.ObjectId(_user._id);
 

    try {
        const user = await MemberModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$projects' },
            { $sort: { 'projects.createdAt': -1 } },
            { $group: { _id: '$_id', projects: { $push: '$projects' } } },
        ]).exec();

        if (!user) {
            return Response.json(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        } 

        if (user.length === 0) {
            return Response.json(
                { message: 'No Projects found', success: false },
                { status: 404 }
            );
        }

        //these are project IDs with title, organisation and creation time =>
        //show these on dashboard

        return Response.json({
            success: true,
            projects: user[0].projects,
        }, { status: 201 });

    } catch (error) {
        console.log("An unexpected error occured!", error);

        return Response.json({
            success: false,
            message: 'Error occured while fetching projects'
        }, { status: 401 });
    }
}