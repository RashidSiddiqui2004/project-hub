import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
    taskTitle: string;
    taskDescription: string;
    projectId: Schema.Types.ObjectId;
    assignedTo: mongoose.Types.ObjectId;
    link?: string;
    deadline: Date;
    lockStatus: boolean;
    editors: mongoose.Types.ObjectId[];
}

const taskSchema = new Schema<ITask>(
    {
        taskTitle: {
            type: String,
            required: [true, "Task Title is required"],
            index: true,
        },
        taskDescription: {
            type: String,
            required: [true, "Task Description is required"],
            unique: false,
        },
        projectId: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        link: {
            type: String,
            required: false,
        },
        deadline: {
            type: Date,
            required: false,
        },
        lockStatus: {
            type: Boolean,
            required: true,
        },
        editors: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
                default: []
            }, 
        ],
    },
    {
        timestamps: true,
    }
);

const TaskModel = (mongoose.models?.Task as mongoose.Model<ITask>) || (mongoose.model<ITask>("Task", taskSchema));

export default TaskModel;
