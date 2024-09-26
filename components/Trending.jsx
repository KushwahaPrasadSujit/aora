import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import React, { useState } from "react";
import useRapidApi from "../lib/useRapidApi";
import * as Animatable from "react-native-animatable";
import { icons } from "../constants";
import { ResizeMode, Video } from "expo-av";

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1.1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = ({ activeItem, item }) => {
  const [play, setPlay] = useState(false);
  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem == item?.id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          source={{ uri: "https://www.youtube.com/watch?v=jNQXAC9IVRw" }}
          className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
            source={{ uri: item?.image }}
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const arrayOfObjects = [];

const originalObject = {
  id: 1,
  title: "asd",
  image:
    "https://m.media-amazon.com/images/M/MV5BOGRmYjZjMDUtNGFjYS00ZmMyLWJkYTAtODQ5ZWYyMTJiZGY2XkEyXkFqcGdeQXVyMTY3ODkyNDkz._V1_.jpg",
};

for (let i = 0; i < 10; i++) {
  const newObj = { ...originalObject };
  newObj.id = i + 1;
  newObj.title = `Title ${i + 1}`;
  arrayOfObjects.push(newObj);
}
const Trending = () => {
  const { data: series, isLoading, refetch } = useRapidApi((query = "series"));
  const [activeItem, setActiveItem] = useState(2);

  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems?.length > 0) {
      setActiveItem(viewableItems[0]?.key);
    }
  };

  return (
    <FlatList
      horizontal
      data={arrayOfObjects}
      keyExtractor={(item) => item?.id}
      ItemSeparatorComponent={() => <View className />}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 170 }}
    />
  );
};

export default Trending;
