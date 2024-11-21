import axios from 'axios';
import { fetchSprintData, fetchHistoricalData } from './api/services/devrev-api';
import { postToSlack } from './api/services/slack-api';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { ChartConfiguration } from 'chart.js';


// Summarizes the sprint using AI for insights, includes trend analysis, and posts it to Slack.
export async function summarizeSprint(currentSprintData: any, historicalData: any): Promise<{ structuredData: any, aiSummary: any }> {
    try {
        // Fetch current and historical sprint data
        const sprintData = await fetchSprintData();
        const historicalData = await fetchHistoricalData();

        // Structure sprint data
        const structuredData = {
            totalTasks: sprintData.tasks.length,
            completedTasks: sprintData.tasks.filter((task: any) => task.status === 'completed').length,
            pendingTasks: sprintData.tasks.filter((task: any) => task.status !== 'completed').length,
            blockers: sprintData.tasks
                .filter((task: any) => task.status === 'blocked')
                .map((task: any) => task.title),
            highlights: sprintData.tasks
                .filter((task: any) => task.status === 'completed')
                .map((task: any) => task.title),
            velocity: calculateVelocity(sprintData.tasks),
            historicalTrends: calculateTrends(historicalData, sprintData),
        };

        // Generate AI-based summary with insights
        const aiSummary = await generateSummaryWithAI(structuredData);

        // Generate trend analysis chart
        const trendChart = await generateTrendChart(structuredData.historicalTrends);

        // Post summary and trend chart to Slack
        const slackMessage = {
            text: `Sprint Summary:
            - Total Tasks: ${structuredData.totalTasks}
            - Completed Tasks: ${structuredData.completedTasks}
            - Pending Tasks: ${structuredData.pendingTasks}
            - Highlights: ${structuredData.highlights.join(', ')}
            - Blockers: ${structuredData.blockers.join(', ')}
            - Velocity: ${structuredData.velocity.toFixed(2)}
            
            AI-Generated Insights:
            ${aiSummary}`,
            attachments: [
                {
                    text: 'Trend Analysis',
                    image_url: trendChart,
                },
            ],
        };

        await postToSlack(slackMessage);
        return { structuredData, aiSummary };
    } catch (error) {
        console.error('Error summarizing sprint:', error);
        return { structuredData: null, aiSummary: 'Error generating summary' };
    }
}

// Generate AI-based summary of the sprint based on the provided structured data.

async function generateSummaryWithAI(structuredData: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    blockers: string[];
    highlights: string[];
    velocity: number;
    historicalTrends: any;
}): Promise<string> {
    const prompt = `
        Based on the following sprint data, provide a detailed summary with insights and recommendations:
        - Total Tasks: ${structuredData.totalTasks}
        - Completed Tasks: ${structuredData.completedTasks}
        - Pending Tasks: ${structuredData.pendingTasks}
        - Highlights: ${structuredData.highlights.join(', ')}
        - Blockers: ${structuredData.blockers.join(', ')}
        - Velocity: ${structuredData.velocity.toFixed(2)}
        - Historical Trends: ${JSON.stringify(structuredData.historicalTrends)}

        Insights and Recommendations:
    `;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/engines/davinci-codex/completions',
            {
                prompt,
                max_tokens: 300,
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error generating AI summary:', error);
        return 'Unable to generate AI summary at this time.';
    }
}

/**
 * Calculate team velocity.
 */
function calculateVelocity(tasks: any[]): number {
    const completed = tasks.filter((task) => task.status === 'completed').length;
    return completed / tasks.length || 0;
}


//Calculate historical trends.

function calculateTrends(historicalData: any[], currentData: any) {
    const trends = historicalData.map((sprint) => ({
        sprintName: sprint.name,
        velocity: calculateVelocity(sprint.tasks),
    }));

    // Add current sprint to trends
    trends.push({
        sprintName: 'Current Sprint',
        velocity: calculateVelocity(currentData.tasks),
    });

    return trends;
}

/**
 * Generate a trend analysis chart.
 */
async function generateTrendChart(trends: any) {
    const chartCanvas = new ChartJSNodeCanvas({ width: 800, height: 600 });
    const data = {
        labels: trends.map((trend: any) => trend.sprintName),
        datasets: [
            {
                label: 'Velocity',
                data: trends.map((trend: any) => trend.velocity),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
            },
        ],
    };

    const config: ChartConfiguration<'line'> = {
        type: 'line',
        data,
        options: {
            scales: {
                x: { title: { display: true, text: 'Sprints' } },
                y: { title: { display: true, text: 'Velocity' }, beginAtZero: true },
            },
        },
    };

    const chartBuffer = await chartCanvas.renderToBuffer(config);

    // Upload chart to an image hosting service or Slack as a file (optional)
    return `data:image/png;base64,${chartBuffer.toString('base64')}`;
}
