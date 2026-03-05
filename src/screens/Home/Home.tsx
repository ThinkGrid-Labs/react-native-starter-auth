import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Brand } from '../../components';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { user, logout, isLoading } = useAuth();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Brand height={56} width={56} />
          <TouchableOpacity
            onPress={logout}
            disabled={isLoading}
            style={styles.logoutBtn}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
          >
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.greeting}>{user?.name ? `Hello, ${user.name}!` : 'Welcome!'}</Text>
          <Text style={styles.email}>{user?.email ?? ''}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>You're authenticated 🎉</Text>
          <Text style={styles.infoBody}>
            Your access token is stored securely in the device Keychain (iOS Secure Enclave /
            Android Keystore). Replace this screen with your app content.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  logoutBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#DC2626',
  },
  logoutText: { fontSize: 13, fontWeight: '600', color: '#DC2626' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  email: { fontSize: 14, color: '#6B7280' },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1D4ED8',
    marginBottom: 8,
  },
  infoBody: { fontSize: 13, color: '#1E40AF', lineHeight: 20 },
});
