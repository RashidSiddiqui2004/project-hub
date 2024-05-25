
import dbConnect from "@/lib/dbConnect";
import ProjectModel, { TaskItem } from "@/model/Project";

export async function PUT(request: Request) {
    await dbConnect();

    try {
        const { projectId, projectTitle, projectDescription, githubRepo, organisation, deadline } = await request.json();

        const existingProject = await ProjectModel.findById(projectId);

        if (!existingProject) {
            return Response.json({
                success: false,
                message: "Project not found"
            }, { status: 404 });
        }
 
        existingProject.projectTitle = projectTitle;
        existingProject.projectDescription = projectDescription;
        existingProject.githubRepo = githubRepo;
        existingProject.organisation = organisation;
        existingProject.deadline = deadline;

        await existingProject.save();

        return Response.json({
            success: true,
            message: "Project updated successfully"
        }, { status: 200 });

    } catch (error) {
        console.log("An unexpected error occurred!", error);

        return Response.json({
            success: false,
            message: 'Internal Server Error'
        }, { status: 500 });
    }
}
