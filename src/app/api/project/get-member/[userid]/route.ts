import dbConnect from "@/lib/dbConnect";
import MemberModel from "@/model/Member";
import { UserTooltipItem } from '@/components/ui/animated-tooltip';

export async function GET(request: Request, { params }: { params: { userid: string } }) {

    const userid = params.userid;
    console.log(userid);
    

    await dbConnect();

    try {
        const user = await MemberModel.findById(userid);

        if (!user) {
            return Response.json(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        }

        const userTooltip: UserTooltipItem = {
            username: user.username,
            _id: user._id,
            designation: user.designation,
            image: user.image
        };
 
        return Response.json({
            success: true,
            user: userTooltip,
        }, { status: 201 });

    } catch (error) {
        console.log("An unexpected error occured!", error);

        return Response.json({
            success: false,
            message: 'Error occured while fetching member details'
        }, { status: 401 });
    }
}