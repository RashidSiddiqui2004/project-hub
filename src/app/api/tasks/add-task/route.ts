import dbConnect from "@/lib/dbConnect" 
import ProjectModel, { TaskItem } from "@/model/Project";
import TaskModel from "@/model/Task";

// to add a new task to a project
export async function POST(request: Request) {
    await dbConnect();

    try {
        const { projectId, taskTitle, taskDescription, assignedTo, link, deadline } = await request.json();

        const project = await ProjectModel.findById(projectId);
 
        if (!project) {
            return Response.json({
                success: false,
                message: "Project doesn't exist"
            }, { status: 404 });
        }

        const exisitingTask = await TaskModel.findOne({
            projectId, taskTitle
        });


        if (exisitingTask) {
            return Response.json({
                success: false,
                message: "Task-Title already exists"
            }, { status: 201 });
        }

        const newTask = new TaskModel({
            taskTitle, taskDescription, projectId, assignedTo, link, deadline,
            lockStatus: false
        })

        await newTask.save();

        const taskItem: TaskItem = { _id: newTask._id, createdAt: new Date() } as TaskItem;

        if (project) {
 
            project.tasks?.push(taskItem);

            await project.save();

            return Response.json({
                success: true,
                message: "Task added successfully"
            }, { status: 201 });
        }

    } catch (error) {
        console.log("An unexpected error occured!", error);

        return Response.json({
            success: false,
            message: 'Internal Server Error!'
        }, { status: 401 });
    }
}
