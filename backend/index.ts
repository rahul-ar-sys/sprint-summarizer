import { fetchSprintData, fetchHistoricalData } from './api/services/devrev-api';
import { postSummaryWithTrends, notifyBlockers } from './api/services/slack-api';
import { summarizeSprint } from './api/services/summarizer';
import { scheduleSummary } from './api/services/scheduler';

import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Generate and post a detailed sprint summary, including trends and real-time notifications.
 */
async function generateAndPostSummary() {
    try {
        // Fetch current sprint data
        const currentSprintData = await fetchSprintData();

        const historicalData = await fetchHistoricalData();

        const { structuredData, aiSummary } = await summarizeSprint(currentSprintData, historicalData);

        // Generate trend analysis based on historical data
        const trendAnalysis = generateTrendAnalysis(structuredData, historicalData);

        // Post summary with trends to Slack
        await postSummaryWithTrends(
            {
                ...structuredData,
                highlights: structuredData.highlights,
                blockers: structuredData.blockers,
            },
            {
                title: 'Sprint Trends',
                trendAnalysis,
            }
        );

        // Notify about critical blockers (if any)
        if (structuredData.blockers.length > 0) {
            await notifyBlockers(structuredData.blockers);
        }
    } catch (error) {
        console.error('Error generating and posting summary:', error);
    }
}

/**
 * Generate trend analysis from current and historical sprint data.
 * 
 * @param currentData Current sprint data.
 * @param historicalData Historical sprint data.
 * @returns A string summarizing trends.
 */
function generateTrendAnalysis(
    currentData: { completedTasks: number; totalTasks: number },
    historicalData: { completedTasks: number; totalTasks: number }[]
): string {
    const lastSprint = historicalData[historicalData.length - 1];
    const currentCompletionRate = (currentData.completedTasks / currentData.totalTasks) * 100;
    const lastCompletionRate = (lastSprint.completedTasks / lastSprint.totalTasks) * 100;

    const trendText = currentCompletionRate > lastCompletionRate
        ? `📈 Improvement: Completion rate increased to ${currentCompletionRate.toFixed(2)}% from ${lastCompletionRate.toFixed(2)}%.`
        : `📉 Decline: Completion rate decreased to ${currentCompletionRate.toFixed(2)}% from ${lastCompletionRate.toFixed(2)}%.`;

    return `
        - Current Sprint Completion Rate: ${currentCompletionRate.toFixed(2)}%
        - Last Sprint Completion Rate: ${lastCompletionRate.toFixed(2)}%
        ${trendText}
    `;
}

/**
 * Main entry point.
 */
function main() {
    console.log('Initializing Sprint Summarizer...');

    // Schedule weekly summaries
    scheduleSummary(generateAndPostSummary);

    // Optionally: Immediately generate and post a summary on start
    generateAndPostSummary().catch((error) => {
        console.error('Error during initial summary generation:', error);
    });
}

// Run the main function when the script is executed
main();
