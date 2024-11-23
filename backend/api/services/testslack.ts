import { postToSlack } from './slack-api';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Test function to post a simple message
async function testPostToSlack() {
    const testMessage = {
        text: "Hello, Slack! This is a test message from the Sprint Summarizer. 🚀",
    };

    try {
        await postToSlack(testMessage);
        console.log("Test message sent successfully.");
    } catch (error) {
        console.error("Error sending test message:", error.message);
    }
}

// Call the test function
testPostToSlack();