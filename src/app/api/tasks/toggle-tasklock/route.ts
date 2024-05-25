
import dbConnect from "@/lib/dbConnect";
import TaskModel from "@/model/Task";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { taskId, lockStatus } = await request.json();

        const existingTask = await TaskModel.findOne({ _id: taskId });

        if (!existingTask) {
            return Response.json({
                success: false,
                message: "Task not found"
            }, { status: 404 });
        }

        existingTask.lockStatus = !existingTask.lockStatus;;

        await existingTask.save();

        return Response.json({
            success: true,
            message: "Task Lock Toggled successfully"
        }, { status: 200 });

    } catch (error) {
        console.log("An unexpected error occurred!", error);

        return Response.json({
            success: false,
            message: 'Internal Server Error'
        }, { status: 500 });
    }
}
