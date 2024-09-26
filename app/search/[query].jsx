import React, { useEffect, useState } from "react";
import { FlatList, Image, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../components/EmptyState";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import VideoCard from "../../components/VideoCard";
import { images } from "../../constants";
import useRapidApi from "../../lib/useRapidApi";
import { searchPost } from "../../lib/appwrite";
import { useLocalSearchParams } from "expo-router";
import useAppwrite from "../../lib/useAppwrite";

const Search = () => {
  const { query } = useLocalSearchParams();
  const {
    data: posts,
    isLoading,
    refetch,
  } = useAppwrite(() => searchPost(query));

  useEffect(() => {
    refetch();
  }, [query]);

  const arrayOfObjects = [];

  const originalObject = {
    id: 1,
    title: "",
    image:
      "https://m.media-amazon.com/images/M/MV5BOGRmYjZjMDUtNGFjYS00ZmMyLWJkYTAtODQ5ZWYyMTJiZGY2XkEyXkFqcGdeQXVyMTY3ODkyNDkz._V1_.jpg",
    thumbnail:
      "https://m.media-amazon.com/images/M/MV5BOGRmYjZjMDUtNGFjYS00ZmMyLWJkYTAtODQ5ZWYyMTJiZGY2XkEyXkFqcGdeQXVyMTY3ODkyNDkz._V1_.jpg",
    description: "Description 1",
  };

  for (let i = 0; i < 10; i++) {
    const newObj = { ...originalObject };
    newObj.id = i + 1;
    newObj.title = `Title ${i + 1}`;
    newObj.description = `Description  ${i + 1}`;
    arrayOfObjects.push(newObj);
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        // data={arrayOfObjects}
        data={posts}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        refreshing={isLoading}
        keyExtractor={(item) => item?.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-gray-100">
              Search Results
            </Text>
            <Text className="text-2xl font-semibold text-white">{query}</Text>
            <View className="mt-6 mb-8 ">
              <SearchInput initialQuery={query} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos found"
            subtitle="No Videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
