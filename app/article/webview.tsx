import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function ArticleWebView() {
  const router = useRouter();
  const { url } = useLocalSearchParams();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Назад</Text>
      </TouchableOpacity>

      {/* WebView */}
      <WebView
        source={{ uri: url as string }}
        startInLoadingState={true}
        renderLoading={() => <ActivityIndicator style={styles.loader} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    padding: 10,
    backgroundColor: '#f3f4f6',
  },
  backText: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
  },
});
