import Constants from 'expo-constants';
import { RoastApiResponse, RoastLanguage, RoastTone } from './types';

const API_URL = Constants.expoConfig?.extra?.apiUrl ?? 'http://localhost:3000';

interface RoastRequest {
  image: string;
  tone: RoastTone;
  intensity: number;
  language: RoastLanguage;
  deviceId: string;
}

export async function submitRoast(req: RoastRequest): Promise<RoastApiResponse> {
  const response = await fetch(`${API_URL}/api/roast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    return { success: false, error: error.message ?? 'Request failed' };
  }

  return response.json();
}
