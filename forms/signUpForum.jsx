import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { useSignUp } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useToast } from "react-native-toast-notifications";

const SignUpForum = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoaded, setActive, signUp } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const toast = useToast();

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
      router.replace("/home");
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
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

    try {
      await signUp.create({
        emailAddress: form?.email,
        password: form?.password,
        username: form?.username,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
      toast.show(`${form?.email} created.`, {
        placement: "bottom",
      });
    } catch (error) {
      toast.show(error?.errors?.[0]?.longMessage, {
        placement: "bottom",
      });
    }
  };

  return (
    <View>
      {!pendingVerification && (
        <View>
          <FormField
            title="Username"
            value={form.username}
            placeholder="Enter username"
            handleChangeText={(e) =>
              setForm({
                ...form,
                username: e,
              })
            }
            otherStyles="mt-10"
          />

          <FormField
            placeholder="Enter email"
            title="Email"
            value={form.email}
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
            placeholder="Enter password"
            title="Password"
            value={form.password}
            handleChangeText={(e) =>
              setForm({
                ...form,
                password: e,
              })
            }
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
        </View>
      )}
      {pendingVerification && (
        <View>
          <View>
            <FormField
              value={code}
              placeholder="Code..."
              handleChangeText={(e) => setCode(e)}
            />
          </View>

          <CustomButton
            title="Verify Email"
            handlePress={onPressVerify}
            containerStyles="mt-7"
          />
        </View>
      )}
    </View>
  );
};

export default SignUpForum;
