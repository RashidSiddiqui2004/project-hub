import { resend } from '@/lib/resend';
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
    email: string,
    username: string,
    otp: string,
): Promise<ApiResponse> {
    // error aayega initially because koi object return nhi kiya

    try {

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Mystery Message | Verification code",
            react: VerificationEmail({ username, otp }),
        })
        return {
            success: true,
            message: "Verification Mail sent..",
            description: "Verification email sent successfully..",
        }
    } catch (emailError) {
        console.log("Error sending Verification email",
            emailError
        );

        return {
            success: false,
            message: "Failed to send email",
            description: "Verification Email send failed..",
        }
    }

}