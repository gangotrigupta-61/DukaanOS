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
import { Colors, Spacing, Typography } from '../constants/theme';
import { getProducts } from '../db';
import { Product } from '../types';

interface ProductsScreenProps {
  onBack: () => void;
  onAddProduct: () => void;
  onQuickSale: () => void;
}

export const ProductsScreen: React.FC<ProductsScreenProps> = ({
  onBack,
  onAddProduct,
  onQuickSale,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const list = await getProducts();
      setProducts(list);
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
    // Format quantity cleanly (e.g. 20 instead of 20.0, or 16.5)
    const formattedQty = Number(item.quantity).toLocaleString(undefined, {
      maximumFractionDigits: 3,
    });
    const formattedThreshold = Number(item.low_stock_threshold).toLocaleString(
      undefined,
      { maximumFractionDigits: 3 }
    );
    const isOutOfStock = item.quantity <= 0;

    return (
      <View style={[styles.productCard, isOutOfStock && styles.productCardEmpty]}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.thresholdText}>
            Alert below: {formattedThreshold} {item.unit}
          </Text>
        </View>

        <View
          style={[
            styles.stockBadge,
            isOutOfStock && styles.stockBadgeEmpty,
          ]}
        >
          <Text
            style={[
              styles.stockQuantity,
              isOutOfStock && styles.stockQuantityEmpty,
            ]}
          >
            {formattedQty}
          </Text>
          <Text
            style={[
              styles.stockUnit,
              isOutOfStock && styles.stockUnitEmpty,
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
            accessibilityLabel="Go back to Home"
          >
            <Text style={styles.backButtonText}>← Home</Text>
          </TouchableOpacity>

          <View style={styles.headerTitleRow}>
            <View>
              <Text style={styles.title}>Products & Stock</Text>
              <Text style={styles.subtitle}>
                {products.length} {products.length === 1 ? 'item' : 'items'} in inventory
              </Text>
            </View>

            <View style={styles.headerActions}>
              {products.length > 0 && (
                <TouchableOpacity
                  style={styles.headerSaleButton}
                  onPress={onQuickSale}
                  accessibilityRole="button"
                  accessibilityLabel="Quick Sale"
                >
                  <Text style={styles.headerSaleButtonText}>⚡ Sale</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.headerAddButton}
                onPress={onAddProduct}
                accessibilityRole="button"
                accessibilityLabel="Add Product"
              >
                <Text style={styles.headerAddButtonText}>+ Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Product List or Empty State */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading stock...</Text>
          </View>
        ) : products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Text style={styles.emptyIcon}>📦</Text>
            </View>
            <Text style={styles.emptyTitle}>No products added yet</Text>
            <Text style={styles.emptySubtitle}>
              Start adding your shop's stock items to keep track of inventory offline.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={onAddProduct}
              accessibilityRole="button"
              accessibilityLabel="Add First Product"
            >
              <Text style={styles.emptyButtonText}>+ Add Your First Product</Text>
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
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.xs + 2,
    alignItems: 'center',
  },
  headerSaleButton: {
    backgroundColor: Colors.primaryDark,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
  },
  headerSaleButtonText: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  headerAddButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
  },
  headerAddButtonText: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  listContent: {
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  separator: {
    height: Spacing.sm + 4,
  },
  productCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
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
  productCardEmpty: {
    backgroundColor: '#FAFAFA',
    borderColor: '#EEEEEE',
  },
  productInfo: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  productName: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  thresholdText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    marginTop: 4,
  },
  stockBadge: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.accentLight,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    minWidth: 70,
  },
  stockBadgeEmpty: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
  },
  stockQuantity: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  stockQuantityEmpty: {
    color: Colors.error,
  },
  stockUnit: {
    ...Typography.badge,
    color: Colors.primaryLight,
    marginTop: -2,
  },
  stockUnitEmpty: {
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
