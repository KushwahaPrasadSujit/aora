import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import Spinner from "@/components/shared/Spinner";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`flex-row gap-2 bg-secondary-100 rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          color="#ffffff"
          animating={isLoading}
          size={"small"}
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
