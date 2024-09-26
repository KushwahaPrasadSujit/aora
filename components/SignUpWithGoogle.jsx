import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SignUpWithGoogle = () => {
  return (
    <View>
      <TouchableOpacity
        style={{
          paddingVertical: 15,
          borderRadius: 50,
          borderWidth: 2,
          borderColor: "#FAFAFC",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          gap: 16,
        }}
      >
        <AntDesign name="google" size={24} color="white" />
        <Text className="text-white font-pmedium text-base">
          Sign up with Google
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpWithGoogle;

const styles = StyleSheet.create({});
