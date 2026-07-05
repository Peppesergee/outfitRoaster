import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { getOnboarding } from '@/lib/storage';
import { Colors } from '@/constants/colors';

export default function Entry() {
  useEffect(() => {
    (async () => {
      const data = await getOnboarding();
      if (data?.completed) {
        router.replace('/(main)');
      } else {
        router.replace('/onboarding');
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.dark, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color={Colors.primary} />
    </View>
  );
}
