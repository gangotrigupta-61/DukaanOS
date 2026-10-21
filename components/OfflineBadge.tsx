import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';
import { Strings } from '../constants/strings';

interface OfflineBadgeProps {
  label?: string;
  compact?: boolean;
}

export const OfflineBadge: React.FC<OfflineBadgeProps> = ({
  label = Strings.offlineBadge,
  compact = false,
}) => {
  return (
    <View
      style={[styles.container, compact && styles.containerCompact]}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      <View style={styles.dot} />
      <Text style={[styles.text, compact && styles.textCompact]} numberOfLines={1}>
        {compact ? Strings.offlineShort : label}
      </Text>
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
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    alignSelf: 'flex-start',
  },
  containerCompact: {
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
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
    fontSize: 12,
  },
  textCompact: {
    fontSize: 11,
  },
});
