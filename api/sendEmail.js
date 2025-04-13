const { PinpointClient, SendMessagesCommand } = require("@aws-sdk/client-pinpoint");

export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  // Parse the POST body for email details
  const { to, subject, message } = req.body;
  if (!to || !subject || !message) {
    res.status(400).json({ error: "Missing required email fields: to, subject, or message" });
    return;
  }

  // Initialize the AWS Pinpoint client using environment variables
  const client = new PinpointClient({
    region: process.env.AWS_REGION || "us-east-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });

  // Create the parameters for sending email via Pinpoint's SendMessagesCommand
  const params = {
    ApplicationId: process.env.AWS_PINPOINT_APP_ID,
    MessageRequest: {
      Addresses: {
        [to]: { ChannelType: "EMAIL" }
      },
      MessageConfiguration: {
        EmailMessage: {
          FromAddress: process.env.EMAIL_FROM_ADDRESS,
          SimpleEmail: {
            Subject: { Data: subject },
            HtmlPart: { Data: message }
          }
        }
      }
    }
  };

  try {
    const command = new SendMessagesCommand(params);
    const response = await client.send(command);
    res.status(200).json({ message: "Email sent successfully", response });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: error.message });
  }
}
