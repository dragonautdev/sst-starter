import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import React from "react";

interface BaseEmailProps {
  children: React.ReactNode;
  previewText?: string;
  footer?: React.ReactNode;
}

export const BaseEmail = ({
  children,
  previewText,
  footer,
}: BaseEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans bg-[#f4f4f4] w-full h-full m-0 p-0">
          {previewText && <Preview>{previewText}</Preview>}
          <Container className="w-full mb-4 w-full max-w-full">
            <Section className="bg-white max-w-[600px] px-4">
              {children}
            </Section>
          </Container>
          <Container className="w-full max-w-full">
            <Section className="bg-white max-w-[600px] rounded-md">
              <Heading className="text-center text-black  mx-auto font-normal text-lg">
                Need help?
              </Heading>
              <Text className="text-center text-black  mx-auto font-normal text-lg">
                <Link
                  href="mailto:sst-starter@example.com"
                  className="text-indigo-700"
                >
                  We're here, ready to talk
                </Link>
              </Text>
            </Section>
          </Container>

          <Container className="w-full max-w-full px-4">
            <Section className="max-w-[600px] text-left text-gray-500">
              {footer ?? 'You received this email because you signed up for an account on sst-starter.example.com. If you did not sign up for an account, you can safely delete this email.'}
            </Section>
          </Container>

          <Container className="w-full max-w-full px-4">
            <Section className="max-w-[600px] text-left text-gray-500">
              <Text className="">
                SST Starter - Licensed under MIT
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

BaseEmail.PreviewProps = {
  children: "Another text",
} as BaseEmailProps;

export default BaseEmail;
