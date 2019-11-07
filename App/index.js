import React from "react";
import { StatusBar } from "react-native";
import { createAppContainer, createStackNavigator } from "react-navigation";

import List from "./screens/List";
import Details from "./screens/Details";
import CreateItem from "./screens/CreateItem";

import { AddButton, CloseButton, NetworkStatus } from "./components/Navigation";

const defaultStackOptions = {
  headerStyle: {
    backgroundColor: "#3A8552"
  },
  headerTintColor: "#fff"
};

const Information = createStackNavigator(
  {
    List: {
      screen: List,
      navigationOptions: ({ navigation }) => ({
        headerTitle: "Items",
        headerRight: <AddButton navigation={navigation} />,
        headerLeft: <NetworkStatus />
      })
    },
    Details: {
      screen: Details,
      navigationOptions: ({ navigation }) => ({
        headerTitle: navigation.getParam("item", {}).title
      })
    }
  },
  {
    defaultNavigationOptions: {
      ...defaultStackOptions
    }
  }
);

const App = createStackNavigator(
  {
    Information,
    CreateItem: {
      screen: createStackNavigator(
        {
          CreateCreate: {
            screen: CreateItem,
            navigationOptions: ({ navigation }) => ({
              headerTitle: "Create Item",
              headerRight: <CloseButton navigation={navigation} />
            })
          }
        },
        {
          defaultNavigationOptions: {
            ...defaultStackOptions
          }
        }
      )
    }
  },
  {
    headerMode: "none",
    mode: "modal"
  }
);

const AppWithContainer = createAppContainer(App);

export default () => (
  <React.Fragment>
    <StatusBar barStyle="light-content" />
    <AppWithContainer />
  </React.Fragment>
);
