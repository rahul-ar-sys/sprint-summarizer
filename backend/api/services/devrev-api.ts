import axios from 'axios';

/**
 * Fetch current sprint data.
 */
export async function fetchSprintData() {
    try {
        const response = await axios.get('https://api.example.com/sprint-data');
        return response.data;
    } catch (error) {
        console.error('Error fetching sprint data:', error);
        throw error;
    }
}

/**
 * Fetch historical sprint data for trend analysis.
 */
export async function fetchHistoricalData() {
    try {
        const response = await axios.get('https://api.example.com/historical-sprint-data');
        return response.data;
    } catch (error) {
        console.error('Error fetching historical sprint data:', error);
        throw error;
    }
}

/**
 * Fetch custom sprint metrics based on user preferences.
 * @param metrics List of metrics to fetch, e.g., ['velocity', 'completion_rate'].
 */
export async function fetchCustomMetrics(metrics: string[]) {
    try {
        const response = await axios.post('https://api.example.com/custom-metrics', {
            metrics,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching custom metrics:', error);
        throw error;
    }
}

/**
 * Fetch blockers for real-time notifications.
 */
export async function fetchBlockers() {
    try {
        const response = await axios.get('https://api.example.com/blockers');
        return response.data;
    } catch (error) {
        console.error('Error fetching blockers:', error);
        throw error;
    }
}
