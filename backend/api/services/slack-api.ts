import axios from 'axios';

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

interface SprintData {
    completedTasks: number;
    inProgressTasks: number;
    blockedTasks: number;
    whatWentWell: string;
    whatWentWrong: string;
    retrospectiveInsights: string;
}

/**
 * Post a message to Slack with optional attachments and enhanced configurations.
 *
 * @param slackMessage The Slack message payload.
 */
export async function postToSlack(
    slackMessage: { text: string; attachments?: any[] }
) {
    try {
        await axios.post(SLACK_WEBHOOK_URL, slackMessage, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Message posted to Slack successfully.');
    } catch (error) {
        console.error('Error posting message to Slack:', error);
        throw error;
    }
}

/**
 * Sends a sprint summary to Slack via a webhook.
 * 
 * @param webhookUrl - The Slack webhook URL.
 * @param sprintData - The sprint data to include in the summary.
 */
export async function postSprintSummaryToSlack(webhookUrl: string, sprintData: SprintData): Promise<void> {
    const payload = {
        text: "🏁 *Sprint Summary* 🏁",
        blocks: [
            {
                type: "header",
                text: {
                    type: "plain_text",
                    text: "🚀 Sprint Overview"
                }
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*Completed Tasks:*\n${sprintData.completedTasks}`
                    },
                    {
                        type: "mrkdwn",
                        text: `*In-Progress Tasks:*\n${sprintData.inProgressTasks}`
                    },
                    {
                        type: "mrkdwn",
                        text: `*Blocked Tasks:*\n${sprintData.blockedTasks}`
                    }
                ]
            },
            {
                type: "divider"
            },
            {
                type: "header",
                text: {
                    type: "plain_text",
                    text: "✨ What Went Well"
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: sprintData.whatWentWell
                }
            },
            {
                type: "header",
                text: {
                    type: "plain_text",
                    text: "⚠️ What Went Wrong"
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: sprintData.whatWentWrong
                }
            },
            {
                type: "header",
                text: {
                    type: "plain_text",
                    text: "💡 Retrospective Insights"
                }
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: sprintData.retrospectiveInsights
                }
            }
        ]
    };

    try {
        const response = await axios.post(webhookUrl, payload);
        if (response.status === 200) {
            console.log('Sprint summary posted to Slack successfully.');
        } else {
            console.error('Failed to post to Slack. Status:', response.status);
        }
    } catch (error: any) {
        console.error('Error posting to Slack:', error.message);
    }
}

/**
 * Send real-time alerts for critical blockers.
 *
 * @param blockers List of critical blockers to notify.
 */
export async function notifyBlockers(blockers: string[]) {
    if (!blockers.length) return;

    const alertMessage = {
        text: `🚨 *Critical Blockers Detected*: \n${blockers.join('\n')}`,
    };

    try {
        await postToSlack(alertMessage);
        console.log('Blocker alerts sent successfully.');
    } catch (error) {
        console.error('Error sending blocker alerts:', error);
    }
}

/**
 * Post a scheduled summary with optional trend attachments.
 *
 * @param summary The sprint summary to post.
 * @param trendData Optional trend data for attachments.
 */
export async function postSummaryWithTrends(
    summary: { totalTasks: number; completedTasks: number; pendingTasks: number; highlights: string[]; blockers: string[] },
    trendData?: { title: string; trendAnalysis: string }
) {
    const summaryMessage = {
        text: `*Sprint Summary*:\n
        - Total Tasks: ${summary.totalTasks}
        - Completed Tasks: ${summary.completedTasks}
        - Pending Tasks: ${summary.pendingTasks}
        - Highlights: ${summary.highlights.join(', ')}
        - Blockers: ${summary.blockers.join(', ')}`,
        attachments: trendData
            ? [
                {
                    color: "#36a64f",
                    title: trendData.title,
                    text: trendData.trendAnalysis,
                },
            ]
            : [],
    };

    try {
        await postToSlack(summaryMessage);
        console.log('Sprint summary with trends posted successfully.');
    } catch (error) {
        console.error('Error posting summary with trends:', error);
    }
}

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
