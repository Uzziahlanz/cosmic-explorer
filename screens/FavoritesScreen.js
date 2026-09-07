// screens/FavoritesScreen.js
// Shows all NASA discoveries the user has saved.
// Reloads favorites every time the screen comes into focus
// so it stays in sync after the user removes something in DetailsScreen.

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

import { getFavorites } from "../services/favorites";
import SpaceCard from "../components/SpaceCard";

const COLORS = {
  background: "#050816",
  card: "#111827",
  primary: "#7C5CFC",
  secondary: "#38BDF8",
  white: "#FFFFFF",
  text: "#E5E7EB",
  muted: "#9CA3AF",
  border: "#1F2937",
};

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);

  // useFocusEffect runs every time this tab becomes visible.
  // This means if the user removes a favorite in Details then comes back,
  // the list will refresh automatically.
  useFocusEffect(
    useCallback(() => {
      async function load() {
        const saved = await getFavorites();
        setFavorites(saved);
      }
      load();
    }, [])
  );

  const handlePress = (item) => {
    navigation.navigate("Details", { item });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {favorites.length === 0 ? (
        // ── Empty state ──
        <View style={styles.emptyContainer}>
          <View style={styles.header}>
            <Text style={styles.appTitle}>FAVORITES</Text>
            <Text style={styles.appSubtitle}>Your saved discoveries</Text>
          </View>
          <View style={styles.emptyBody}>
            <Text style={styles.emptyIcon}>❤️</Text>
            <Text style={styles.emptyTitle}>No favorites yet.</Text>
            <Text style={styles.emptySubtitle}>
              Explore NASA and save discoveries{"\n"}you want to come back to.
            </Text>
          </View>
        </View>
      ) : (
        // ── Favorites list ──
        <FlatList
          data={favorites}
          keyExtractor={(item, index) =>
            item?.data?.[0]?.nasa_id ?? String(index)
          }
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <SpaceCard
              spaceItem={item}
              onPress={() => handlePress(item)}
            />
          )}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.appTitle}>FAVORITES</Text>
              <Text style={styles.appSubtitle}>Your saved discoveries</Text>
              <Text style={styles.sectionLabel}>
                {favorites.length} SAVED ITEM{favorites.length !== 1 ? "S" : ""}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    marginTop: 8,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  appTitle: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 2,
  },
  appSubtitle: {
    color: COLORS.secondary,
    fontSize: 15,
    marginTop: 4,
    marginBottom: 16,
  },
  sectionLabel: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },
  // Empty state
  emptyContainer: {
    flex: 1,
  },
  emptyBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    marginTop: -60,
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: 16,
  },
  emptyTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  emptySubtitle: {
    color: COLORS.muted,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
});
