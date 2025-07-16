import { PublishCommand, SNSClient } from "@aws-sdk/client-sns"

export module SNS {

  export const send = async (topic: string, message: any) => {
    try {
    const sns = new SNSClient()

    const command = new PublishCommand({
      TopicArn: topic,
      Message: JSON.stringify(message),
      Subject: `${topic} :: ${new Date().toISOString()}`
    })

    await sns.send(command)
    } catch (error) {
      console.error(error)
    }
  }
}