export const userPreferences = {
    includeVelocity: true,         // Include velocity metrics in the summary
    includeBlockers: true,         // Include blockers in the summary
    includeHighlights: true,       // Include task highlights in the summary
    includeTrendAnalysis: true,    // Include trend analysis in the summary
    includePerformanceMetrics: true, // Show detailed team performance metrics
    includeForecast: false,        // Include sprint forecast predictions
    notificationPreferences: {
        enableBlockerAlerts: true, // Send real-time notifications for blockers
        alertThreshold: 2,        // Minimum number of blockers to trigger notifications
    },
    reportSchedule: 'weekly',      // Options: 'daily', 'weekly', 'bi-weekly'
    preferredTime: '09:00 AM',     // Preferred time for report generation
};
