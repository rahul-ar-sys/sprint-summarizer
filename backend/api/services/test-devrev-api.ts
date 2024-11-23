import { fetchSprintData } from './devrev-api';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function testFetchSprintData() {
    try {
        const sprintData = await fetchSprintData();
        console.log('Sprint Data:', JSON.stringify(sprintData, null, 2));
    } catch (error) {
        console.error('Error fetching sprint data:', error);
    }
}

// Call the test function
testFetchSprintData();