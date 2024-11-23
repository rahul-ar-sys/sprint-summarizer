import { summarizeWithGoogleAI } from './gemini-api';
import { fetchSprintData, fetchHistoricalData } from './devrev-api';


async function summarizeSprint() {
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
        const prompt = JSON.stringify(structuredData, null, 2);
        const aiSummary = await summarizeWithGoogleAI(prompt);

        // Use the summarized data (e.g., post to Slack, save to database, etc.)
        console.log('AI Summary:', aiSummary);
    } catch (error) {
        console.error('Error summarizing sprint:', error);
    }
}

// Call the summarizeSprint function
summarizeSprint();

function calculateVelocity(tasks: any) {
    const completedTasks = tasks.filter((task: any) => task.status === 'completed');
    const totalStoryPoints = completedTasks.reduce((sum: number, task: any) => sum + (task.storyPoints || 0), 0);
    return totalStoryPoints;
}

function calculateTrends(historicalData: any, sprintData: any) {
    const trends = historicalData.map((sprint: any) => {
        return {
            sprint: sprint.name,
            velocity: sprint.tasks
                .filter((task: any) => task.status === 'completed')
                .reduce((sum: number, task: any) => sum + (task.storyPoints || 0), 0),
        };
    });

    // Add current sprint data to trends
    const currentSprintTrend = {
        sprint: sprintData.name,
        velocity: sprintData.tasks
            .filter((task: any) => task.status === 'completed')
            .reduce((sum: number, task: any) => sum + (task.storyPoints || 0), 0),
    };
    trends.push(currentSprintTrend);

    return trends;
}
