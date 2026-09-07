// screens/SearchScreen.js
// Lets the user type any query and search NASA's image database.
// Results come from the real NASA API — nothing is hardcoded.

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { searchNASA } from "../services/nasaApi";
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

// Example searches shown on the empty state screen
const EXAMPLES = ["Mars", "Black hole", "James Webb", "Apollo", "Earth", "Galaxy"];

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState("");       // what the user typed
  const [results, setResults] = useState([]);   // NASA search results
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searched, setSearched] = useState(false); // has the user searched yet?

  // Main search function — called when user presses SEARCH
  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return; // do nothing if the box is empty

    Keyboard.dismiss(); // hide the keyboard
    setResults([]);
    setPage(1);
    setHasMore(true);
    setError(false);
    setLoading(true);
    setSearched(true);

    try {
      const json = await searchNASA(trimmed, 1);
      const newItems = json?.collection?.items ?? [];
      setResults(newItems);
      setHasMore(newItems.length > 0);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Load the next page when user scrolls to the bottom
  const handleLoadMore = async () => {
    if (loadingMore || loading || !hasMore || !query.trim()) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const json = await searchNASA(query.trim(), nextPage);
      const newItems = json?.collection?.items ?? [];

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setResults((prev) => [...prev, ...newItems]);
        setPage(nextPage);
      }
    } catch (e) {
      // Silently fail on pagination errors — user still sees existing results
    } finally {
      setLoadingMore(false);
    }
  };

  const handlePress = (spaceItem) => {
    navigation.navigate("Details", { item: spaceItem });
  };

  // ── What to show in the list body ────────────────────────────
  const renderBody = () => {
    // Still loading the first page
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Searching NASA...</Text>
        </View>
      );
    }

    // API error
    if (error) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorIcon}>🛸</Text>
          <Text style={styles.errorTitle}>Search failed.</Text>
          <Text style={styles.errorSubtitle}>
            Please check your internet connection and try again.
          </Text>
        </View>
      );
    }

    // User searched but got no results
    if (searched && results.length === 0) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorIcon}>🔭</Text>
          <Text style={styles.errorTitle}>No NASA discoveries found.</Text>
          <Text style={styles.errorSubtitle}>Try another search.</Text>
        </View>
      );
    }

    // User hasn't searched yet — show example suggestions
    if (!searched) {
      return (
        <View style={styles.examplesBox}>
          <Text style={styles.examplesLabel}>TRY SEARCHING FOR</Text>
          <View style={styles.chips}>
            {EXAMPLES.map((ex) => (
              <TouchableOpacity
                key={ex}
                style={styles.chip}
                onPress={() => {
                  setQuery(ex);
                  // Auto-search when they tap an example chip
                  setTimeout(() => {
                    setResults([]);
                    setPage(1);
                    setHasMore(true);
                    setError(false);
                    setLoading(true);
                    setSearched(true);
                    searchNASA(ex, 1)
                      .then((json) => {
                        const newItems = json?.collection?.items ?? [];
                        setResults(newItems);
                        setHasMore(newItems.length > 0);
                      })
                      .catch(() => setError(true))
                      .finally(() => setLoading(false));
                  }, 0);
                }}
              >
                <Text style={styles.chipText}>{ex}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    // Results list
    return (
      <FlatList
        data={results}
        keyExtractor={(item, index) =>
          item?.data?.[0]?.nasa_id ?? String(index)
        }
        renderItem={({ item }) => (
          <SpaceCard spaceItem={item} onPress={() => handlePress(item)} />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.footerText}>Loading more...</Text>
            </View>
          ) : null
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Fixed header + search bar at the top */}
      <View style={styles.topSection}>
        <Text style={styles.appTitle}>SEARCH NASA</Text>
        <Text style={styles.appSubtitle}>Search the universe</Text>

        {/* Search input row */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="🔍  Search the universe..."
            placeholderTextColor={COLORS.muted}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch} // search when user presses Enter
            returnKeyType="search"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>SEARCH</Text>
          </TouchableOpacity>
        </View>

        {/* Empty query warning */}
        {query.trim() === "" && searched && (
          <Text style={styles.emptyWarning}>
            Please enter something to search.
          </Text>
        )}
      </View>

      {/* Scrollable results area */}
      <View style={styles.body}>{renderBody()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topSection: {
    padding: 20,
    paddingBottom: 12,
  },
  appTitle: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 2,
    marginTop: 8,
  },
  appSubtitle: {
    color: COLORS.secondary,
    fontSize: 15,
    marginTop: 4,
    marginBottom: 18,
  },
  searchRow: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.card,
    color: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  searchButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 13,
    letterSpacing: 1,
  },
  emptyWarning: {
    color: COLORS.secondary,
    fontSize: 13,
    marginTop: 8,
  },
  body: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 40,
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
    fontSize: 48,
    marginBottom: 14,
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
  },
  examplesBox: {
    padding: 20,
    paddingTop: 30,
  },
  examplesLabel: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 14,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipText: {
    color: COLORS.text,
    fontSize: 14,
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
