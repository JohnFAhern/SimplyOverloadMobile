import { Stack } from "expo-router";
import { TalkProvider } from "./context/TalkContext";

export default function RootLayout() {
  return(
    <TalkProvider>
      <Stack />
    </TalkProvider>
  ) 
}
