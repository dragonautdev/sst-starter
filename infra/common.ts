import { dns, domain } from "./dns"

export const BUILD_ID = Date.now().toString()

export const urls = new sst.Linkable('Urls', {
  properties: {
    api: `https://trpc.${domain}`,
    app: $dev ? 'http://localhost:3000' : `https://app.${domain}`,
    auth: `https://auth.${domain}`,
  }
})

export const emailSender = $app.stage === 'prod' ? new sst.aws.Email('EmailSender', {
  sender: 'sst-starter@example.com',
  transform: {
    identity: {
      tags: {
        project: $app.name,
        stage: $app.stage,
        service: 'email',
      }
    }
  }
}) : sst.aws.Email.get('EmailSender', 'sst-starter@example.com')
