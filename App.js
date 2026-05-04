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
import TeacherSidebar from './Screens/Teachers/Dashboard/Sidebar';
import AccountSidebar from './Screens/AccountDept/Dashboard/AccountSidebar';
import Committee from './Screens/Committee/Dashboard/Dashboard';
import StudentManagement from './Screens/Committee/Student/StudentManagement';
import FacultyManagement from './Screens/Committee/Faculty/FacultyManagement';
import ParentManagement from './Screens/Committee/Parent/ParentManagement';
import Permission from './Screens/Committee/Permission/Permission';
import AddSchool from './Screens/Committee/AddSchool/AddSchool';

import DefaultersList from './Screens/AccountDept/DefaultersList/DefaultersList';
import ReceiptsList from './Screens/AccountDept/ReceiptsList/ReceiptsList';
import SendReminders from './Screens/AccountDept/SendReminders/SendReminders';
import DirectorSidebar from './Screens/Director/Dashboard/Sidebar';
import Report from './Screens/Director/Report/Report';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ParentSidebar" component={ParentSidebar} />
        <Stack.Screen name="TeacherSidebar" component={TeacherSidebar} />
        <Stack.Screen name="AccountSidebar" component={AccountSidebar} />
        <Stack.Screen name="CommitteeSidebar" component={Committee} />
        <Stack.Screen name="StudentManagement" component={StudentManagement} />
        <Stack.Screen name="FacultyManagement" component={FacultyManagement} />
        <Stack.Screen name="ParentManagement" component={ParentManagement} />
        <Stack.Screen name="Permission" component={Permission} />
        <Stack.Screen name="AddSchool" component={AddSchool} />

        {/* Director Shell */}
        <Stack.Screen name="DirectorSidebar" component={DirectorSidebar} />

        {/* Report (Director) */}
        <Stack.Screen name="Report" component={Report} />

        {/* Account Dept Screens */}
        <Stack.Screen name="DefaultersList" component={DefaultersList} />
        <Stack.Screen name="ReceiptsList" component={ReceiptsList} />
        <Stack.Screen name="SendReminders" component={SendReminders} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}