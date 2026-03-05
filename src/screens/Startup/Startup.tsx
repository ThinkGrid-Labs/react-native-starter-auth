import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Brand } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { ApplicationScreenProps } from '../../../@types/navigation';

const Startup = ({ navigation }: ApplicationScreenProps) => {
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{ name: isAuthenticated ? 'Main' : 'Auth' }],
    });
  }, [isLoading, isAuthenticated, navigation]);

  return (
    <View style={styles.wrapper}>
      <Brand height={120} width={120} />
      <ActivityIndicator size="large" color="#2563EB" style={styles.spinner} />
    </View>
  );
};

export default Startup;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: { marginTop: 40 },
});
