/**
 * Example app for @think-grid-labs/react-native-starter-auth
 *
 * Demonstrates all three integration patterns:
 *   1. Drop-in  — ApplicationNavigator handles everything
 *   2. Custom nav — AuthNavigator inside your own NavigationContainer
 *   3. Individual screens — drop LoginScreen into any existing stack
 *
 * Switch the DEMO constant below to try each pattern.
 */

import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  ApplicationNavigator,
  AuthNavigator,
  AuthProvider,
  Button,
  Input,
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  useAuth,
} from '@think-grid-labs/react-native-starter-auth';

// ─── Config ──────────────────────────────────────────────────────────────────

/**
 * Replace with your own backend URL.
 * The example will hit real endpoints — leave as-is to see error handling in action.
 */
const AUTH_CONFIG = {
  baseURL: 'https://api.yourapp.com',
};

type Demo = 'drop-in' | 'custom-nav' | 'individual-screens' | 'components';
const DEMO: Demo = 'drop-in';

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  if (DEMO === 'drop-in') {
    return <DropInDemo />;
  }
  if (DEMO === 'custom-nav') {
    return <CustomNavDemo />;
  }
  if (DEMO === 'individual-screens') {
    return <IndividualScreensDemo />;
  }
  return <ComponentsDemo />;
}

// ─── Demo 1: Drop-in (recommended) ───────────────────────────────────────────

/**
 * Wrap AuthProvider + ApplicationNavigator.
 * The library handles splash screen, session restore, and routing automatically.
 */
function DropInDemo() {
  return (
    <AuthProvider config={AUTH_CONFIG}>
      <ApplicationNavigator />
    </AuthProvider>
  );
}

// ─── Demo 2: Custom NavigationContainer ──────────────────────────────────────

const RootStack = createStackNavigator();

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <RootStack.Screen name="App" component={MyProtectedApp} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
}

function CustomNavDemo() {
  return (
    <AuthProvider config={AUTH_CONFIG}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

function MyProtectedApp() {
  const { user, logout } = useAuth();
  return (
    <View style={styles.center}>
      <Text style={styles.heading}>You are logged in!</Text>
      <Text style={styles.sub}>{user?.email}</Text>
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Demo 3: Individual screens ───────────────────────────────────────────────

const IndivStack = createStackNavigator();

function IndividualScreensDemo() {
  return (
    <AuthProvider config={AUTH_CONFIG}>
      <NavigationContainer>
        <IndivStack.Navigator screenOptions={{ headerShown: false }}>
          <IndivStack.Screen name="Login" component={LoginScreen} />
          <IndivStack.Screen name="Register" component={RegisterScreen} />
          <IndivStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </IndivStack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

// ─── Demo 4: Reusable components ─────────────────────────────────────────────

function ComponentsDemo() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = React.useState<string | undefined>();

  const validate = () => {
    setEmailError(!email.includes('@') ? 'Enter a valid email.' : undefined);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.demoHeader}>Components Demo</Text>
      <Text style={styles.platform}>Platform: {Platform.OS}</Text>

      <Section title="Input component">
        <Input
          label="Email"
          placeholder="you@example.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={emailError}
        />
        <Input
          label="Password"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </Section>

      <Section title="Button component">
        <Button title="Primary button" onPress={validate} style={{ marginBottom: 12 }} />
        <Button title="Ghost button" variant="ghost" onPress={() => {}} style={{ marginBottom: 12 }} />
        <Button title="Loading state" onPress={() => {}} loading style={{ marginBottom: 12 }} />
        <Button title="Disabled" onPress={() => {}} disabled />
      </Section>
    </ScrollView>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#F9FAFB',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  demoHeader: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  platform: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  sub: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 32,
  },
  section: {
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  logoutBtn: {
    borderWidth: 1.5,
    borderColor: '#DC2626',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  logoutText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 14,
  },
});
