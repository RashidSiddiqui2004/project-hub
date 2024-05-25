
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import ProjectModel from "@/model/Project";
import TaskModel from "@/model/Task";
import { getServerSession } from "next-auth";
import { User } from "next-auth";

// route to DELETE a task
export async function DELETE(request: Request, { params }: { params: { taskId: string, projectid: string } }) {

    const { projectid, taskId } = params;

    await dbConnect();

    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;

    // $pull is used to delete values from an array inside a mongodb document

    if (!session || !_user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {

        const response = await ProjectModel.updateOne(
            { _id: projectid },
            { $pull: { tasks: { _id: taskId } } }
        )

        if (response.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Task not found or already deleted!"
            }, { status: 404 });
        }

        const deleteProjectResponse = await TaskModel.deleteOne({
            _id: taskId
        });

        return Response.json({
            success: true,
            message: "Task deleted!"
        }, { status: 200 });

    } catch (error) {

        return Response.json({
            success: false,
            message: 'Error deleting Task!'
        }, { status: 401 });
    }
}
