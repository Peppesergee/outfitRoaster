import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRoastHistory } from '@/lib/storage';
import { Colors } from '@/constants/colors';
import { RoastResult } from '@/lib/types';
import { useLanguage } from '@/lib/LanguageContext';
import HistoryItem from '@/components/HistoryItem';

export default function HistoryScreen() {
  const { t } = useLanguage();
  const [history, setHistory] = useState<RoastResult[]>([]);

  useFocusEffect(
    useCallback(() => {
      getRoastHistory().then(setHistory);
    }, [])
  );

  function handleItemPress(item: RoastResult) {
    router.push({ pathname: '/result', params: { data: JSON.stringify(item) } });
  }

  async function clearHistory() {
    Alert.alert(t.clearTitle, t.clearBody, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.delete,
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('roast_history');
          setHistory([]);
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0D0D1A', '#16213E']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <Text style={styles.title}>{t.myRoasts}</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={clearHistory}>
            <Text style={styles.clearBtn}>{t.clearAll}</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>👗</Text>
          <Text style={styles.emptyTitle}>{t.noRoastsTitle}</Text>
          <Text style={styles.emptyBody}>{t.noRoastsBody}</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HistoryItem item={item} onPress={() => handleItemPress(item)} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text },
  clearBtn: { fontSize: 14, color: Colors.primary },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  emptyBody: { fontSize: 15, color: Colors.textMuted, textAlign: 'center', lineHeight: 22 },
});
