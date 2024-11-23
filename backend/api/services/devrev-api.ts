import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Fetch current sprint data.
 */
export async function fetchSprintData() {
    try {
        if (process.env.USE_MOCK_DATA === 'true') {
            const filePath = path.resolve(__dirname, '../../fixtures/function_1_event.json');
            const data = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(data);
        } else {
            const response = await axios.get('https://api.example.com/sprint-data');
            return response.data;
        }
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
