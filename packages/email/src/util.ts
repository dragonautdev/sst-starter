import { SendEmailCommandInput, SES } from "@aws-sdk/client-ses";
import { Resource } from "sst";

interface SendEmailInput {
  from?: string;
  to: string[];
  bcc?: string[];
  subject: string;
  html?: string;
  text?: string;
}

export const sendEmail = async (input: SendEmailInput) => {
  const { to, subject, html, text, bcc } = input;

  const ses = new SES();

  const params: SendEmailCommandInput = {
    Source: `SST Starter <${Resource.EmailSender.sender}>`,
    Destination: {
      ToAddresses: to,
      BccAddresses: bcc,
    },
    Message: {
      Subject: { Data: subject },
      Body: {
        Html: { Data: html },
        Text: { Data: text },
      },
    },
  };

  await ses.sendEmail(params);
};
