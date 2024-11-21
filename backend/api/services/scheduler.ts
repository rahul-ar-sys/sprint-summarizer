import { summarizeSprint } from './summarizer';


export function scheduleSummary(callback: () => void) {

    const cron = require('node-cron');

    cron.schedule('0 9 * * 1', () => {

        console.log('Running the weekly summary');

        callback();

    });

}
