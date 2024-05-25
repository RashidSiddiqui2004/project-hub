import dbConnect from "@/lib/dbConnect"
import MemberModel, { ProjectItem } from "@/model/Member";
import ProjectModel from "@/model/Project";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { Description } from "@radix-ui/react-toast";

export async function POST(request: Request) {
    await dbConnect();

    try {

        const session = await getServerSession(authOptions);
        const _user: User = session?.user as User;

        const { projectTitle, projectDescription, githubRepo, organisation, deadline } = await request.json();
        const admin = _user._id;

        const project = await ProjectModel.findOne({ projectTitle, admin });

        if (project) {
            return Response.json({
                success: false,
                message: 'Project already exists'
            }, { status: 404 });
        }

        const newProject = new ProjectModel({
            projectTitle, projectDescription, githubRepo, organisation, deadline, admin
        })

        await newProject.save();

        const user = await MemberModel.findOne({
            _id: admin,
        })

        const projectitem = { _id: newProject._id, title: projectTitle, organisation, description: projectDescription, createdAt: new Date() };

        if (user) {

            user.projects?.push(projectitem as ProjectItem);

            await user.save();

            return Response.json({
                success: true,
                message: "Project build successfully!"
            }, { status: 201 });
        }
        else {
            return Response.json({
                success: true,
                message: "User not found!"
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
