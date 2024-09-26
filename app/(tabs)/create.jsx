import { useAuth } from "@clerk/clerk-expo";
import { ResizeMode, Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";
import CusomtButtom from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { icons } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import {
  firebase,
  firebaseCollections,
  firebaseStoragePath,
} from "../../firebase/firebase";
import { createVideo } from "../../lib/appwrite";
import { getDownloadableLink } from "../../utils/helperFn";

const Create = () => {
  const toast = useToast();
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });

  const { user } = useGlobalContext();

  const { userId } = useAuth();

  const [uploading, setUploading] = useState(false);

  const openPicker = async (selectType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker?.MediaTypeOptions.Videos,
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result?.canceled) {
      if (selectType === "image") {
        setForm({ ...form, thumbnail: result?.assets[0] });
      }
      if (selectType === "video") {
        setForm({ ...form, video: result?.assets[0] });
      }
    }
  };

  const submit = async () => {
    if (
      (form.prompt === "") |
      (form.title === "") |
      !form.thumbnail |
      !form.video
    ) {
      return Alert.alert("Please provide all fields");
    }
    setUploading(true);

    try {
      await createVideo({
        ...form,
        userId: user?.$id || "663850180d79325d3c79",
      });

      Alert.alert("Success", "Post successfully");
      router.push("/home");
    } catch (error) {
      // Alert.alert("Error", JSON.stringify(error.messsage));
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });
      setUploading(false);
    }
  };

  const addToFirebase = async () => {
    Keyboard.dismiss();
    if (
      form.prompt === "" ||
      form.title === "" ||
      !form.video ||
      !form.thumbnail
    ) {
      toast.show("Please provide all fields", {
        type: "warning",
        placement: "bottom",
      });
      return;
    }
    setUploading(true);

    let videoUrl;
    let thumbnailUrl;

    if (form?.video) {
      videoUrl = await getDownloadableLink({
        imageUri: form?.video?.uri,
        pathname: firebaseStoragePath.video,
      });
    }

    if (form.thumbnail) {
      thumbnailUrl = await getDownloadableLink({
        imageUri: form.thumbnail.uri,
        pathname: firebaseStoragePath.thumbnail,
      });
    }

    try {
      await firebase
        .firestore()
        .collection(firebaseCollections.videos)
        .add({
          userId: userId,
          videoTitle: form.title,
          video: videoUrl,
          thumbnail: thumbnailUrl,
          prompt: form.prompt,
        })
        .then((result) => {
          toast.show("Added Successfully", {
            type: "success",
          });
          router.push("/home");
        })
        .catch((err) => {
          toast.show(err?.errors?.[0]?.longMessage, {
            type: "danger",
          });
        })
        .finally(() => {
          setForm({
            title: "",
            video: null,
            thumbnail: null,
            prompt: "",
          });
          setUploading(false);
        });
    } catch (error) {}
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6" keyboardShouldPersistTaps="always">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>
        <FormField
          title={"Video Title"}
          value={form?.title}
          placeholder={"Give your video a catchy title"}
          handleChangeText={(e) =>
            setForm({
              ...form,
              title: e,
            })
          }
          otherStyles="mt-10"
        />
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <Video
                source={{ uri: form?.video?.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode={ResizeMode.COVER}
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>

          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{
                  uri: form?.thumbnail?.uri,
                }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title={"AI Prompt"}
          value={form?.prompt}
          placeholder={"The prompt you used to create this video"}
          handleChangeText={(e) =>
            setForm({
              ...form,
              prompt: e,
            })
          }
          otherStyles="mt-7"
        />
        <CusomtButtom
          title={"Submit & Publish"}
          handlePress={addToFirebase}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
