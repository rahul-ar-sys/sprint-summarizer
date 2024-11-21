import { Request, Response } from 'express-serve-static-core';
import fs from 'fs';
import path from 'path';

// Path to the preferences file (for simplicity, using JSON for storage)
const PREFERENCES_FILE = path.join(__dirname, '../data/userPreferences.json');

/**
 * Get user preferences.
 */
export const getPreferences = (req: Request, res: Response) => {
    try {
        if (!fs.existsSync(PREFERENCES_FILE)) {
            return res.status(200).json({
                message: 'Default preferences loaded.',
                preferences: { includeVelocity: true, includeBlockers: true, includeHighlights: true },
            });
        }

        const preferences = JSON.parse(fs.readFileSync(PREFERENCES_FILE, 'utf-8'));
        res.status(200).json({ preferences });
    } catch (error) {
        console.error('Error reading preferences:', error);
        res.status(500).json({ error: 'Failed to fetch preferences.' });
    }
};

/**
 * Update user preferences.
 */
export const updatePreferences = (req: Request, res: Response) => {
    const newPreferences = req.body;

    // Validate preferences
    if (
        typeof newPreferences.includeVelocity !== 'boolean' ||
        typeof newPreferences.includeBlockers !== 'boolean' ||
        typeof newPreferences.includeHighlights !== 'boolean'
    ) {
        return res.status(400).json({ error: 'Invalid preferences format.' });
    }

    try {
        fs.writeFileSync(PREFERENCES_FILE, JSON.stringify(newPreferences, null, 2));
        res.status(200).json({ message: 'Preferences updated successfully.' });
    } catch (error) {
        console.error('Error saving preferences:', error);
        res.status(500).json({ error: 'Failed to save preferences.' });
    }
};

/**
 * Reset preferences to default values.
 */
export const resetPreferences = (req: Request, res: Response) => {
    const defaultPreferences = { includeVelocity: true, includeBlockers: true, includeHighlights: true };

    try {
        fs.writeFileSync(PREFERENCES_FILE, JSON.stringify(defaultPreferences, null, 2));
        res.status(200).json({ message: 'Preferences reset to default.', preferences: defaultPreferences });
    } catch (error) {
        console.error('Error resetting preferences:', error);
        res.status(500).json({ error: 'Failed to reset preferences.' });
    }
};
