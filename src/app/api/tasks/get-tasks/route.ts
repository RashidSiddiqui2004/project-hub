
import dbConnect from "@/lib/dbConnect";
import ProjectModel from "@/model/Project";
import mongoose from "mongoose";

// get all tasks for a project
export async function POST(request: Request) {
    await dbConnect();

    try {
        const { projectId } = await request.json();
        const pid = new mongoose.Types.ObjectId(projectId);

        const isProjectExisting = ProjectModel.findById(pid);

        if(!isProjectExisting){
            return Response.json(
                { message: 'Project not found', success: false },
                { status: 404 }
            );
        }

        const project = await ProjectModel.aggregate([
            { $match: { _id: pid } },
            { $unwind: '$tasks' },
            { $sort: { 'tasks.createdAt': -1 } },
            { $group: { _id: '$_id', tasks: { $push: '$tasks' } } },
        ]).exec();

        if (!project) {
            return Response.json(
                { message: 'Project not found', success: false },
                { status: 404 }
            );
        }

        if (project.length === 0) {
            return Response.json(
                { message: 'No Tasks found', success: false },
                { status: 404 }
            );
        }

        return Response.json({
            success: true,
            tasks: project[0].tasks,
        }, { status: 201 });

    } catch (error) {
        console.log("An unexpected error occured!", error);

        return Response.json({
            success: false,
            message: 'Error occured while fetching projects'
        }, { status: 401 });
    }
}