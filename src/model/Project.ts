import mongoose, { Schema, Document } from "mongoose";

export interface TaskItem extends Document {
    createdAt: Date;
}

const TaskItemSchema: Schema<TaskItem> = new Schema({
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
    }
});

export interface IProject extends Document {
    projectTitle: string;
    projectDescription?: string;
    githubRepo: string;
    organisation: string;
    deadline?: Date;
    admin: mongoose.Types.ObjectId;
    tasks: TaskItem[];
    members: Schema.Types.ObjectId[];
}

const projectSchema: Schema<IProject> = new Schema<IProject>(
    {
        projectTitle: {
            type: String,
            required: [true, "Project title is required"],
            index: true,
        },
        projectDescription: {
            type: String,
            required: false,
            unique: false,
        },
        githubRepo: {
            type: String,
            required: [true, "Github Repository Link is required"],
            index: false,
        },
        organisation: {
            type: String,
            required: [true, "Organisation is required"],
        },
        deadline: {
            type: Date,
            required: false,
        },
        admin: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Project Admin is required"],
        },
        members: [{
            type: Schema.Types.ObjectId,
            default: [],
            required: false,
        }],
        tasks:
        {
            type: [TaskItemSchema],
            ref: "Task",
            default: []
        },
    },
    {
        timestamps: true,
    }
);

const ProjectModel = (mongoose.models?.Project as mongoose.Model<IProject>) || (mongoose.model<IProject>("Project", projectSchema));

export default ProjectModel;
