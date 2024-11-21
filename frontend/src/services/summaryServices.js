import apiClient from './apiClient';

export async function fetchSummary() {
  const response = await apiClient.get('/summary');
  return response.data;
}
