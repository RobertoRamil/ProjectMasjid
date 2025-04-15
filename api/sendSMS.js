//const { PinpointClient, SendMessagesCommand } = require("@aws-sdk/client-pinpoint");
import { PinpointClient, SendMessagesCommand } from "@aws-sdk/client-pinpoint";

export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  // Parse the POST body for SMS details
  const { to, message } = req.body;
  if (!to || !message) {
    res.status(400).json({ error: "Missing required SMS fields: to or message" });
    return;
  }

  // Initialize the AWS Pinpoint client using environment variables
  const client = new PinpointClient({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });

  // Create the parameters for sending SMS
  const params = {
    ApplicationId: process.env.AWS_PINPOINT_APP_ID,
    MessageRequest: {
      Addresses: {
        [to]: { ChannelType: "SMS" }
      },
      MessageConfiguration: {
        SMSMessage: {
          Body: message,
          MessageType: "TRANSACTIONAL",  // Could also be PROMOTIONAL if needed
          // Optionally set a sender ID via an environment variable
          SenderId: process.env.SMS_SENDER_ID || "YourSenderID"
        }
      }
    }
  };

  try {
    const command = new SendMessagesCommand(params);
    const response = await client.send(command);
    res.status(200).json({ message: "SMS sent successfully", response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
