'use client';

import { UploadButton } from "@/utils/uploadthing";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

const ImageUpload = () => {
    const { data: session } = useSession();
    const user = session?.user;
    const [imageURL, setImageURL] = useState<string>(user?.image || 'https://utfs.io/f/a15857e8-68d3-4ba7-bd8e-7834df2f7937-2558r.png');

    return (
        <div>

            {imageURL ? (
                <div className="flex flex-col items-center justify-center">
                    <div className="relative rounded-full overflow-hidden w-32 h-32 mb-4">
                        <Image
                            src={imageURL}
                            alt="profile image"
                            width={120}
                            height={120}
                            layout="responsive"
                        />
                    </div>
                    <p className="text-white text-lg mb-2">{user?.username}</p>
                    <p className="text-gray-200 text-sm">{user?.email}</p>
                    <p className="text-gray-200 text-sm"> {user?.organisation}</p>
                </div>
            ) : null}

            <UploadButton
                endpoint='imageUploader' 
                className="flex flex-col justify-center items-center text-center
                 border-2 my-6 mx-[40vw] text-white"
                onClientUploadComplete={async (res) => {
                    const uploadedImageURL = res[0].url;
                    setImageURL(uploadedImageURL);
                    await axios.post('/api/update-profile-image', { uploadedImageURL });
                }}
                onUploadError={(error: Error) => {
                    console.log(`ERROR! ${error.message}`);
                }}
            />


        </div>
    );
};

export default ImageUpload;
