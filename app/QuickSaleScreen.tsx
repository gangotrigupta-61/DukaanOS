import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
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
import { getProducts, recordSale } from '../db';
import { Product, RecordSaleResult } from '../types';

interface QuickSaleScreenProps {
  onBack: () => void;
  onNavigateToAddProduct: () => void;
  onNavigateToProducts: () => void;
}

export const QuickSaleScreen: React.FC<QuickSaleScreenProps> = ({
  onBack,
  onNavigateToAddProduct,
  onNavigateToProducts,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [saleQuantity, setSaleQuantity] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSaleResult, setLastSaleResult] = useState<RecordSaleResult | null>(null);

  const loadProducts = async () => {
    try {
      const list = await getProducts();
      setProducts(list);

      // If a product was selected, update its reference with latest stock
      if (selectedProduct) {
        const updated = list.find((p) => p.id === selectedProduct.id);
        if (updated) setSelectedProduct(updated);
      }
    } catch (err) {
      console.error('Failed to load products for quick sale:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSelectProduct = (product: Product) => {
    if (product.quantity <= 0) {
      setErrorMessage(`"${product.name}" is out of stock (0 ${product.unit} available).`);
      return;
    }
    setSelectedProduct(product);
    setSaleQuantity('');
    setErrorMessage(null);
    setLastSaleResult(null);
  };

  const handleRecordSale = async () => {
    if (!selectedProduct) {
      setErrorMessage('Please select a product to sell');
      return;
    }

    const trimmedQty = saleQuantity.trim();
    if (!trimmedQty) {
      setErrorMessage('Please enter the sale quantity');
      return;
    }

    const numQty = parseFloat(trimmedQty);
    if (isNaN(numQty) || numQty <= 0) {
      setErrorMessage('Quantity must be greater than 0');
      return;
    }

    if (numQty > selectedProduct.quantity) {
      setErrorMessage(
        `Not enough stock. Available: ${selectedProduct.quantity} ${selectedProduct.unit}`
      );
      return;
    }

    setErrorMessage(null);
    setIsRecording(true);

    try {
      const result = await recordSale({
        product_id: selectedProduct.id,
        quantity: numQty,
      });

      // Update local state and reload product list immediately
      setLastSaleResult(result);
      setSelectedProduct(result.product);
      setSaleQuantity('');
      await loadProducts();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to record sale');
    } finally {
      setIsRecording(false);
    }
  };

  const handlePresetQty = (qty: number) => {
    if (!selectedProduct) return;
    setSaleQuantity(String(qty));
    setErrorMessage(null);
  };

  // Calculate live preview of remaining stock
  const parsedQty = parseFloat(saleQuantity.trim());
  const isValidSaleNumber = !isNaN(parsedQty) && parsedQty > 0;
  const isOverStock =
    selectedProduct && isValidSaleNumber && parsedQty > selectedProduct.quantity;
  const remainingPreview =
    selectedProduct && isValidSaleNumber && !isOverStock
      ? Math.round((selectedProduct.quantity - parsedQty) * 10000) / 10000
      : null;

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
              onPress={onBack}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Back to previous screen"
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <View style={styles.headerTitleRow}>
              <View>
                <Text style={styles.title}>Quick Sale</Text>
                <Text style={styles.subtitle}>
                  Select product, enter quantity, record sale
                </Text>
              </View>
              <View style={styles.badgeOffline}>
                <Text style={styles.badgeOfflineText}>Offline</Text>
              </View>
            </View>
          </View>

          {/* Success Banner */}
          {lastSaleResult && (
            <View style={styles.successBanner}>
              <View style={styles.successHeaderRow}>
                <Text style={styles.successIcon}>✅</Text>
                <Text style={styles.successTitle}>Sale Recorded Successfully!</Text>
              </View>
              <Text style={styles.successDetails}>
                Sold <Text style={styles.boldText}>{lastSaleResult.sale.quantity} {lastSaleResult.product.unit}</Text> of{' '}
                <Text style={styles.boldText}>{lastSaleResult.product.name}</Text>
              </Text>
              <Text style={styles.successRemaining}>
                Remaining stock:{' '}
                <Text style={styles.boldText}>
                  {lastSaleResult.remaining_quantity} {lastSaleResult.product.unit}
                </Text>
              </Text>

              <View style={styles.successActions}>
                <TouchableOpacity
                  style={styles.viewProductsButton}
                  onPress={onNavigateToProducts}
                  accessibilityRole="button"
                >
                  <Text style={styles.viewProductsButtonText}>View Products List →</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            </View>
          )}

          {/* Loading or Empty State */}
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading inventory...</Text>
            </View>
          ) : products.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Text style={styles.emptyIcon}>📦</Text>
              </View>
              <Text style={styles.emptyTitle}>No products available</Text>
              <Text style={styles.emptySubtitle}>
                You need to add products to your stock before you can record sales.
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={onNavigateToAddProduct}
                accessibilityRole="button"
                accessibilityLabel="Add Product"
              >
                <Text style={styles.emptyButtonText}>+ Add Product Now</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {/* Step 1: Select Product */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  1. Select Product {selectedProduct && `(Selected: ${selectedProduct.name})`}
                </Text>
                <View style={styles.productsList}>
                  {products.map((p) => {
                    const isSelected = selectedProduct?.id === p.id;
                    const isOutOfStock = p.quantity <= 0;

                    return (
                      <TouchableOpacity
                        key={p.id}
                        style={[
                          styles.productItem,
                          isSelected && styles.productItemSelected,
                          isOutOfStock && styles.productItemOutOfStock,
                        ]}
                        onPress={() => handleSelectProduct(p)}
                        accessibilityRole="button"
                        accessibilityLabel={`Select ${p.name}, current stock ${p.quantity} ${p.unit}`}
                      >
                        <View style={styles.productItemLeft}>
                          <Text
                            style={[
                              styles.productItemName,
                              isSelected && styles.productItemNameSelected,
                            ]}
                          >
                            {p.name}
                          </Text>
                          {isOutOfStock ? (
                            <Text style={styles.outOfStockText}>Out of stock</Text>
                          ) : (
                            <Text style={styles.thresholdSubtext}>
                              Alert below: {p.low_stock_threshold} {p.unit}
                            </Text>
                          )}
                        </View>

                        <View
                          style={[
                            styles.productStockBadge,
                            isSelected && styles.productStockBadgeSelected,
                            isOutOfStock && styles.productStockBadgeEmpty,
                          ]}
                        >
                          <Text
                            style={[
                              styles.productStockQty,
                              isSelected && styles.productStockQtySelected,
                              isOutOfStock && styles.productStockQtyEmpty,
                            ]}
                          >
                            {Number(p.quantity).toLocaleString(undefined, {
                              maximumFractionDigits: 3,
                            })}
                          </Text>
                          <Text
                            style={[
                              styles.productStockUnit,
                              isSelected && styles.productStockUnitSelected,
                              isOutOfStock && styles.productStockUnitEmpty,
                            ]}
                          >
                            {p.unit}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Step 2: Enter Sale Quantity (Shown when a product is selected) */}
              {selectedProduct && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    2. Enter Sale Quantity ({selectedProduct.unit})
                  </Text>

                  <View style={styles.quantityCard}>
                    <View style={styles.selectedProductBanner}>
                      <Text style={styles.selectedProductName}>
                        {selectedProduct.name}
                      </Text>
                      <Text style={styles.selectedProductStock}>
                        In Stock:{' '}
                        <Text style={styles.boldText}>
                          {selectedProduct.quantity} {selectedProduct.unit}
                        </Text>
                      </Text>
                    </View>

                    {/* Quick Preset Buttons for Kirana fast entry */}
                    <Text style={styles.presetLabel}>Quick Presets:</Text>
                    <View style={styles.presetsRow}>
                      {[0.5, 1, 2, 5].map((preset) => (
                        <TouchableOpacity
                          key={preset}
                          style={styles.presetChip}
                          onPress={() => handlePresetQty(preset)}
                          accessibilityRole="button"
                        >
                          <Text style={styles.presetChipText}>
                            +{preset} {selectedProduct.unit}
                          </Text>
                        </TouchableOpacity>
                      ))}
                      <TouchableOpacity
                        style={styles.presetChipAll}
                        onPress={() => handlePresetQty(selectedProduct.quantity)}
                        accessibilityRole="button"
                      >
                        <Text style={styles.presetChipAllText}>
                          All ({selectedProduct.quantity})
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Numeric Input */}
                    <Text style={styles.inputLabel}>
                      Quantity Sold ({selectedProduct.unit}) <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={[styles.input, isOverStock && styles.inputError]}
                      placeholder="e.g. 3.5, 1, 0.5 (decimals supported)"
                      placeholderTextColor={Colors.textMuted}
                      value={saleQuantity}
                      onChangeText={(val) => {
                        setSaleQuantity(val);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      keyboardType="decimal-pad"
                      autoFocus={false}
                    />

                    {/* Live Confirmation Summary Box */}
                    {isValidSaleNumber && (
                      <View
                        style={[
                          styles.summaryBox,
                          isOverStock ? styles.summaryBoxError : styles.summaryBoxValid,
                        ]}
                      >
                        <Text style={styles.summaryTitle}>Sale Summary</Text>

                        <View style={styles.summaryRow}>
                          <Text style={styles.summaryLabel}>Product:</Text>
                          <Text style={styles.summaryValue}>{selectedProduct.name}</Text>
                        </View>

                        <View style={styles.summaryRow}>
                          <Text style={styles.summaryLabel}>Sold:</Text>
                          <Text
                            style={[
                              styles.summaryValue,
                              { color: Colors.primaryDark, fontWeight: '700' },
                            ]}
                          >
                            {parsedQty} {selectedProduct.unit}
                          </Text>
                        </View>

                        <View style={styles.summaryRow}>
                          <Text style={styles.summaryLabel}>Remaining:</Text>
                          {isOverStock ? (
                            <Text style={styles.summaryValueNegative}>
                              Not enough stock (Short by{' '}
                              {Math.round((parsedQty - selectedProduct.quantity) * 1000) / 1000}{' '}
                              {selectedProduct.unit})
                            </Text>
                          ) : (
                            <Text
                              style={[
                                styles.summaryValue,
                                { color: Colors.success, fontWeight: '700' },
                              ]}
                            >
                              {remainingPreview} {selectedProduct.unit}
                            </Text>
                          )}
                        </View>
                      </View>
                    )}

                    {/* Action Button: Record Sale */}
                    <TouchableOpacity
                      style={[
                        styles.recordButton,
                        (!isValidSaleNumber || isOverStock || isRecording) &&
                          styles.recordButtonDisabled,
                      ]}
                      onPress={handleRecordSale}
                      disabled={!isValidSaleNumber || isOverStock || isRecording}
                      accessibilityRole="button"
                      accessibilityLabel="Record Sale"
                    >
                      {isRecording ? (
                        <ActivityIndicator color={Colors.textInverse} />
                      ) : (
                        <Text style={styles.recordButtonText}>
                          Record Sale ({parsedQty || 0} {selectedProduct.unit})
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
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
    marginBottom: Spacing.md,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.xs,
    paddingRight: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  backButtonText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...Typography.title,
    color: Colors.primaryDark,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  badgeOffline: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.accentLight,
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  badgeOfflineText: {
    ...Typography.badge,
    color: Colors.primaryDark,
  },
  successBanner: {
    backgroundColor: '#E8F5E9',
    borderColor: Colors.success,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  successHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  successIcon: {
    fontSize: 20,
    marginRight: Spacing.xs,
  },
  successTitle: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  successDetails: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  successRemaining: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  boldText: {
    fontWeight: '700',
  },
  successActions: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
  },
  viewProductsButton: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 6,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
  },
  viewProductsButtonText: {
    ...Typography.bodySmall,
    color: Colors.textInverse,
    fontWeight: '600',
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
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyTitle: {
    ...Typography.subtitle,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 10,
  },
  emptyButtonText: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
    fontWeight: '700',
  },
  productsList: {
    gap: Spacing.sm,
  },
  productItem: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySurface,
  },
  productItemOutOfStock: {
    opacity: 0.5,
    backgroundColor: Colors.surfaceMuted,
  },
  productItemLeft: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  productItemName: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  productItemNameSelected: {
    color: Colors.primaryDark,
  },
  thresholdSubtext: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginTop: 2,
  },
  outOfStockText: {
    ...Typography.bodySmall,
    color: Colors.error,
    fontWeight: '600',
    marginTop: 2,
  },
  productStockBadge: {
    backgroundColor: Colors.surfaceMuted,
    borderRadius: 8,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    minWidth: 70,
  },
  productStockBadgeSelected: {
    backgroundColor: Colors.primary,
  },
  productStockBadgeEmpty: {
    backgroundColor: '#FFCDD2',
  },
  productStockQty: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  productStockQtySelected: {
    color: Colors.textInverse,
  },
  productStockQtyEmpty: {
    color: Colors.error,
  },
  productStockUnit: {
    ...Typography.badge,
    color: Colors.textSecondary,
    marginTop: -2,
  },
  productStockUnitSelected: {
    color: Colors.accentLight,
  },
  productStockUnitEmpty: {
    color: Colors.error,
  },
  quantityCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedProductBanner: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.accentLight,
    borderWidth: 1,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedProductName: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  selectedProductStock: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
  },
  presetLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  presetChip: {
    backgroundColor: Colors.surfaceMuted,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  presetChipText: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  presetChipAll: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFE0B2',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  presetChipAllText: {
    ...Typography.bodySmall,
    color: Colors.warning,
    fontWeight: '700',
  },
  inputLabel: {
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
    marginBottom: Spacing.md,
  },
  inputError: {
    borderColor: Colors.error,
    backgroundColor: '#FFF9F9',
  },
  summaryBox: {
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
  },
  summaryBoxValid: {
    backgroundColor: Colors.surfaceMuted,
    borderColor: Colors.border,
  },
  summaryBoxError: {
    backgroundColor: '#FFEBEE',
    borderColor: Colors.error,
  },
  summaryTitle: {
    ...Typography.bodySmall,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  summaryLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  summaryValue: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  summaryValueNegative: {
    ...Typography.bodySmall,
    color: Colors.error,
    fontWeight: '700',
  },
  recordButton: {
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
  recordButtonDisabled: {
    opacity: 0.5,
  },
  recordButtonText: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textInverse,
  },
});
