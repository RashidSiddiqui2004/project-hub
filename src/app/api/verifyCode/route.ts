import dbConnect from "@/lib/dbConnect"; 
import MemberModel from "@/model/Member";

export async function POST(request: Request) {

    await dbConnect();

    try {
        const { username, code } = await request.json();

        const decodedusername = decodeURIComponent(username);

        const matchedUser = await MemberModel.findOne({
            username: decodedusername
        })

        if (!matchedUser) {
            return Response.json({
                success: false,
                message: "User not found!",
            }, {
                status: 500
            });
        }

        const isCodevalid = matchedUser.verifyCode === code;

        // expired or not

        const isCodeNotexpired = new Date(matchedUser.verifyCodeExpiry) > new Date();

        if (!isCodevalid) {
            return Response.json({
                success: false,
                message: "Wrong Verification code",
            }, {
                status: 500
            });
        }

        if (!isCodeNotexpired) {
            return Response.json({
                success: false,
                message: "Verification code expired!",
            }, {
                status: 500
            });
        }

        matchedUser.isVerified = true;
        await matchedUser.save();

        return Response.json({
            success: true,
            message: "Verified user successfully",
        }, {
            status: 200
        });

    } catch (error) {
        console.error("Error verifying user", error);
        return Response.json({
            success: false,
            message: "Error verifying user",
        }, {
            status: 500
        });
    }
}