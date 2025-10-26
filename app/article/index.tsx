import { File, Paths } from "expo-file-system";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ArticleScreen() {
  const router = useRouter();
  const { title, description, urlToImage, publishedAt, url } = useLocalSearchParams();

  // Поделиться статьёй
  const handleShare = async () => {
    try {
      const content = `${title}\n\n${description}\n\nЧитать: ${url}`;
      const fileName = `${title?.toString().slice(0, 30) || "article"}.txt`;

      const file = new File(Paths.cache, fileName);

      await file.write(content);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, {
          dialogTitle: "Поделиться статьёй",
          mimeType: "text/plain",
          UTI: "public.text",
        });
      } else {
        Alert.alert("Недоступно", "Функция шаринга недоступна на этом устройстве.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Ошибка", "Не удалось поделиться статьёй.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Назад</Text>
      </TouchableOpacity>

      {urlToImage ? (
        <Image source={{ uri: urlToImage as string }} style={styles.image} />
      ) : null}

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.date}>{publishedAt}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#34d399" }]}
          onPress={() => router.push({ pathname: "/article/webview", params: { url } })}
        >
          <Text style={styles.buttonText}>Открыть полную страницу</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#fbbf24" }]}
          onPress={handleShare}
        >
          <Text style={styles.buttonText}>Поделиться</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#fff",
    flex: 1,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    fontSize: 16,
    color: "#3b82f6",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  date: {
    color: "#999",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
  },
  buttonRow: {
    marginTop: 20,
    gap: 10,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
