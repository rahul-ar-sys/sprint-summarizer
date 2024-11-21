import express from 'express';
import { getPreferences, updatePreferences, resetPreferences } from '../controllers/preferencesController';

const router = express.Router();

router.get('/', getPreferences); // Get current preferences
router.post('/', updatePreferences); // Update preferences
router.post('/reset', resetPreferences); // Reset preferences to defaults

export default router;
