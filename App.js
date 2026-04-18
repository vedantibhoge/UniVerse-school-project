import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Screens/Login/Login';
import SchoolDashboard from './Screens/Admin/Dashboard/Dashboard';
import PrincipalSidebar from './Screens/principal/PrincipalSidebar';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SchoolDashboard" component={SchoolDashboard} />
        <Stack.Screen name="PrincipalDashboard" component={PrincipalSidebar} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}