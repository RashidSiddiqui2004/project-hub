import { User, getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { authOptions } from "../auth/[...nextauth]/options"; 

const f = createUploadthing();

// Authentication middleware
const auth = async (req: Request) => {
    const session = await getServerSession(authOptions);
    const user = session?.user as User | null;

    if (!session || !user) {
        throw new UploadThingError("Unauthorized");
    }

    return user;
};

export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: "4MB" } })
        .middleware(async ({ req }) => {
            const user = await auth(req);

            if (!user) throw new UploadThingError("Unauthorized");

            return { userId: user._id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId);
            console.log("file url", file.url);
            return { uploadedBy: metadata.userId, imageUrl: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;