import { PinpointClient } from "@aws-sdk/client-pinpoint";

// Set the AWS Region.
const REGION = "us-east-2"; // Change this to your region

// Create the Pinpoint client instance
export const pinClient = new PinpointClient({ region: REGION });
