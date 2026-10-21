import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors, Spacing, Typography } from '../constants/theme';
import { getShop, saveShop } from '../db';

interface ShopSetupScreenProps {
  onComplete: () => void;
  onCancel?: () => void;
}

const SHOP_TYPES = [
  'Kirana / Grocery',
  'General Store',
  'Dairy & Milk',
  'Fruits & Vegetables',
  'Stationery & Chemist',
  'Other Retail',
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'hi-en', label: 'Hinglish' },
];

export const ShopSetupScreen: React.FC<ShopSetupScreenProps> = ({
  onComplete,
  onCancel,
}) => {
  const [shopName, setShopName] = useState('');
  const [shopType, setShopType] = useState('Kirana / Grocery');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasExistingShop, setHasExistingShop] = useState(false);

  useEffect(() => {
    async function loadExisting() {
      try {
        const existing = await getShop();
        if (existing) {
          setShopName(existing.shop_name);
          setShopType(existing.shop_type || 'Kirana / Grocery');
          setLanguage(existing.language || 'en');
          setHasExistingShop(true);
        }
      } catch (err) {
        console.error('Error loading existing shop:', err);
      } finally {
        setLoading(false);
      }
    }
    loadExisting();
  }, []);

  const handleSave = async () => {
    const trimmed = shopName.trim();
    if (!trimmed) {
      setErrorMessage('Please enter your shop name');
      return;
    }

    setErrorMessage(null);
    setSaving(true);

    try {
      await saveShop({
        shop_name: trimmed,
        shop_type: shopType,
        language,
      });
      onComplete();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save shop details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            {onCancel && hasExistingShop && (
              <TouchableOpacity
                onPress={onCancel}
                style={styles.backButton}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.title}>
              {hasExistingShop ? 'Shop Settings' : 'Setup Your Shop'}
            </Text>
            <Text style={styles.subtitle}>
              Configure your local store profile. Everything is stored offline on this device.
            </Text>
          </View>

          {/* Validation Banner */}
          {errorMessage && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            </View>
          )}

          {/* Form Fields */}
          <View style={styles.formSection}>
            <Text style={styles.label}>
              Shop Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Gupta Kirana Store"
              placeholderTextColor={Colors.textMuted}
              value={shopName}
              onChangeText={(text) => {
                setShopName(text);
                if (errorMessage) setErrorMessage(null);
              }}
              autoCapitalize="words"
              autoCorrect={false}
            />

            {/* Shop Type Selection */}
            <Text style={[styles.label, { marginTop: Spacing.lg }]}>Shop Type</Text>
            <View style={styles.chipsContainer}>
              {SHOP_TYPES.map((type) => {
                const isSelected = shopType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => setShopType(type)}
                    accessibilityRole="button"
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Language Selection */}
            <Text style={[styles.label, { marginTop: Spacing.lg }]}>Language</Text>
            <View style={styles.chipsContainer}>
              {LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => setLanguage(lang.code)}
                    accessibilityRole="button"
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}
                    >
                      {lang.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
            accessibilityRole="button"
            accessibilityLabel="Save Shop Details"
          >
            {saving ? (
              <ActivityIndicator color={Colors.textInverse} />
            ) : (
              <Text style={styles.saveButtonText}>
                {hasExistingShop ? 'Update Shop Details' : 'Continue to DukaanOS'}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.xs,
    paddingRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  backButtonText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  title: {
    ...Typography.title,
    color: Colors.primaryDark,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  errorBanner: {
    backgroundColor: '#FFEBEE',
    borderColor: Colors.error,
    borderWidth: 1,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  errorText: {
    ...Typography.bodySmall,
    color: Colors.error,
    fontWeight: '600',
  },
  formSection: {
    marginBottom: Spacing.xl,
  },
  label: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  required: {
    color: Colors.error,
  },
  input: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderStrong,
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    ...Typography.body,
    color: Colors.textPrimary,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  chipSelected: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  chipText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  chipTextSelected: {
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md + 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textInverse,
  },
});
