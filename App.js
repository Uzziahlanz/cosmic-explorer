// App.js
// Navigation structure:
//   Stack Navigator (root)
//   ├── MainTabs  → BottomTab Navigator
//   │     ├── Home       (HomeScreen)
//   │     ├── Search     (SearchScreen)
//   │     └── Favorites  (FavoritesScreen)
//   └── Details   (DetailsScreen) — not in the tab bar

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

import HomeScreen from "./screens/HomeScreen";
import SearchScreen from "./screens/SearchScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import DetailsScreen from "./screens/DetailsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const COLORS = {
  background: "#050816",
  card: "#111827",
  primary: "#7C5CFC",
  secondary: "#38BDF8",
  white: "#FFFFFF",
  muted: "#9CA3AF",
  border: "#1F2937",
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size - 4 }}>🏠</Text>
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size - 4 }}>🔍</Text>
          ),
          tabBarLabel: "Search",
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size - 4 }}>❤️</Text>
          ),
          tabBarLabel: "Favorites",
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        {/* Details is NOT in the tab bar — it slides in over everything */}
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
