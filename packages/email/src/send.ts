import { bus } from "sst/aws/bus";
import { Email } from "@sst-starter/core/email";
import { sendEmail } from "./util";
import { Resource } from "sst";

/**
 * Modifies the email's recipients if we are not in prod.
 * @param email 
 * @returns {string[]} The email's recipients
 */
const getEmailTo = (email: string | string[]): string[]=> {
  if (Resource.App.stage !== 'prod') {
    return ['test@example.com']
  }

  return Array.isArray(email) ? email : [email]
}

const bccRecipients = (): string[] | undefined => {
  if (Resource.App.stage === 'prod') {
    return undefined
  }

  return [Resource.EmailSender.sender]
}

/**
 * Modifies the email's subject if we are not in prod.
 * @param subject 
 * @returns {string} The email's subject
 */
const getEmailSubject = (subject: string) => {
  if (Resource.App.stage !== 'prod') {
    return `[${Resource.App.name}][${Resource.App.stage}] ${subject}`
  }

  return subject
}

export const handler = bus.subscriber(
  [
    Email.Event.ConfirmEmail,
    Email.Event.LoginCode,
  ],
  async (event) => {
    let emailHtml: string | undefined;
    let emailText: string | undefined;


    switch (event.type) {
      case Email.Event.ConfirmEmail.type: {
        const emailSettings = await import('./templates/confirm-email');
        emailHtml = await emailSettings.ConfirmEmailHtml(event.properties);
        emailText = await emailSettings.ConfirmEmailText(event.properties);

        await sendEmail({
          to: getEmailTo(event.properties.email),
          subject: getEmailSubject("Please verify your email"),
          html: emailHtml,
          text: emailText,
        });
        break;
      }
      case Email.Event.LoginCode.type: {  
        const emailSettings = await import('./templates/login-code');
        emailHtml = await emailSettings.LoginCodeHtml(event.properties);
        emailText = await emailSettings.LoginCodeText(event.properties);

        await sendEmail({
          to: getEmailTo(event.properties.email),
          subject: getEmailSubject("Here's your login code for SST Starter"),
          html: emailHtml,
          text: emailText,
        });
        break;
      }
      default:
        break;
    }
  },
);
