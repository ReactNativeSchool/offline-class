import React from "react";
import { ScrollView, View, Alert, StyleSheet, Text } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { Ionicons } from "@expo/vector-icons";

import { TextField } from "../components/Form";
import { Button } from "../components/Button";
import { geoFetch } from "../util/api";

const styles = StyleSheet.create({
  offlineContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  offlineText: {
    color: "rgba(0, 0, 0, 0.5)",
    fontSize: 18,
    textAlign: "center",
  },
});

class CreateItem extends React.Component {
  state = {
    title: null,
    description: null,
    latitude: null,
    longitude: null,
    loading: false,
    offline: false,
  };

  componentDidMount() {
    this.netListenerUnsubscribe = NetInfo.addEventListener((networkState) => {
      this.setState({
        offline: !networkState.isConnected,
      });
    });
  }

  componentWillUnmount() {
    if (this.netListenerUnsubscribe) {
      this.netListenerUnsubscribe();
    }
  }

  onCurrentLocationPress = () => {
    navigator.geolocation.getCurrentPosition((res) => {
      if (res && res.coords) {
        this.setState({
          latitude: res.coords.latitude.toString(),
          longitude: res.coords.longitude.toString(),
        });
      }
    });
  };

  onSavePress = () => {
    const { title, description, latitude, longitude } = this.state;
    this.setState({ loading: true }, () => {
      geoFetch(`/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, latitude, longitude }),
      })
        .then(() => {
          this.props.navigation.popToTop();
        })
        .catch((error) => {
          console.log("create item error", error);
          Alert.alert("Sorry, something went wrong.", error.message);
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    });
  };

  render() {
    if (this.state.offline) {
      return (
        <View style={styles.offlineContainer}>
          <Ionicons name="ios-warning" size={90} color="rgba(0, 0, 0, 0.5)" />
          <Text style={styles.offlineText}>
            Sorry, you can't create new items when offline.
          </Text>
        </View>
      );
    }
    return (
      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
        <TextField
          label="Title"
          placeholder="I am what I am..."
          value={this.state.title}
          onChangeText={(title) => this.setState({ title })}
        />
        <TextField
          label="Description"
          placeholder="This is a description..."
          value={this.state.description}
          onChangeText={(description) => this.setState({ description })}
        />
        <TextField
          label="Latitude"
          placeholder="37.3861"
          keyboardType="decimal-pad"
          value={this.state.latitude}
          onChangeText={(latitude) => this.setState({ latitude })}
        />
        <TextField
          label="Longitude"
          placeholder="-122.0839"
          keyboardType="decimal-pad"
          value={this.state.longitude}
          onChangeText={(longitude) => this.setState({ longitude })}
        />
        <View style={{ alignItems: "center" }}>
          <Button
            text="Use Current Location"
            style={{ marginBottom: 20 }}
            onPress={this.onCurrentLocationPress}
          />
          <Button
            text="Save"
            onPress={this.onSavePress}
            loading={this.state.loading}
          />
        </View>
      </ScrollView>
    );
  }
}
export default CreateItem;
