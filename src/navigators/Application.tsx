import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ApplicationStackParamList } from '../../@types/navigation';
import Startup from '../screens/Startup/Startup';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './Main';

const Stack = createStackNavigator<ApplicationStackParamList>();

const ApplicationNavigator = () => (
  <NavigationContainer>
    <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
    <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: false }}>
      <Stack.Screen name="Startup" component={Startup} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="Main" component={MainNavigator} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default ApplicationNavigator;
