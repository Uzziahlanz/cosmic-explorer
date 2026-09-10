 Cosmic Explorer


Student Information

- Student Name: Uzziah lanz G. Francisco 
- Section: BS 41A
- Course: CS41A7 — CS Major Elective 3

---

How to Run

Prerequisites:
- Node.js installed
- Expo Go app installed on your Android phone

Steps:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start --clear
   ```

3. Scan the QR code shown in the terminal using the **Expo Go** app on your phone.

---

Screens

| Screen | Role |
|--------|------|
| **Home** | Displays a live feed of NASA space images loaded from the NASA Image and Video Library API. Supports infinite scroll pagination. |
| **Search** | Lets the user search NASA's entire image database by keyword (e.g. "Mars", "Apollo", "Black hole"). Returns real NASA results. |
| **Favorites** | Shows NASA discoveries the user has saved locally. Uses AsyncStorage to persist favorites across app restarts. |
| **Details** *(nested)* | Shows the full details of any NASA item tapped from Home, Search, or Favorites. Includes image, description, keywords, date, and a favorite toggle button. |

---

Custom Components

| Component | Used In | Purpose |
|-----------|---------|---------|
| `components/SpaceCard.js` | Home, Search, Favorites | Displays a NASA image card with title, date, description preview, and a View Details button. |
| `components/ScreenHeader.js` | Home, Search, Favorites | Reusable screen header showing a title, subtitle, and optional section label. |

---

ackages Used

| Package | Purpose |
|---------|---------|
| `expo` | Core Expo SDK |
| `react-native` | React Native framework |
| `@react-navigation/native` | Navigation container |
| `@react-navigation/native-stack` | Stack navigator (for Details screen) |
| `@react-navigation/bottom-tabs` | Bottom tab navigator (Home, Search, Favorites) |
| `@expo/vector-icons` | *(Third-party)* Ionicons used for tab bar icons (home, search, heart) |
| `@react-native-async-storage/async-storage` | *(Third-party)* Persists saved favorites locally on the device |
| `react-native-safe-area-context` | Safe area handling for notches and navigation bars |
| `react-native-screens` | Native screen optimization for navigation |

---

Navigation Structure

```
NavigationContainer
└── Stack.Navigator
    ├── MainTabs (BottomTab.Navigator)
    │   ├── Home        → HomeScreen.js
    │   ├── Search      → SearchScreen.js
    │   └── Favorites   → FavoritesScreen.js
    └── Details         → DetailsScreen.js  (not in tab bar)
```

---

API Used

**NASA Image and Video Library**  
`https://images-api.nasa.gov/search`  
Free public API — no key required.
