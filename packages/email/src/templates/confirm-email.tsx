import {
  render,
  Text,
} from "@react-email/components";
import BaseEmail from "./base";
import { Email } from "@sst-starter/core/email";

type ConfirmEmailProps = typeof Email.Event.ConfirmEmail.$output;

export const ConfirmEmail = ({
  email,
  code,
}: ConfirmEmailProps) => {
  const previewText = "Here's your verification code for SST Starter";

  return (
    <BaseEmail previewText={previewText} >
      <Text className="text-[14px] leading-[24px] text-left text-black  mx-auto">
        Please enter the code below to verify your email:
      </Text>
      <Text className="text-xl text-left font-400 mx-auto text-center bg-gray-100 p-4 rounded-md">
       {code}
      </Text>
      
    </BaseEmail>
  );
};

ConfirmEmail.PreviewProps = {
  email: "john.doe@example.com",
  code: "123456",
} as ConfirmEmailProps;

export const ConfirmEmailHtml = async (props: ConfirmEmailProps) => {
  return render(<ConfirmEmail {...props} />)
}

export const ConfirmEmailText = async (props: ConfirmEmailProps) => {
  return render(<ConfirmEmail {...props} />, { plainText: true })
}

export default ConfirmEmail;
