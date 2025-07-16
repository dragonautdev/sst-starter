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
  render,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import BaseEmail from "./base";
import { Email } from "@sst-starter/core/email";

type LoginCodeProps = typeof Email.Event.LoginCode.$output;

export const LoginCode = ({
  email,
  code,
}: LoginCodeProps) => {
  const previewText = "Here's your login code for SST Starter";

  return (
    <BaseEmail previewText={previewText} >
      <Text className="text-[14px] leading-[24px] text-left text-black  mx-auto">
        Please enter the code below to login to your account:
      </Text>
      <Text className="text-xl text-left font-400 mx-auto text-center bg-gray-100 p-4 rounded-md">
       {code}
      </Text>
      
    </BaseEmail>
  );
};

LoginCode.PreviewProps = {
  email: "john.doe@example.com",
  code: "123456",
} as LoginCodeProps;

export const LoginCodeHtml = async (props: LoginCodeProps) => {
  return render(<LoginCode {...props} />)
}

export const LoginCodeText = async (props: LoginCodeProps) => {
  return render(<LoginCode {...props} />, { plainText: true })
}

export default LoginCode;
