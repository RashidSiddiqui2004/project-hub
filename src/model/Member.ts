import mongoose, { Schema, Document } from 'mongoose';

export interface ProjectItem extends Document {
    title: string,
    organisation: string,
    description: string;
    createdAt: Date;
}

const ProjectItemSchema: Schema<ProjectItem> = new Schema({
    title: {
        type: String,
        required: true,
    },
    organisation: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
    }
});

export interface Member extends Document {
    username: string;
    fullname?: string;
    email: string;
    password: string;
    organisation?: string;
    designation: string;
    verifyCode: string;
    isVerified: boolean;
    verifyCodeExpiry: Date;
    projects?: ProjectItem[];
    image: string;
}

const MemberSchema: Schema<Member> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
    },
    fullname: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, "Please use a valid Email Address"]
    },
    organisation: {
        type: String,
        required: false,
    },
    designation: {
        type: String,
        default: 'JPM User',
        required: false,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verification Code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verification Code Expiry Date is required"],
    },
    isVerified: {
        type: Boolean,
        default: true, //change to false in production
    },
    image: {
        type: String,
        required: false,
    },
    projects: {
        type: [ProjectItemSchema],
        ref: "Project",
        required: false,
    }
},
    {
        timestamps: true
    });

const MemberModel = (mongoose.models?.Member as mongoose.Model<Member>) || (mongoose.model<Member>("Member", MemberSchema));

export default MemberModel;