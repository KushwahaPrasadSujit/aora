import SignUpWithGoogle from "@/components/SignUpWithGoogle";
import SignUpForum from "@/forms/signUpForum";
import { SignedOut } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";

const SignUp = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView keyboardShouldPersistTaps="always">
        <SignedOut>
          <View className="w-full justify-center px-4 my-6 min-h-[85vh]">
            <Image source={images.logo} className="w-[151px] h-[35px]" />
            <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
              Sign up in to Auro
            </Text>

            <SignUpForum />

            <View className="justify-center flex-row gap-2 pt-5">
              <Text className="text-lg text-gray-100 font-pregular">
                Have an account? already?
              </Text>
              <Link
                className="text-lg font-psemibold text-secondary"
                href="/sign-in"
              >
                Sign Up
              </Link>
            </View>
            <SignUpWithGoogle />
          </View>
        </SignedOut>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
