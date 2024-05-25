
import dbConnect from "@/lib/dbConnect";
import ProjectModel, { TaskItem } from "@/model/Project";
import TaskModel from "@/model/Task";

export async function PUT(request: Request) {
    await dbConnect();

    try {
        const { taskId, taskTitle, taskDescription, assignedTo, link, deadline } = await request.json();

        const existingTask = await TaskModel.findById(taskId);

        if (!existingTask) {
            return Response.json({
                success: false,
                message: "Task not found"
            }, { status: 404 });
        }

        // Update the task properties
        existingTask.taskTitle = taskTitle;
        existingTask.taskDescription = taskDescription;
        existingTask.assignedTo = assignedTo;
        existingTask.link = link;
        existingTask.deadline = deadline;

        await existingTask.save();

        return Response.json({
            success: true,
            message: "Task updated successfully"
        }, { status: 200 });

    } catch (error) {
        console.log("An unexpected error occurred!", error);

        return Response.json({
            success: false,
            message: 'Internal Server Error'
        }, { status: 500 });
    }
}
