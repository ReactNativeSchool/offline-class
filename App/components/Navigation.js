import React from "react";
import { TouchableOpacity, Platform, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useConnectionStatus } from "../util/network";

const iconPrefix = Platform.OS === "ios" ? "ios" : "md";

const styles = StyleSheet.create({
  btnRight: {
    marginRight: 10
  },
  btnLeft: {
    marginLeft: 10
  }
});

export const AddButton = ({ navigation }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate("CreateCache")}
    style={styles.btnRight}
    activeOpacity={0.75}
  >
    <Ionicons name={`${iconPrefix}-add`} size={30} color="#fff" />
  </TouchableOpacity>
);

export const CloseButton = ({ navigation }) => (
  <TouchableOpacity
    onPress={() => navigation.pop()}
    style={styles.btnRight}
    activeOpacity={0.75}
  >
    <Ionicons name={`${iconPrefix}-close`} size={30} color="#fff" />
  </TouchableOpacity>
);

export const NetworkStatus = () => {
  const { isConnected } = useConnectionStatus();
  console.log("netInfo", isConnected);
  if (isConnected) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={() => alert("You don't currently have a network connection.")}
      style={styles.btnLeft}
      activeOpacity={0.75}
    >
      <Ionicons name={`${iconPrefix}-warning`} size={30} color="#fff" />
    </TouchableOpacity>
  );
};
