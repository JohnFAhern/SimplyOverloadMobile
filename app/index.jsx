import { Text, View } from "react-native";
import { Link } from "expo-router"
// colors:
// #181C14
// #3C3D37
// #697565
// #ECDFCC
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href='/login'>
        <Text>Go to Login</Text>
      </Link>
    </View>
  );
}
