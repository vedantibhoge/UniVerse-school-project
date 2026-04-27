// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import Login from './Screens/Login/Login';
// import ParentSidebar from './Screens/Parents/Dashboard/ParentSidebar';
// import Sidebar from './Screens/Teachers/Dashboard/Sidebar';
// import AccountSidebar from './Screens/AccountDept/Dashboard/AccountSidebar';
// import DefaultersList from "./Screens/AccountDept/DefaultersList/DefaultersList";
// import ReceiptsList from '../ReceiptsList/ReceiptsList';
// import SendReminders from '../SendReminders/SendReminders';

// const Stack = createStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="Login" component={Login} />
//         <Stack.Screen name="ParentSidebar" component={ParentSidebar} />
//         <Stack.Screen name="TeacherSidebar" component={Sidebar} />
//         <Stack.Screen name="AccountSidebar" component={AccountSidebar} />
//         <Stack.Screen name="DefaultersList" component={DefaultersList} />
//         <Stack.Screen name="ReceiptsList" component={ReceiptsList} />
//         <Stack.Screen name="SendReminders" component={SendReminders} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './Screens/Login/Login';
import ParentSidebar from './Screens/Parents/Dashboard/ParentSidebar';
import Sidebar from './Screens/Teachers/Dashboard/Sidebar';
import AccountSidebar from './Screens/AccountDept/Dashboard/AccountSidebar';

import DefaultersList from './Screens/AccountDept/DefaultersList/DefaultersList';
import ReceiptsList from './Screens/AccountDept/ReceiptsList/ReceiptsList';
import SendReminders from './Screens/AccountDept/SendReminders/SendReminders';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ParentSidebar" component={ParentSidebar} />
        <Stack.Screen name="TeacherSidebar" component={Sidebar} />
        <Stack.Screen name="AccountSidebar" component={AccountSidebar} />

        {/* Account Dept Screens */}
        <Stack.Screen name="DefaultersList" component={DefaultersList} />
        <Stack.Screen name="ReceiptsList" component={ReceiptsList} />
        <Stack.Screen name="SendReminders" component={SendReminders} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}