import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingData, RoastResult } from './types';

const KEYS = {
  onboarding: 'onboarding_data',
  history: 'roast_history',
  roastCount: 'daily_roast_count',
  lastRoastDate: 'last_roast_date',
  streak: 'streak_data',
} as const;

export async function getOnboarding(): Promise<OnboardingData | null> {
  const raw = await AsyncStorage.getItem(KEYS.onboarding);
  return raw ? JSON.parse(raw) : null;
}

export async function saveOnboarding(data: OnboardingData): Promise<void> {
  await AsyncStorage.setItem(KEYS.onboarding, JSON.stringify(data));
}

export async function getRoastHistory(): Promise<RoastResult[]> {
  const raw = await AsyncStorage.getItem(KEYS.history);
  return raw ? JSON.parse(raw) : [];
}

export async function addRoastToHistory(result: RoastResult): Promise<void> {
  const history = await getRoastHistory();
  const updated = [result, ...history].slice(0, 50);
  await AsyncStorage.setItem(KEYS.history, JSON.stringify(updated));
}

export async function getDailyRoastCount(): Promise<number> {
  const today = new Date().toDateString();
  const lastDate = await AsyncStorage.getItem(KEYS.lastRoastDate);
  if (lastDate !== today) {
    await AsyncStorage.setItem(KEYS.lastRoastDate, today);
    await AsyncStorage.setItem(KEYS.roastCount, '0');
    return 0;
  }
  const count = await AsyncStorage.getItem(KEYS.roastCount);
  return count ? parseInt(count, 10) : 0;
}

export async function incrementDailyRoastCount(): Promise<number> {
  const count = await getDailyRoastCount();
  const newCount = count + 1;
  await AsyncStorage.setItem(KEYS.roastCount, String(newCount));
  return newCount;
}

export async function getStreak(): Promise<number> {
  const raw = await AsyncStorage.getItem(KEYS.streak);
  if (!raw) return 0;
  const { count, lastDate } = JSON.parse(raw);
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (lastDate === today) return count;
  if (lastDate === yesterday) return count;
  return 0;
}

export async function updateStreak(): Promise<number> {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const raw = await AsyncStorage.getItem(KEYS.streak);
  let newCount = 1;
  if (raw) {
    const { count, lastDate } = JSON.parse(raw);
    if (lastDate === today) {
      newCount = count;
    } else if (lastDate === yesterday) {
      newCount = count + 1;
    }
  }
  await AsyncStorage.setItem(KEYS.streak, JSON.stringify({ count: newCount, lastDate: today }));
  return newCount;
}
