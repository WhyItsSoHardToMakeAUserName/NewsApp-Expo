import NewsCard from "@/components/news-card";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { ActivityIndicator, FlatList } from "react-native";
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
  const apiKey = process.env.EXPO_PUBLIC_NEWS_API_KEY;
  const apiBaseUrl = "https://newsapi.org/v2/everything?";

  const fetchNews = async ({ pageParam = new Date().toISOString() }): Promise<NewsResponse> => {
    const res = await fetch(
      `${apiBaseUrl}q=technology&sortBy=publishedAt&to=${pageParam}&pageSize=20&apiKey=${apiKey}`
    );
    return res.json();
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
    initialPageParam: new Date().toISOString(),
    getNextPageParam: (lastPage) => {
      const articles = lastPage?.articles || [];
      if (articles.length === 0) return undefined;
      return articles[articles.length - 1].publishedAt;
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 10 }}>
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
