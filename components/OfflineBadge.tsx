import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';

interface OfflineBadgeProps {
  label?: string;
}

export const OfflineBadge: React.FC<OfflineBadgeProps> = ({
  label = 'Offline-first • Data stored on this device',
}) => {
  return (
    <View style={styles.container} accessibilityRole="text" accessibilityLabel={label}>
      <View style={styles.dot} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.accentLight,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: Spacing.sm,
  },
  text: {
    ...Typography.badge,
    color: Colors.primaryDark,
  },
});
