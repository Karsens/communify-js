import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";

import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import LinksScreen from "../screens/LinksScreen";
import ChatScreen from "../screens/ChatScreen";
import MembersScreen from "../screens/MembersScreen";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "home";

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="posts"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="ios-home" />
          ),
        }}
      />
      <BottomTab.Screen
        name="chat"
        component={ChatScreen}
        options={{
          title: "Chat",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="ios-chatbubbles" />
          ),
        }}
      />

      <BottomTab.Screen
        name="members"
        component={MembersScreen}
        options={{
          title: "Members",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="ios-contacts" />
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
  }
}
