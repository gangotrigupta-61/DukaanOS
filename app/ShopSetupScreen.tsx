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
import { Colors, Spacing, Touch, Typography } from '../constants/theme';
import { Language, TranslationStrings } from '../constants/strings';
import { useLanguage } from '../context';
import { getShop, saveShop } from '../db';

interface ShopSetupScreenProps {
  onComplete: () => void;
  onCancel?: () => void;
}

const getShopTypes = (s: TranslationStrings) => [
  { label: s.shopTypeKirana, value: 'Kirana / Grocery' },
  { label: s.shopTypeGeneral, value: 'General Store' },
  { label: s.shopTypeDairy, value: 'Dairy & Milk' },
  { label: s.shopTypeVegetables, value: 'Fruits & Vegetables' },
  { label: s.shopTypeChemist, value: 'Stationery & Chemist' },
  { label: s.shopTypeOther, value: 'Other Retail' },
];

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'hi-en', label: 'Hinglish (हिंग्लिश)' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'en', label: 'English' },
];

export const ShopSetupScreen: React.FC<ShopSetupScreenProps> = ({
  onComplete,
  onCancel,
}) => {
  const { language: globalLanguage, setLanguage: setGlobalLanguage, strings } = useLanguage();
  const [shopName, setShopName] = useState('');
  const [shopType, setShopType] = useState('Kirana / Grocery');
  const [language, setLanguage] = useState<Language>(globalLanguage);
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
          const existingLang = (existing.language as Language) || 'hi-en';
          setLanguage(existingLang);
          setGlobalLanguage(existingLang);
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

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setGlobalLanguage(newLang);
  };

  const handleSave = async () => {
    const trimmed = shopName.trim();
    if (!trimmed) {
      setErrorMessage(strings.valEnterShopName);
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
      await setGlobalLanguage(language);
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

  const shopTypes = getShopTypes(strings);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            {onCancel && hasExistingShop && (
              <TouchableOpacity
                onPress={onCancel}
                style={styles.backButton}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Text style={styles.backButtonText}>{strings.btnCancel}</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.title}>
              {hasExistingShop ? strings.shopDetails : strings.shopSetup}
            </Text>
            <Text style={styles.subtitle}>{strings.shopSetupSubtitle}</Text>
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
              {strings.shopNameLabel} <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder={strings.shopNamePlaceholder}
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
            <Text style={[styles.label, { marginTop: Spacing.lg }]}>
              {strings.shopTypeLabel}
            </Text>
            <View style={styles.chipsContainer}>
              {shopTypes.map((type) => {
                const isSelected = shopType === type.value;
                return (
                  <TouchableOpacity
                    key={type.value}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => setShopType(type.value)}
                    accessibilityRole="button"
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Language Selection */}
            <Text style={[styles.label, { marginTop: Spacing.lg }]}>
              {strings.languageLabel}
            </Text>
            <View style={styles.chipsContainer}>
              {LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => handleLanguageChange(lang.code)}
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
            accessibilityLabel={strings.btnSaveShop}
          >
            {saving ? (
              <ActivityIndicator color={Colors.textInverse} />
            ) : (
              <Text style={styles.saveButtonText}>{strings.btnSaveShop}</Text>
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
    paddingTop: Platform.OS === 'android' ? Spacing.xl : Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.md,
    borderRadius: 8,
    backgroundColor: Colors.surfaceMuted,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  title: {
    ...Typography.title,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  errorBanner: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#FFCDD2',
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '500',
  },
  formSection: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  required: {
    color: Colors.error,
  },
  input: {
    height: Touch.inputHeight,
    backgroundColor: Colors.surfaceMuted,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceMuted,
    minHeight: Touch.chipHeight,
    justifyContent: 'center',
  },
  chipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySurface,
  },
  chipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    height: Touch.buttonHeight,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textInverse,
  },
});
