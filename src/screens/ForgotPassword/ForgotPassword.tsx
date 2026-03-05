import React, { useCallback, useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Brand } from '../../components';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { useAuth } from '../../context/AuthContext';
import { AuthStackScreenProps } from '../../../@types/navigation';

type Props = AuthStackScreenProps<'ForgotPassword'>;

const ForgotPassword = ({ navigation }: Props) => {
  const { forgotPassword, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (error) clearError();
    setEmailError(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const validate = (): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = useCallback(async () => {
    Keyboard.dismiss();
    if (!validate()) return;
    await forgotPassword(email.trim().toLowerCase());
    if (!error) setSent(true);
  }, [email, forgotPassword, error]);

  if (sent) {
    return (
      <View style={styles.successContainer}>
        <Brand height={72} width={72} />
        <Text style={styles.successTitle}>Check your email</Text>
        <Text style={styles.successBody}>
          We sent a password reset link to{'\n'}
          <Text style={styles.successEmail}>{email}</Text>
        </Text>
        <Button
          title="Back to Sign In"
          onPress={() => navigation.navigate('Login')}
          style={styles.btn}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandRow}>
          <Brand height={72} width={72} />
        </View>

        <Text style={styles.title}>Forgot password?</Text>
        <Text style={styles.subtitle}>
          Enter your email and we'll send you a reset link.
        </Text>

        {error ? (
          <View style={styles.apiError}>
            <Text style={styles.apiErrorText}>{error}</Text>
          </View>
        ) : null}

        <Input
          label="Email"
          placeholder="you@example.com"
          keyboardType="email-address"
          returnKeyType="send"
          value={email}
          onChangeText={setEmail}
          error={emailError}
          onSubmitEditing={handleSubmit}
        />

        <Button
          title="Send Reset Link"
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.btn}
        />

        <TouchableOpacity
          style={styles.backRow}
          onPress={() => navigation.goBack()}
          accessibilityRole="link"
        >
          <Text style={styles.backText}>← Back to Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F9FAFB' },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  brandRow: { alignItems: 'center', marginBottom: 32 },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 28,
  },
  apiError: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  apiErrorText: { fontSize: 14, color: '#DC2626' },
  btn: { marginBottom: 16 },
  backRow: { alignItems: 'center' },
  backText: { fontSize: 14, color: '#2563EB', fontWeight: '500' },
  // Success state
  successContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  successBody: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  successEmail: {
    color: '#111827',
    fontWeight: '600',
  },
});
