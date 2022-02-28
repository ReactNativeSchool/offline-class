import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import List from "./screens/List";
import Details from "./screens/Details";
import CreateItem from "./screens/CreateItem";

import {
  AddButton,
  CloseButton,
  OfflineNotification,
} from "./components/Navigation";
import { reconcileActions } from "./util/api";

const Stack = createNativeStackNavigator();

export default class RootApp extends React.Component {
  state = {
    reconciling: true,
  };

  componentDidMount() {
    reconcileActions()
      .then((reconciled) => {
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
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: "#3A8552",
              },
              headerTintColor: "#fff",
              headerLeft: OfflineNotification,
            }}
          >
            <Stack.Screen
              name="List"
              component={List}
              options={({ navigation }) => ({
                headerTitle: "Items",
                headerRight: () => <AddButton navigation={navigation} />,
              })}
            />
            <Stack.Screen
              name="Details"
              component={Details}
              options={({ route }) => ({
                headerTitle: route?.params?.item.title,
              })}
            />
            <Stack.Screen
              name="CreateItem"
              component={CreateItem}
              options={({ navigation }) => ({
                headerTitle: "Create Item",
                headerRight: () => <CloseButton navigation={navigation} />,
                presentation: "modal",
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </React.Fragment>
    );
  }
}
