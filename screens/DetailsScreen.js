// screens/DetailsScreen.js
// Shows full details of any NASA item from Home, Search, or Favorites.
// Also lets the user add/remove the item from their favorites.

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { isFavorite, saveFavorite, removeFavorite } from "../services/favorites";

const COLORS = {
  background: "#050816",
  card: "#111827",
  primary: "#7C5CFC",
  secondary: "#38BDF8",
  white: "#FFFFFF",
  text: "#E5E7EB",
  muted: "#9CA3AF",
  border: "#1F2937",
  favorite: "#F43F5E", // red/pink for the heart button
};

export default function DetailsScreen({ route, navigation }) {
  const { item } = route.params;

  // Pull NASA data out safely
  const info = item?.data?.[0] ?? {};
  const imageUrl = item?.links?.[0]?.href ?? null;

  const title = info.title ?? "Untitled";
  const center = info.center ?? "NASA";
  const photographer = info.photographer ?? null;
  const rawDate = info.date_created ?? null;
  const date = rawDate ? rawDate.substring(0, 10) : null;
  const description = info.description ?? null;
  const keywords = info.keywords ?? [];
  const nasaId = info.nasa_id ?? null;

  // Track whether this item is currently favorited
  const [favorited, setFavorited] = useState(false);

  // Check favorite status when the screen loads
  useEffect(() => {
    async function checkStatus() {
      if (nasaId) {
        const result = await isFavorite(nasaId);
        setFavorited(result);
      }
    }
    checkStatus();
  }, [nasaId]);

  // Toggle favorite on/off
  const handleToggleFavorite = async () => {
    if (favorited) {
      // Remove from favorites
      await removeFavorite(nasaId);
      setFavorited(false);
    } else {
      // Add to favorites
      await saveFavorite(item);
      setFavorited(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Back button ── */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* ── NASA Image ── */}
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImageBox}>
            <Text style={styles.noImageText}>No image available</Text>
          </View>
        )}

        {/* ── Title ── */}
        <Text style={styles.title}>{title}</Text>

        {/* ── Source / center ── */}
        <Text style={styles.center}>{center}</Text>

        {/* ── Date ── */}
        {date && <Text style={styles.date}>📅 {date}</Text>}

        {/* ── Photographer ── */}
        {photographer && (
          <Text style={styles.photographer}>📷 {photographer}</Text>
        )}

        <View style={styles.divider} />

        {/* ── Full description ── */}
        {description && (
          <>
            <Text style={styles.sectionHeading}>DESCRIPTION</Text>
            <Text style={styles.description}>{description}</Text>
          </>
        )}

        {/* ── Keywords ── */}
        {keywords.length > 0 && (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionHeading}>KEYWORDS</Text>
            <View style={styles.keywords}>
              {keywords.map((kw, i) => (
                <View key={i} style={styles.keywordChip}>
                  <Text style={styles.keywordText}>{kw}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={styles.divider} />

        {/* ── Favorite button ── */}
        {/* Only show if this item has a nasa_id to identify it */}
        {nasaId && (
          <TouchableOpacity
            style={[
              styles.favoriteButton,
              favorited && styles.favoriteButtonActive,
            ]}
            onPress={handleToggleFavorite}
          >
            <Text style={styles.favoriteButtonText}>
              {favorited ? "♥  Remove from Favorites" : "♡  Add to Favorites"}
            </Text>
          </TouchableOpacity>
        )}

        {/* ── Source credit ── */}
        <View style={styles.sourceBox}>
          <Text style={styles.sourceText}>Source: NASA Image and Video Library</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 50,
  },
  backButton: {
    marginBottom: 20,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  backText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: "100%",
    height: 260,
    borderRadius: 16,
    marginBottom: 20,
  },
  noImageBox: {
    width: "100%",
    height: 160,
    borderRadius: 16,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  noImageText: {
    color: COLORS.muted,
    fontSize: 15,
  },
  title: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 30,
    marginBottom: 6,
  },
  center: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  date: {
    color: COLORS.muted,
    fontSize: 13,
    marginBottom: 4,
  },
  photographer: {
    color: COLORS.muted,
    fontSize: 13,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 20,
  },
  sectionHeading: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 12,
  },
  description: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 24,
  },
  keywords: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  keywordChip: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  keywordText: {
    color: COLORS.muted,
    fontSize: 13,
  },
  // ── Favorite button ──
  favoriteButton: {
    borderWidth: 2,
    borderColor: COLORS.favorite,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 4,
  },
  favoriteButtonActive: {
    // Filled background when already favorited
    backgroundColor: COLORS.favorite,
  },
  favoriteButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
  sourceBox: {
    marginTop: 20,
    padding: 14,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  sourceText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "600",
  },
});
