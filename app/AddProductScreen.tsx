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
import { Strings } from '../constants/strings';
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
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<SupportedUnit>('kg');
  const [lowStockThreshold, setLowStockThreshold] = useState('5');
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = async () => {
    const cleanName = name.trim();
    if (!cleanName) {
      setErrorMessage(Strings.valEnterName);
      return;
    }

    if (!quantity.trim()) {
      setErrorMessage(Strings.valEnterQty);
      return;
    }

    const numQuantity = parseFloat(quantity.trim());
    if (isNaN(numQuantity) || numQuantity < 0) {
      setErrorMessage(Strings.valEnterQty);
      return;
    }

    if (!lowStockThreshold.trim()) {
      setErrorMessage(Strings.valEnterThreshold);
      return;
    }

    const numThreshold = parseFloat(lowStockThreshold.trim());
    if (isNaN(numThreshold) || numThreshold < 0) {
      setErrorMessage(Strings.valEnterThreshold);
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
              accessibilityLabel="Cancel and go back"
            >
              <Text style={styles.backButtonText}>{Strings.btnCancel}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{Strings.addProduct}</Text>
            <Text style={styles.subtitle}>
              Add stock items to your offline inventory • नया सामान जोड़ें
            </Text>
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
              Product Name / सामान का नाम <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Basmati Rice, Chana Dal, Sugar"
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
              Unit of Measurement / इकाई <Text style={styles.required}>*</Text>
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
              Initial Stock Quantity / मात्रा ({unit}) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 20 or 16.5 (decimals supported)"
              placeholderTextColor={Colors.textMuted}
              value={quantity}
              onChangeText={(text) => {
                setQuantity(text);
                if (errorMessage) setErrorMessage(null);
              }}
              keyboardType="decimal-pad"
            />
            <Text style={styles.fieldHint}>
              Supports fractional amounts (e.g. 12.5 kg or 0.5 litre)
            </Text>

            {/* Low Stock Threshold */}
            <Text style={[styles.label, { marginTop: Spacing.lg }]}>
              Low Stock Alert Below / अलर्ट मात्रा ({unit}) <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 5"
              placeholderTextColor={Colors.textMuted}
              value={lowStockThreshold}
              onChangeText={(text) => {
                setLowStockThreshold(text);
                if (errorMessage) setErrorMessage(null);
              }}
              keyboardType="decimal-pad"
            />
            <Text style={styles.fieldHint}>
              You will be alerted when stock reaches or drops below this level
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
            accessibilityRole="button"
            accessibilityLabel="Save Product to Stock"
          >
            {saving ? (
              <ActivityIndicator color={Colors.textInverse} />
            ) : (
              <Text style={styles.saveButtonText}>{Strings.btnSaveProduct}</Text>
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
    color: Colors.primaryDark,
    fontSize: 24,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 2,
    fontSize: 13,
  },
  errorBanner: {
    backgroundColor: '#FFEBEE',
    borderColor: Colors.error,
    borderWidth: 1,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  errorText: {
    ...Typography.bodySmall,
    color: Colors.error,
    fontWeight: '700',
  },
  formSection: {
    marginBottom: Spacing.xl,
  },
  label: {
    ...Typography.body,
    fontWeight: '700',
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
    minHeight: Touch.inputHeight,
    ...Typography.body,
    color: Colors.textPrimary,
  },
  fieldHint: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginTop: 4,
    fontSize: 12,
  },
  unitContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  unitChip: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1.5,
    borderRadius: 22,
    minHeight: Touch.chipHeight,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitChipSelected: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primary,
  },
  unitChipText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  unitChipTextSelected: {
    color: Colors.primaryDark,
    fontWeight: '800',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    minHeight: Touch.buttonHeight,
    borderRadius: 12,
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
    ...Typography.subtitle,
    fontWeight: '700',
    color: Colors.textInverse,
  },
});
