import axios from "axios";

/**
 * Post a message to Slack with optional attachments and enhanced configurations.
 *
 * @param slackMessage The Slack message payload.
 */
export async function postToSlack(
    slackMessage: { text: string; attachments?: any[] }
) {
    const webhookUrl = 'https://hooks.slack.com/services/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';

    try {
        await axios.post(webhookUrl, slackMessage, {
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