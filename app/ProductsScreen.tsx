import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors, Spacing, Touch, Typography } from '../constants/theme';
import { useLanguage } from '../context';
import { getLowStockProducts, getProducts, getSlowMovingProducts } from '../db';
import { Product } from '../types';

interface ProductsScreenProps {
  onBack: () => void;
  onAddProduct: () => void;
  onQuickSale: () => void;
  onNavigateToLowStock?: () => void;
  onNavigateToSlowMoving?: () => void;
}

export const ProductsScreen: React.FC<ProductsScreenProps> = ({
  onBack,
  onAddProduct,
  onQuickSale,
  onNavigateToLowStock,
  onNavigateToSlowMoving,
}) => {
  const { strings } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStockCount, setLowStockCount] = useState<number>(0);
  const [slowMovingCount, setSlowMovingCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadData = async () => {
    try {
      const [list, lowList, slowList] = await Promise.all([
        getProducts(),
        getLowStockProducts(),
        getSlowMovingProducts(30),
      ]);
      setProducts(list);
      setLowStockCount(lowList.length);
      setSlowMovingCount(slowList.length);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const formattedQty = Number(item.quantity).toLocaleString(undefined, {
      maximumFractionDigits: 3,
    });
    const formattedThreshold = Number(item.low_stock_threshold).toLocaleString(
      undefined,
      { maximumFractionDigits: 3 }
    );
    const isOutOfStock = item.quantity <= 0;
    const isLowStock = !isOutOfStock && item.quantity <= item.low_stock_threshold;

    return (
      <View
        style={[
          styles.productCard,
          isOutOfStock
            ? styles.productCardOut
            : isLowStock
            ? styles.productCardLow
            : undefined,
        ]}
      >
        <View style={styles.productInfo}>
          <View style={styles.productNameRow}>
            <Text style={styles.productName} numberOfLines={1}>
              {item.name}
            </Text>
          </View>

          <View style={styles.statusRow}>
            {isOutOfStock ? (
              <View style={styles.badgeOut}>
                <Text style={styles.badgeOutText}>{strings.statusOutOfStock}</Text>
              </View>
            ) : isLowStock ? (
              <View style={styles.badgeLow}>
                <Text style={styles.badgeLowText}>{strings.statusLowStock}</Text>
              </View>
            ) : (
              <View style={styles.badgeIn}>
                <Text style={styles.badgeInText}>{strings.statusInStock}</Text>
              </View>
            )}
            <Text style={styles.thresholdText}>
              {strings.threshold}: {formattedThreshold} {item.unit}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.stockBadge,
            isOutOfStock
              ? styles.stockBadgeOut
              : isLowStock
              ? styles.stockBadgeLow
              : undefined,
          ]}
        >
          <Text
            style={[
              styles.stockQuantity,
              isOutOfStock ? styles.stockQuantityOut : undefined,
            ]}
          >
            {formattedQty}
          </Text>
          <Text
            style={[
              styles.stockUnit,
              isOutOfStock ? styles.stockUnitOut : undefined,
            ]}
          >
            {item.unit}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel={strings.btnCancel}
          >
            <Text style={styles.backButtonText}>{strings.btnCancel}</Text>
          </TouchableOpacity>

          <View style={styles.headerTitleRow}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>{strings.products}</Text>
              <Text style={styles.subtitle}>
                {products.length} {strings.productsSubtitle}
              </Text>
            </View>

            <View style={styles.headerActions}>
              {products.length > 0 && (
                <TouchableOpacity
                  style={styles.headerSaleButton}
                  onPress={onQuickSale}
                  accessibilityRole="button"
                  accessibilityLabel={strings.btnSale}
                >
                  <Text style={styles.headerSaleButtonText}>{strings.btnSale}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.headerAddButton}
                onPress={onAddProduct}
                accessibilityRole="button"
                accessibilityLabel={strings.btnAddProduct}
              >
                <Text style={styles.headerAddButtonText}>{strings.btnAddProduct}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Filter / Insights Links */}
          {products.length > 0 && (lowStockCount > 0 || slowMovingCount > 0) && (
            <View style={styles.insightsLinksRow}>
              {onNavigateToLowStock && lowStockCount > 0 && (
                <TouchableOpacity
                  style={styles.filterChipLow}
                  onPress={onNavigateToLowStock}
                  accessibilityRole="button"
                >
                  <Text style={styles.filterChipLowText}>
                    ⚠ {lowStockCount} {strings.lowStock}
                  </Text>
                </TouchableOpacity>
              )}
              {onNavigateToSlowMoving && slowMovingCount > 0 && (
                <TouchableOpacity
                  style={styles.filterChipSlow}
                  onPress={onNavigateToSlowMoving}
                  accessibilityRole="button"
                >
                  <Text style={styles.filterChipSlowText}>
                    🐌 {slowMovingCount} {strings.slowMoving}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Product List or Empty State */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>{strings.loadingStock}</Text>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Text style={styles.emptyIcon}>📦</Text>
            </View>
            <Text style={styles.emptyTitle}>{strings.noProductsTitle}</Text>
            <Text style={styles.emptySubtitle}>
              {strings.noProductsSubtitle}
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={onAddProduct}
              accessibilityRole="button"
              accessibilityLabel={strings.btnAddFirstProduct}
            >
              <Text style={styles.emptyButtonText}>{strings.btnAddFirstProduct}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderProductItem}
            contentContainerStyle={styles.listContent}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  header: {
    marginBottom: Spacing.sm,
  },
  backButton: {
    alignSelf: 'flex-start',
    minHeight: Touch.minTarget,
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
    paddingRight: Spacing.sm,
  },
  backButtonText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '700',
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    marginRight: Spacing.xs,
  },
  title: {
    ...Typography.title,
    color: Colors.primaryDark,
    fontSize: 24,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
    alignItems: 'center',
  },
  headerSaleButton: {
    backgroundColor: Colors.primaryDark,
    minHeight: 40,
    paddingHorizontal: Spacing.sm + 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSaleButtonText: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.textInverse,
    fontSize: 12,
  },
  headerAddButton: {
    backgroundColor: Colors.primary,
    minHeight: 40,
    paddingHorizontal: Spacing.sm + 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAddButtonText: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.textInverse,
    fontSize: 12,
  },
  insightsLinksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs + 2,
    marginTop: Spacing.sm,
  },
  filterChipLow: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFE0B2',
    borderWidth: 1.5,
    borderRadius: 16,
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm + 4,
  },
  filterChipLowText: {
    ...Typography.badge,
    color: Colors.warning,
    fontSize: 11,
  },
  filterChipSlow: {
    backgroundColor: '#EDE7F6',
    borderColor: '#D1C4E9',
    borderWidth: 1.5,
    borderRadius: 16,
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm + 4,
  },
  filterChipSlowText: {
    ...Typography.badge,
    color: Colors.purple,
    fontSize: 11,
  },
  listContent: {
    paddingVertical: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  separator: {
    height: Spacing.sm,
  },
  productCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  productCardOut: {
    backgroundColor: '#FFFBFB',
    borderColor: '#FFCDD2',
  },
  productCardLow: {
    backgroundColor: '#FFFCF7',
    borderColor: '#FFE082',
  },
  productInfo: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  productNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  productName: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: 4,
  },
  badgeOut: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 1,
    paddingHorizontal: 6,
  },
  badgeOutText: {
    color: Colors.error,
    fontSize: 10,
    fontWeight: '800',
  },
  badgeLow: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFE0B2',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 1,
    paddingHorizontal: 6,
  },
  badgeLowText: {
    color: Colors.warning,
    fontSize: 10,
    fontWeight: '800',
  },
  badgeIn: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.accentLight,
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 1,
    paddingHorizontal: 6,
  },
  badgeInText: {
    color: Colors.primaryDark,
    fontSize: 10,
    fontWeight: '700',
  },
  thresholdText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    fontSize: 11,
  },
  stockBadge: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.accentLight,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    minWidth: 70,
  },
  stockBadgeOut: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
  },
  stockBadgeLow: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFE0B2',
  },
  stockQuantity: {
    fontSize: 19,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  stockQuantityOut: {
    color: Colors.error,
  },
  stockUnit: {
    ...Typography.badge,
    color: Colors.primaryLight,
    marginTop: -2,
  },
  stockUnitOut: {
    color: Colors.error,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Spacing.xxl,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
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
    textAlign: 'center',
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
    minHeight: Touch.buttonHeight,
    paddingHorizontal: Spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyButtonText: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textInverse,
  },
});
