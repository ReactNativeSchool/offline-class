import React from "react";
import { ActivityIndicator, Alert } from "react-native";
import NetInfo from "@react-native-community/netinfo";

import { List, ListItem } from "../components/List";
import { geoFetch } from "../util/api";

class ListScreen extends React.Component {
  state = {
    loading: true,
    list: [],
    refreshing: false,
  };

  componentDidMount() {
    this.getData();
  }

  getData = () =>
    NetInfo.fetch()
      .then((state) => {
        if (!state.isConnected) {
          throw new Error("Currently offline.");
        }

        return geoFetch("/list");
      })
      .then((response) => {
        this.setState({
          loading: false,
          refreshing: false,
          list: response.result,
        });
      })
      .catch((error) => {
        console.log("list error", error);
        Alert.alert(
          "Sorry, something went wrong. Please try again",
          error.message,
          [
            {
              text: "Try Again",
              onPress: this.getData,
            },
          ]
        );
      });

  handleRefresh = () => {
    this.setState({ refreshing: true });
    this.getData();
  };

  render() {
    if (this.state.loading) {
      return <ActivityIndicator size="large" />;
    }

    return (
      <List
        data={this.state.list}
        renderItem={({ item, index }) => (
          <ListItem
            title={item.title}
            isOdd={index % 2}
            onPress={() => this.props.navigation.navigate("Details", { item })}
          />
        )}
        onRefresh={this.handleRefresh}
        refreshing={this.state.refreshing}
      />
    );
  }
}

export default ListScreen;
