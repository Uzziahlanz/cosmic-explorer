// screens/HomeScreen.js
// Shows a scrollable feed of NASA space images.
// Loads page 1 on start, then loads more pages as the user scrolls down.

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getNASAItems } from "../services/nasaApi";
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

export default function HomeScreen({ navigation }) {
  const [items, setItems] = useState([]);       // the list of NASA results
  const [page, setPage] = useState(1);          // which page we are on
  const [loading, setLoading] = useState(true); // initial load spinner
  const [loadingMore, setLoadingMore] = useState(false); // bottom spinner
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true); // stops loading when no more pages

  // loadPage fetches one page of results and adds them to the list
  const loadPage = async (pageNumber, isRetry = false) => {
    // If this is the first page, show the full-screen spinner
    if (pageNumber === 1) {
      setLoading(true);
      setError(false);
      if (isRetry) setItems([]); // clear old results on retry
    } else {
      setLoadingMore(true);
    }

    try {
      const json = await getNASAItems(pageNumber);
      // NASA puts results inside: json.collection.items
      const newItems = json?.collection?.items ?? [];

      if (newItems.length === 0) {
        // No more results — stop trying to load more
        setHasMore(false);
      } else {
        // Add new items to our existing list
        setItems((prev) => [...prev, ...newItems]);
        setPage(pageNumber);
      }
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load page 1 when the screen first opens
  useEffect(() => {
    loadPage(1);
  }, []);

  // Called when the user reaches the bottom of the list
  const handleLoadMore = () => {
    if (!loadingMore && !loading && hasMore) {
      loadPage(page + 1);
    }
  };

  // When a card is tapped, go to Details and pass the NASA item
  const handlePress = (spaceItem) => {
    navigation.navigate("Details", { item: spaceItem });
  };

  // ── Full-screen loading state ─────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading NASA discoveries...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Error state ───────────────────────────────────────────────
  if (error && items.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.errorIcon}>🛸</Text>
          <Text style={styles.errorTitle}>Unable to load NASA discoveries.</Text>
          <Text style={styles.errorSubtitle}>
            Please check your internet connection.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadPage(1, true)}
          >
            <Text style={styles.retryText}>TRY AGAIN</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Success state — FlatList of cards ────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <FlatList
        data={items}
        // Each NASA item has a nasa_id inside data[0] — use it as the key
        keyExtractor={(item, index) =>
          item?.data?.[0]?.nasa_id ?? String(index)
        }
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5} // trigger when 50% from bottom
        renderItem={({ item }) => (
          <SpaceCard
            spaceItem={item}
            onPress={() => handlePress(item)}
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.appTitle}>COSMIC EXPLORER</Text>
            <Text style={styles.appSubtitle}>Discover the universe</Text>
            <Text style={styles.sectionLabel}>NASA DISCOVERIES</Text>
          </View>
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.footerText}>Loading more...</Text>
            </View>
          ) : null
        }
      />
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
    marginBottom: 24,
  },
  sectionLabel: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  loadingText: {
    color: COLORS.muted,
    fontSize: 15,
    marginTop: 16,
  },
  errorIcon: {
    fontSize: 50,
    marginBottom: 16,
  },
  errorTitle: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  errorSubtitle: {
    color: COLORS.muted,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 28,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: "700",
    letterSpacing: 1,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  footerText: {
    color: COLORS.muted,
    fontSize: 13,
  },
});
