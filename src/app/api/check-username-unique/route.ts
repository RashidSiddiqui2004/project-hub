import dbConnect from "@/lib/dbConnect"; 
import MemberModel from "@/model/Member";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

// zod use krenge to schema include krna is compulsory

const usernameQuerySchema = z.object(
    {
        username: usernameValidation // whatever validation we need, we can assign that here
    }
)

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

        // validation with zod => it needs an object, use dafeParse method
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

        const existingverifiedUser = await MemberModel.findOne({
            username, isVerified: true
        })

        if (existingverifiedUser) {
            return Response.json({
                success: false,
                message: 'Username already taken'
            }, { status: 400 });
        }

        return Response.json({
            success: true,
            message: 'Username is unique'
        }, { status: 201 });

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