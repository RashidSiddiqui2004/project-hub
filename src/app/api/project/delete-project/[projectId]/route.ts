import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import MemberModel from "@/model/Member";
import ProjectModel from "@/model/Project";
import { getServerSession } from "next-auth";
import { User } from "next-auth";

// route to DELETE a project

export async function DELETE(request: Request, { params }: { params: { projectId: string } }) {

    const projectId = params.projectId;

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

        const response = await MemberModel.updateOne(
            { _id: _user._id },
            { $pull: { projects: { _id: projectId } } }
        )

        if (response.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Project not found or already deleted!"
            }, { status: 404 });
        }

        const deleteProjectResponse = await ProjectModel.deleteOne({
            _id: projectId
        });

        return Response.json({
            success: true,
            message: "Project deleted!"
        }, { status: 200 });

    } catch (error) {

        return Response.json({
            success: false,
            message: 'Error deleting Project!'
        }, { status: 401 });
    }
}
