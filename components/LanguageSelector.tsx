import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../context';
import { Language } from '../constants/strings';
import { Colors } from '../constants/theme';

export interface LanguageSelectorProps {
  compact?: boolean;
}

const LANGUAGE_OPTIONS: { code: Language; label: string; short: string }[] = [
  { code: 'hi-en', label: 'Hinglish (हिंग्लिश)', short: 'हिंग्लिश' },
  { code: 'hi', label: 'हिंदी (Hindi)', short: 'हिंदी' },
  { code: 'en', label: 'English', short: 'Eng' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      {LANGUAGE_OPTIONS.map((opt) => {
        const isSelected = language === opt.code;
        return (
          <TouchableOpacity
            key={opt.code}
            style={[
              styles.pill,
              compact && styles.pillCompact,
              isSelected && styles.pillSelected,
            ]}
            onPress={() => setLanguage(opt.code)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Switch language to ${opt.label}`}
          >
            <Text
              style={[
                styles.pillText,
                compact && styles.pillTextCompact,
                isSelected && styles.pillTextSelected,
              ]}
            >
              {compact ? opt.short : opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceMuted,
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.border,
    alignSelf: 'flex-start',
  },
  containerCompact: {
    borderRadius: 16,
    padding: 2,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillCompact: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  pillSelected: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  pillTextCompact: {
    fontSize: 11,
    fontWeight: '700',
  },
  pillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
