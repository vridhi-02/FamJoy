import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { FamilyProvider } from "./src/context/FamilyContext";

export default function App() {
  return (
    <FamilyProvider>
      <AppNavigator />
    </FamilyProvider>
  );
}