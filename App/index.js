import React from "react";
import { StatusBar } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import List from "./screens/List";
import Details from "./screens/Details";
import CreateItem from "./screens/CreateItem";

import {
  AddButton,
  CloseButton,
  OfflineNotification
} from "./components/Navigation";
import { reconcileActions } from "./util/api";

const defaultStackOptions = {
  headerStyle: {
    backgroundColor: "#3A8552"
  },
  headerTintColor: "#fff",
  headerLeft: <OfflineNotification />
};

const Information = createStackNavigator(
  {
    List: {
      screen: List,
      navigationOptions: ({ navigation }) => ({
        headerTitle: "Items",
        headerRight: <AddButton navigation={navigation} />
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

export default class RootApp extends React.Component {
  state = {
    reconciling: true
  };

  componentDidMount() {
    reconcileActions()
      .then(reconciled => {
        console.log(`Have offline actions been reconciled? ${reconciled}`);
      })
      .finally(() => {
        this.setState({ reconciling: false });
      });
  }

  render() {
    if (this.state.reconciling) {
      return null;
    }

    return (
      <React.Fragment>
        <StatusBar barStyle="light-content" />
        <AppWithContainer />
      </React.Fragment>
    );
  }
}
