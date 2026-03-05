import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'ghost';
}

const Button = ({ title, loading, variant = 'primary', disabled, style, ...props }: ButtonProps) => {
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      style={[
        styles.base,
        isPrimary ? styles.primary : styles.ghost,
        isDisabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      {...props}
    >
      {loading ? (
        <View style={styles.row}>
          <ActivityIndicator
            size="small"
            color={isPrimary ? '#FFFFFF' : '#2563EB'}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.label, isPrimary ? styles.labelPrimary : styles.labelGhost]}>
            {title}
          </Text>
        </View>
      ) : (
        <Text style={[styles.label, isPrimary ? styles.labelPrimary : styles.labelGhost]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: '#2563EB',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#2563EB',
  },
  disabled: {
    opacity: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  labelPrimary: {
    color: '#FFFFFF',
  },
  labelGhost: {
    color: '#2563EB',
  },
});
