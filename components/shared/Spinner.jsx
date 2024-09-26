import LottieView from "lottie-react-native";
import React from "react";

const Spinner = (loading) => {
  return (
    <LottieView
      autoPlay={true}
      className="h-10 aspect-auto"
      source={require("../../assets/LoadingSpinner.json")}
    />
  );
};

export default Spinner;
