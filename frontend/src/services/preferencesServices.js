import apiClient from './apiClient';

export async function getPreferences() {
  const response = await apiClient.get('/preferences');
  return response.data;
}

export async function updatePreferences(preferences) {
  await apiClient.post('/preferences', preferences);
}
