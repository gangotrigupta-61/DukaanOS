import React, { useState } from 'react';
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
import { useLanguage } from '../context';
import { addProduct } from '../db';
import { SUPPORTED_UNITS, SupportedUnit } from '../types';

interface AddProductScreenProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddProductScreen: React.FC<AddProductScreenProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { strings } = useLanguage();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<SupportedUnit>('kg');
  const [lowStockThreshold, setLowStockThreshold] = useState('5');
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = async () => {
    const cleanName = name.trim();
    if (!cleanName) {
      setErrorMessage(strings.valEnterName);
      return;
    }

    if (!quantity.trim()) {
      setErrorMessage(strings.valEnterQty);
      return;
    }

    const numQuantity = parseFloat(quantity.trim());
    if (isNaN(numQuantity) || numQuantity < 0) {
      setErrorMessage(strings.valEnterQty);
      return;
    }

    if (!lowStockThreshold.trim()) {
      setErrorMessage(strings.valEnterThreshold);
      return;
    }

    const numThreshold = parseFloat(lowStockThreshold.trim());
    if (isNaN(numThreshold) || numThreshold < 0) {
      setErrorMessage(strings.valEnterThreshold);
      return;
    }

    setErrorMessage(null);
    setSaving(true);

    try {
      await addProduct({
        name: cleanName,
        quantity: numQuantity,
        unit,
        low_stock_threshold: numThreshold,
      });
      onSuccess();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

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
            <TouchableOpacity
              onPress={onCancel}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel={strings.btnCancel}
            >
              <Text style={styles.backButtonText}>{strings.btnCancel}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{strings.addProductTitle}</Text>
            <Text style={styles.subtitle}>{strings.addProductSubtitle}</Text>
          </View>

          {/* Validation Banner */}
          {errorMessage && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            </View>
          )}

          {/* Form */}
          <View style={styles.formSection}>
            {/* Product Name */}
            <Text style={styles.label}>
              {strings.productNameLabel} <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder={strings.productNamePlaceholder}
              placeholderTextColor={Colors.textMuted}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errorMessage) setErrorMessage(null);
              }}
              autoCapitalize="words"
            />

            {/* Unit Selector */}
            <Text style={[styles.label, { marginTop: Spacing.lg }]}>
              {strings.unitLabel} <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.unitContainer}>
              {SUPPORTED_UNITS.map((u) => {
                const isSelected = unit === u;
                return (
                  <TouchableOpacity
                    key={u}
                    style={[styles.unitChip, isSelected && styles.unitChipSelected]}
                    onPress={() => setUnit(u)}
                    accessibilityRole="button"
                  >
                    <Text
                      style={[
                        styles.unitChipText,
                        isSelected && styles.unitChipTextSelected,
                      ]}
                    >
                      {u}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Quantity */}
            <Text style={[styles.label, { marginTop: Spacing.lg }]}>
              {strings.quantityLabel} ({unit}) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder={strings.quantityPlaceholder}
              placeholderTextColor={Colors.textMuted}
              value={quantity}
              onChangeText={(text) => {
                setQuantity(text);
                if (errorMessage) setErrorMessage(null);
              }}
              keyboardType="decimal-pad"
            />
            <Text style={styles.fieldHint}>{strings.fractionalTip}</Text>

            {/* Low Stock Threshold */}
            <Text style={[styles.label, { marginTop: Spacing.lg }]}>
              {strings.thresholdLabel} ({unit}) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder={strings.thresholdPlaceholder}
              placeholderTextColor={Colors.textMuted}
              value={lowStockThreshold}
              onChangeText={(text) => {
                setLowStockThreshold(text);
                if (errorMessage) setErrorMessage(null);
              }}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
            accessibilityRole="button"
            accessibilityLabel={strings.btnSaveProduct}
          >
            {saving ? (
              <ActivityIndicator color={Colors.textInverse} />
            ) : (
              <Text style={styles.saveButtonText}>{strings.btnSaveProduct}</Text>
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
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
    minHeight: Touch.minTarget,
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
    paddingRight: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  backButtonText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '700',
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
  unitContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  unitChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceMuted,
    minHeight: Touch.chipHeight,
    justifyContent: 'center',
  },
  unitChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySurface,
  },
  unitChipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  unitChipTextSelected: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  fieldHint: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginTop: Spacing.xs + 2,
    fontSize: 12,
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
