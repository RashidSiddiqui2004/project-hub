import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import MemberModel from "@/model/Member";
import { getServerSession } from "next-auth";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();
    const { uploadedImageURL } = await request.json();

    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;

    if (!session || !_user) {
        return Response.json(
            { message: "Not authenticated", success: false },
            { status: 401 }
        );
    }

    try {
        const user = await MemberModel.findOne({ _id: _user._id });

        if (!user) {
            return Response.json(
                { message: "User doesn't exist", success: false },
                { status: 400 }
            );
        }

        user.image = uploadedImageURL;

        await user.save();

        return Response.json(
            { message: 'Image uploaded successfully', success: true },
            { status: 201 }
        );

    } catch (error) {
        console.log("An unexpected error occured!", error);
        return Response.json(
            { message: 'Internal Server Error!', success: false },
            { status: 500 }
        );
    }
}
