// components/SpaceCard.js
// Reusable card used by both HomeScreen and SearchScreen.
// Props:
//   spaceItem — one item from NASA's search results array
//   onPress   — function to call when the user taps the card

import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

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

export default function SpaceCard({ spaceItem, onPress }) {
  // NASA API structure:
  //   spaceItem.data[0]  → metadata (title, description, date_created, center)
  //   spaceItem.links[0] → image URL (href)

  // Safely pull out what we need — use fallbacks so the app never crashes
  const info = spaceItem?.data?.[0] ?? {};
  const imageUrl = spaceItem?.links?.[0]?.href ?? null;

  const title = info.title ?? "Untitled";
  const center = info.center ?? "NASA";
  const rawDate = info.date_created ?? null;
  // NASA dates come as ISO strings like "1969-07-20T00:00:00Z"
  // We just show the first 10 characters: "1969-07-20"
  const date = rawDate ? rawDate.substring(0, 10) : null;

  // Shorten the description to fit on the card
  const fullDesc = info.description ?? "";
  const preview =
    fullDesc.length > 120 ? fullDesc.substring(0, 120) + "..." : fullDesc;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Image — or a placeholder if there is no image */}
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

      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>{title}</Text>

        {/* Center / source */}
        <Text style={styles.center}>{center}</Text>

        {/* Date — only show if available */}
        {date && <Text style={styles.date}>📅 {date}</Text>}

        {/* Short description — only show if available */}
        {preview.length > 0 && (
          <Text style={styles.preview}>{preview}</Text>
        )}

        {/* Button */}
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>VIEW DETAILS →</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 200,
  },
  noImageBox: {
    width: "100%",
    height: 120,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
  },
  noImageText: {
    color: COLORS.muted,
    fontSize: 14,
  },
  content: {
    padding: 14,
  },
  title: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    lineHeight: 22,
  },
  center: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  date: {
    color: COLORS.muted,
    fontSize: 12,
    marginBottom: 6,
  },
  preview: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
