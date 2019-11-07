import React from "react";
import { ActivityIndicator } from "react-native";

import { List, ListItem } from "../components/List";
import { geoFetch } from "../util/api";

class ListScreen extends React.Component {
  state = {
    loading: true,
    list: [],
    refreshing: false
  };

  componentDidMount() {
    this.getData();
  }

  getData = () =>
    geoFetch("/list")
      .then(response => {
        this.setState({
          loading: false,
          refreshing: false,
          list: response.result
        });
      })
      .catch(error => {
        console.log("list error", error);
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
