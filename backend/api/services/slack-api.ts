import axios from "axios";

/**
 * Post a message to Slack with optional attachments and enhanced configurations.
 *
 * @param slackMessage The Slack message payload.
 * @param slackChannel The Slack channel to post the message to (defaults to environment variable or 'general').
 * @param slackToken The Slack token for authentication (defaults to environment variable).
 */
export async function postToSlack(
    slackMessage: { text: string; attachments?: any[] },
    slackChannel: string = process.env.SLACK_CHANNEL || 'general', // Default to 'general' if not provided
    slackToken: string = process.env.SLACK_TOKEN || ''
) {
    const webhookUrl = `https://hooks.slack.com/services/${slackToken}`;

    // Ensure Slack message includes the channel
    const messagePayload = {
        channel: slackChannel,
        ...slackMessage,
    };

    try {
        await axios.post(webhookUrl, messagePayload, {
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
 * Send real-time alerts for critical blockers.
 *
 * @param blockers List of critical blockers to notify.
 */
export async function notifyBlockers(blockers: string[]) {
    if (!blockers.length) return;

    const slackToken = process.env.SLACK_TOKEN || '';
    const slackChannel = process.env.SLACK_CHANNEL || 'alerts';

    const alertMessage = {
        text: `🚨 *Critical Blockers Detected*: \n${blockers.join('\n')}`,
    };

    try {
        await postToSlack(alertMessage, slackChannel, slackToken);
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
    const slackToken = process.env.SLACK_TOKEN || '';
    const slackChannel = process.env.SLACK_CHANNEL || 'general';

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
        await postToSlack(summaryMessage, slackChannel, slackToken);
        console.log('Sprint summary with trends posted successfully.');
    } catch (error) {
        console.error('Error posting summary with trends:', error);
    }
}


