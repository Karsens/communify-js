import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import TabBarIcon from "../components/TabBarIcon";
import TribesScreen from "../screens/TribesScreen";
import LinksScreen from "../screens/LinksScreen";
import ChatsScreen from "../screens/ChatsScreen";
import ChatScreen from "../screens/ChatScreen";
import ActivitiesScreen from "../screens/ActivitiesScreen";
import TribeScreen from "../screens/TribeScreen";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "home";

const Stack = createStackNavigator();
function ChatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ title: "Chats" }}
        name="chats"
        component={ChatsScreen}
      />
      <Stack.Screen name="chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="tribes"
        component={TribesScreen}
        options={{
          headerTitle: () => null,
          title: "Tribes",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="ios-people" />
          ),
        }}
      />

      <BottomTab.Screen
        name="mytribe"
        component={TribeScreen}
        options={{
          title: "My Tribe",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="ios-bonfire" />
          ),
        }}
      />

      <BottomTab.Screen
        name="chats"
        component={ChatStack}
        options={{
          title: "Chat",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="ios-chatbubbles" />
          ),
        }}
      />

      <BottomTab.Screen
        name="activities"
        component={ActivitiesScreen}
        options={{
          title: "Activities",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="ios-calendar" />
          ),
        }}
      />

      <BottomTab.Screen
        name="links"
        component={LinksScreen}
        options={{
          title: "More",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="ios-more" />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName =
    route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case "posts":
      return "Home";
    case "chat":
      return "Chat";
    case "members":
      return "Members";
    case "links":
      return "More";
    case "resources":
      return "Explore";
  }
}
