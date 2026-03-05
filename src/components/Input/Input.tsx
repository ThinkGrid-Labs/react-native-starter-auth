import React, { forwardRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, secureTextEntry, style, ...props }, ref) => {
    const [hidden, setHidden] = useState(secureTextEntry ?? false);

    return (
      <View style={styles.wrapper}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <View style={[styles.inputRow, error ? styles.inputError : styles.inputNormal]}>
          <TextInput
            ref={ref}
            style={[styles.input, style]}
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            secureTextEntry={hidden}
            {...props}
          />
          {secureTextEntry ? (
            <TouchableOpacity
              onPress={() => setHidden(h => !h)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            >
              <Text style={styles.toggle}>{hidden ? 'Show' : 'Hide'}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  },
);

Input.displayName = 'Input';

export default Input;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  inputNormal: {
    borderColor: '#D1D5DB',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: '#111827',
  },
  toggle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
    paddingLeft: 8,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: '#DC2626',
  },
});
