import { useSignIn } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Image, Keyboard, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { images } from "../../constants";

const SignIn = () => {
  const toast = useToast();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoaded, setActive, signIn } = useSignIn();

  const onSignInPress = async () => {
    Keyboard.dismiss();
    if (!form.email || !form.password) {
      toast.show("Please fill in all the fields", {
        placement: "bottom",
        duration: 3000,
        animationType: "zoom-in",
        textStyle: {
          fontSize: 16,
        },
      });
      return;
    }

    if (!isLoaded) {
      return;
    }

    setIsSubmitting(true);

    try {
      const completeSignIn = await signIn.create({
        identifier: form?.email,
        password: form?.password,
      });
      await setActive({ session: completeSignIn.createdSessionId });
      toast.show(`Welcome back, ${form?.email}`, {
        placement: "bottom",
      });
      router.replace("/home");
    } catch (err) {
      toast.show(err?.errors?.[0]?.longMessage, {
        placement: "bottom",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView keyboardShouldPersistTaps="always">
        <View className="w-full justify-center px-4 my-6 min-h-[85vh]">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[151px] h-[35px]"
          />
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            Login in to Auro
          </Text>

          <FormField
            title="Email or Username"
            value={form.email}
            placeholder="Enter email or username"
            handleChangeText={(e) =>
              setForm({
                ...form,
                email: e,
              })
            }
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            placeholder="Enter password"
            handleChangeText={(e) =>
              setForm({
                ...form,
                password: e,
              })
            }
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign In"
            handlePress={onSignInPress}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center flex-row gap-2 pt-5">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              className="text-lg font-psemibold text-secondary"
              href="/sign-up"
            >
              Sign up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
