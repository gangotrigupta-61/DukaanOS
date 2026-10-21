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
import { Colors, Spacing, Typography } from '../constants/theme';
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
      setErrorMessage('Product name cannot be empty');
      return;
    }

    if (!quantity.trim()) {
      setErrorMessage('Please enter initial quantity (e.g. 20 or 16.5)');
      return;
    }

    const numQuantity = parseFloat(quantity.trim());
    if (isNaN(numQuantity) || numQuantity < 0) {
      setErrorMessage('Quantity cannot be negative and must be a valid number');
      return;
    }

    if (!lowStockThreshold.trim()) {
      setErrorMessage('Please enter low-stock alert threshold (e.g. 5)');
      return;
    }

    const numThreshold = parseFloat(lowStockThreshold.trim());
    if (isNaN(numThreshold) || numThreshold < 0) {
      setErrorMessage('Low stock threshold cannot be negative and must be a valid number');
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onCancel}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Cancel and go back"
            >
              <Text style={styles.backButtonText}>← Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Add New Product</Text>
            <Text style={styles.subtitle}>
              Add stock items to your offline inventory.
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
              Product Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Chana Dal, Basmati Rice, Tata Salt"
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
              Unit of Measurement
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
              Current Quantity ({unit}) <Text style={styles.required}>*</Text>
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
              Low Stock Alert Below ({unit}) <Text style={styles.required}>*</Text>
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
              You will be notified when stock drops to or below this level
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
              <Text style={styles.saveButtonText}>Save Product to Stock</Text>
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
  fieldHint: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  unitContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  unitChip: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  unitChipSelected: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  unitChipText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  unitChipTextSelected: {
    color: Colors.primaryDark,
    fontWeight: '700',
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
