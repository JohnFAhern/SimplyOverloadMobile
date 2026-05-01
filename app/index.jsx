import { View, ActivityIndicator } from "react-native";

export default function Index() {
  // Navigation is handled by AuthGuard in _layout.jsx.
  // Render a blank loading screen while the redirect fires.
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
