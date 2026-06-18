import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import HomeScreen from "../screens/HomeScreen";
import AddMemberScreen from "../screens/AddMemberScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            animationEnabled: false,
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{
            animationEnabled: true,
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            animationEnabled: true,
          }}
        />
        <Stack.Screen
          name="AddMember"
          component={AddMemberScreen}
          options={{
            animationEnabled: true,
            presentation: "modal",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}