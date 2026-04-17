import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Screens/Login/Login';
import SchoolDashboard from './Screens/Admin/Dashboard/Dashboard';

import { View, Text, TouchableOpacity } from 'react-native';

const Stack = createStackNavigator();





export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SchoolDashboard" component={SchoolDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}