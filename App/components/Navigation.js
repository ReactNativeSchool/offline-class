import React from "react";
import { TouchableOpacity, Platform, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNetInfo } from "@react-native-community/netinfo";

const iconPrefix = Platform.OS === "ios" ? "ios" : "md";

const styles = StyleSheet.create({
  btnRight: {
    marginRight: 10,
  },
  btnLeft: {
    marginLeft: 10,
  },
});

export const AddButton = ({ navigation }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate("CreateItem")}
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

export const OfflineNotification = () => {
  const networkState = useNetInfo();

  if (networkState.isConnected) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={() => alert("You're currently offline.")}
      style={styles.btnLeft}
      activeOpacity={0.75}
    >
      <Ionicons name={`${iconPrefix}-warning`} size={30} color="#fff" />
    </TouchableOpacity>
  );
};
