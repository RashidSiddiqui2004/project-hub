import dbConnect from "@/lib/dbConnect"; 
import ProjectModel from "@/model/Project";
import { projectNameValidation } from "@/schemas/projectCreationSchema";
import { z } from "zod";

// zod use krenge to schema include krna is compulsory

const projectnameQuerySchema = z.object(
    {
        projectName: projectNameValidation // whatever validation we need, we can assign that here
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
        // extract query parameter
        // localhost:3000/api/cuu?username=rashid?phone=android?gender=male

        const { searchParams } = new URL(request.url);

        const queryParam = {
            projectName: searchParams.get("projectname")
        };

        // validation with zod => it needs an object, use dafeParse method
        const result = projectnameQuerySchema.safeParse(queryParam);

        if (!result?.success) {
            const grpNameErrors = result.error.format().projectName?._errors || [];

            return Response.json({
                success: false,
                message: grpNameErrors?.length > 0
                    ? grpNameErrors.join(', ')
                    : 'Invalid query parameters'
            }, { status: 400 });
        }

        // when everything is good 

        const { projectName } = result.data;

        const existingGroup = await ProjectModel.findOne({
            projectTitle:projectName
        })

        if (existingGroup) {
            return Response.json({
                success: false,
                message: 'GroupName already taken'
            }, { status: 400 });
        }

        return Response.json({
            success: true,
            message: 'GroupName is unique'
        }, { status: 201 });

    } catch (error) {
        console.error("Error checking GroupName", error);

        return Response.json({
            success: false,
            message: "Error checking GroupName",
        }, {
            status: 500
        });
    }
}