import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainParamsList } from '../../@types/navigation';
import Home from '../screens/Home/Home';

const Stack = createStackNavigator<MainParamsList>();

const MainNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={Home} />
  </Stack.Navigator>
);

export default MainNavigator;
