import React, { useState, useEffect } from 'react';
import { getPreferences, updatePreferences } from '../services/preferencesService';
import { toast } from 'react-toastify';

const PreferencesForm = () => {
  const [preferences, setPreferences] = useState({
    includeVelocity: true,
    includeBlockers: true,
    includeHighlights: true,
  });

  useEffect(() => {
    async function fetchPreferences() {
      const data = await getPreferences();
      setPreferences(data);
    }
    fetchPreferences();
  }, []);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePreferences(preferences);
      toast.success('Preferences updated successfully!');
    } catch (error) {
      toast.error('Error updating preferences.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>User Preferences</h2>
      <label>
        <input
          type="checkbox"
          name="includeVelocity"
          checked={preferences.includeVelocity}
          onChange={handleChange}
        />
        Include Velocity
      </label>
      <label>
        <input
          type="checkbox"
          name="includeBlockers"
          checked={preferences.includeBlockers}
          onChange={handleChange}
        />
        Include Blockers
      </label>
      <label>
        <input
          type="checkbox"
          name="includeHighlights"
          checked={preferences.includeHighlights}
          onChange={handleChange}
        />
        Include Highlights
      </label>
      <button type="submit">Save Preferences</button>
    </form>
  );
};

export default PreferencesForm;
