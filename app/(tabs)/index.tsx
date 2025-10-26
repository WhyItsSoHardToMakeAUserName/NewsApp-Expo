import NewsCard from "@/components/news-card";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useInfiniteQuery } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Article = {
  url: string;
  urlToImage?: string;
  title: string;
  description?: string;
  publishedAt: string;
};

type NewsResponse = {
  articles: Article[];
};

export default function HomeScreen() {
  const isFirstFetch = useRef(true);
  const apiKey = process.env.EXPO_PUBLIC_NEWS_API_KEY;
  const apiBaseUrl = "https://newsapi.org/v2/everything?";
  usePushNotifications();

  const [query, setQuery] = useState("technology");
  const [searchText, setSearchText] = useState(query);

  const handleSearch = () => {
    setQuery(searchText);
    refetch();
  };

  const fetchNews = async ({ pageParam = new Date().toISOString() }): Promise<NewsResponse> => {
    const res = await fetch(
      `${apiBaseUrl}q=${encodeURIComponent(query)}&sortBy=publishedAt&to=${pageParam}&pageSize=20&apiKey=${apiKey}`
    );
    return res.json();
  };

  const { data, isLoading, fetchNextPage, hasNextPage,refetch, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
    initialPageParam: new Date().toISOString(),
    getNextPageParam: (lastPage) => {
      const articles = lastPage?.articles || [];
      if (articles.length === 0) return undefined;
      return articles[articles.length - 1].publishedAt;
    },
  });

  useEffect(() => {
    if (isFirstFetch.current) {
      isFirstFetch.current = false;
      return;
    }

    Notifications.scheduleNotificationAsync({
      content: {
        title: "New article!",
        body: "Check out the latest news.",
      },
      trigger: null,
    })
  }, [data]);

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 10 }}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search news..."
          onSubmitEditing={handleSearch}
          style={styles.searchInput}
          returnKeyType="search"
        />
      </View>

      {/* News list */}
      <FlatList
        data={data?.pages.flatMap((page) => page.articles) || []}
        keyExtractor={(item, index) => (item?.url ? item.url : index.toString())}
        renderItem={({ item }) => (
          <NewsCard
            urlToImage={item?.urlToImage ?? "https://placehold.co/600x400"}
            title={item.title}
            description={item.description}
            publishedAt={item.publishedAt}
            url={item.url}
          />
        )}
        ListFooterComponent={isLoading || isFetchingNextPage ? <ActivityIndicator /> : null}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.3}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
});