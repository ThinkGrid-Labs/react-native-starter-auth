import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Brand } from '../../components';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import { useAuth } from '../../context/AuthContext';
import { AuthStackScreenProps } from '../../../@types/navigation';

type Props = AuthStackScreenProps<'Register'>;

const Register = ({ navigation }: Props) => {
  const { register, isLoading, error, clearError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  useEffect(() => {
    if (error) {
      clearError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, email, password, confirmPassword]);

  const validate = (): boolean => {
    const errors: typeof fieldErrors = {};
    if (!name.trim()) {
      errors.name = 'Full name is required.';
    }
    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Enter a valid email address.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    Keyboard.dismiss();
    if (!validate()) {
      return;
    }
    await register(name.trim(), email.trim().toLowerCase(), password);
  };

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
          <Brand height={64} width={64} />
        </View>

        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Start your journey today</Text>

        {error ? (
          <View style={styles.apiError}>
            <Text style={styles.apiErrorText}>{error}</Text>
          </View>
        ) : null}

        <Input
          label="Full Name"
          placeholder="Jane Doe"
          returnKeyType="next"
          value={name}
          onChangeText={setName}
          error={fieldErrors.name}
          onSubmitEditing={() => emailRef.current?.focus()}
        />

        <Input
          ref={emailRef}
          label="Email"
          placeholder="you@example.com"
          keyboardType="email-address"
          returnKeyType="next"
          value={email}
          onChangeText={setEmail}
          error={fieldErrors.email}
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        <Input
          ref={passwordRef}
          label="Password"
          placeholder="Min. 8 characters"
          secureTextEntry
          returnKeyType="next"
          value={password}
          onChangeText={setPassword}
          error={fieldErrors.password}
          onSubmitEditing={() => confirmRef.current?.focus()}
        />

        <Input
          ref={confirmRef}
          label="Confirm Password"
          placeholder="••••••••"
          secureTextEntry
          returnKeyType="done"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={fieldErrors.confirmPassword}
          onSubmitEditing={handleRegister}
        />

        <Button
          title="Create Account"
          onPress={handleRegister}
          loading={isLoading}
          style={styles.btn}
        />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} accessibilityRole="link">
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F9FAFB' },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 40,
  },
  brandRow: { alignItems: 'center', marginBottom: 24 },
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
  btn: { marginTop: 8, marginBottom: 24 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: { fontSize: 14, color: '#6B7280' },
  footerLink: { fontSize: 14, color: '#2563EB', fontWeight: '600' },
});
