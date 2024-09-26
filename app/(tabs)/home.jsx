import { useAuth, useUser } from "@clerk/clerk-expo";
import React, { useState } from "react";
import { FlatList, Image, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../components/EmptyState";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import VideoCard from "../../components/VideoCard";
import { images } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";

import { useFetchData } from "../../hooks/useFetchFeed";

const Home = () => {
  // const { data: posts, isLoading, refeth } = useAppwrite(getAllpost);
  const { user } = useGlobalContext();
  // const { data: movies, isLoading, refetch } = useRapidApi((query = ""));
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { userId } = useAuth();
  const [refreshing, setRefreshing, isLoading] = useState(false);

  const { data, error } = useFetchData();

  console.log(data);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const arrayOfObjects = [];

  const originalObject = {
    id: 1,
    title: "asd",
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

  // return (
  //   <SafeAreaView className="bg-primary h-full">
  //     <FlatList
  //       data={[
  //         ...arrayOfObjects,
  //         ...arrayOfObjects,
  //         ...arrayOfObjects,
  //         ...arrayOfObjects,
  //         ...arrayOfObjects,
  //       ]}
  //       ListHeaderComponent={() => (
  //         <View>
  //           <Text className="text-white text-3xl font-extrabold">
  //             ListHeaderComponent
  //           </Text>
  //         </View>
  //       )}
  //       stickyHeaderIndices={[0]}
  //       renderItem={({ item }) => {
  //         return (
  //           <View>
  //             <Text className="text-white texgt-2xl font-pmedium">
  //               {item?.description}
  //             </Text>
  //           </View>
  //         );
  //       }}
  //     />
  //   </SafeAreaView>
  // );

  // useEffect(() => {
  //   if (userId) {
  //     getAllFeeds()
  //       .then((result) => {
  //         result?.map((doc) => {
  //           console.log(doc.data());
  //         });
  //       })
  //       .catch((err) => {
  //         console.log({ err });
  //       });
  //   }
  // }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        keyboardShouldPersistTaps="always"
        data={data}
        refreshing={isLoading}
        keyExtractor={(item) => item?.data().userId?.toString()}
        // const { prompt, userId, videoTitle, thumbnail, video } = item?.data();
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome back,
                </Text>
                <Text className="text-2xl font-semibold text-white capitalize">
                  {clerkUser?.username}
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput />
            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Latest Series
              </Text>

              <Trending />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Be the first one to upload a video"
          />
        )}
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
