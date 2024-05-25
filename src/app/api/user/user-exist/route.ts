
import dbConnect from "@/lib/dbConnect";
import MemberModel from "@/model/Member";
import { usernameValidation } from "@/schemas/signUpSchema";
import { MatchedUserInterface } from "@/types/ApiResponse";
import { z } from "zod";

const usernameQuerySchema = z.object(
    {
        username: usernameValidation // whatever validation we need, we can assign that here
    }
)

// route to get all user whose username starts with this string

export async function GET(request: Request) {

    if (request.method !== "GET") {
        return Response.json(
            {
                success: false,
                message: "Only GET method is allowed!"
            },
            {
                status: 405
            }
        )
    }

    await dbConnect();

    try {

        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username")
        };

        const result = usernameQuerySchema.safeParse(queryParam);

        if (!result?.success) {
            const usernameErrors = result.error.format().username?._errors || [];

            return Response.json({
                success: false,
                message: usernameErrors?.length > 0
                    ? usernameErrors.join(', ')
                    : 'Invalid query parameters'
            }, { status: 400 });
        }

        // when everything is good 

        const { username } = result.data;

        const matchingUsers = await MemberModel.find({
            username: { $regex: `^${username}`, $options: 'i' }, // Case-insensitive matching
            isVerified: true
        }); 
        const matchingMembers: MatchedUserInterface[] = [];

        for (let index = 0; index < matchingUsers.length; index++) {
            const { _id, username } = matchingUsers[index];
            const member: MatchedUserInterface = { _id, username };
            matchingMembers.push(member);
        }

        if (matchingMembers) {
            // console.log(matchingMembers);

            return Response.json({
                success: true,
                message: 'Username found',
                matchedUsers: matchingMembers
            }, { status: 201 });
        }

        return Response.json({
            success: true,
            message: 'No user found',
            matchedUsers: matchingMembers
        }, { status: 400 });

    } catch (error) {
        console.error("Error checking username", error);

        return Response.json({
            success: false,
            message: "Error checking username",
        }, {
            status: 500
        });
    }
}