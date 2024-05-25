import { Html, Head, Font, Preview, Heading, Row, Section, Text, Button } from "@react-email/components";

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (

        <Html lang="en" dir="ltr">
            <Head>
                <title>Verification Code for JIRA - PM Tool</title>
                <Font
                    fontFamily="Roboto"
                    fallbackFontFamily="Verdana"
                    webFont={{
                        url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
                        format: 'woff2',
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>
            <Preview>Here's your verification code: {otp}</Preview>
            <Section>
                <Row>
                    <Heading as="h2">Hello {username},</Heading>
                </Row>
                <Row>
                    <Text>
                        Welcome to JIRA - PM Tool! Thank you for registering. Please use the following verification code to complete your registration:
                    </Text>
                </Row>
                <Row>
                    <Text>{otp}</Text>
                </Row>
                <Row>
                    <Text>
                        If you did not request this code, please ignore this email.
                    </Text>
                </Row>
                <Row>
                    <Text>
                        For any questions or assistance, feel free to reach out to us. We're here to help you manage your projects smoothly and effectively.
                    </Text>
                </Row>
                <Row>
                    <Text>
                        Best regards,
                        <br />
                        The JIRA - PM Tool Team
                    </Text>
                </Row>
                <Row>
                    <Text>
                        Contact Us:
                        <br />
                        - Support Email: [Support Email Address]
                        <br />
                        - Website: [App Website]
                        <br />
                        - Phone: [Support Phone Number]
                    </Text>
                </Row>
                <Row>
                    <Text>
                        <br />
                        Note: This is an automated email. Please do not reply directly to this message.
                    </Text>
                </Row>
                <Row>
                    <Text>
                        <br />
                        Privacy Notice: Your privacy is important to us. Learn more about how we protect your information by visiting our <a href="[Privacy Policy URL]">Privacy Policy</a>.
                    </Text>
                </Row>
            </Section>
        </Html>

    );
}
