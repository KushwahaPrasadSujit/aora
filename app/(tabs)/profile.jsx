import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React from "react";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../../components/EmptyState";
import InfoBox from "../../components/InfoBox";
import VideoCard from "../../components/VideoCard";
import { icons } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import { getUserPost } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts } = useAppwrite(() => getUserPost(user?.$id));
  const { isLoaded, signOut } = useAuth();

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

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace("/sign-in");
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={arrayOfObjects}
        // data={posts}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        keyExtractor={(item) => item?.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              className="w-full items-end mb-10"
              onPress={logout}
            >
              <Image
                source={icons?.logout}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg  justify-center">
              <Image
                source={{
                  uri:
                    user?.avatar ||
                    "https://scontent.fbwa1-1.fna.fbcdn.net/v/t39.30808-1/438276070_2758860274290595_1268683053338581850_n.jpg?stp=dst-jpg_p200x200&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=Vk88A7-FgQEQ7kNvgHItNWZ&_nc_oc=Adje1MM1kjvbwZVwM9hNHXREOv3KiZ9KKeccnVsGnQtE-1kma3KEw_G1xav5C84DTpf5JURifE3ceGQaJrcobOjO&_nc_ht=scontent.fbwa1-1.fna&oh=00_AfCdjCIIJv8Y08nhwKMFgWNp_x1EQfZ05ssoStcp9JxwSw&oe=663EE2CF",
                }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>
            <InfoBox
              title={user?.username || "Sujit"}
              containerStyles="mt-5"
              titleStyle="text-lg"
            />
            <View className="mt-5 flex-row">
              <InfoBox
                title={arrayOfObjects?.length || 0}
                subTitle="Posts"
                containerStyles="mr-10"
                titleStyle="text-lg"
              />
              <InfoBox
                title={"1.2K"}
                subTitle="Followers"
                titleStyle="text-lg"
              />
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

export default Profile;
