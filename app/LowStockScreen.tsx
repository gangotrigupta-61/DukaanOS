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
import { getLowStockProducts } from '../db';
import { LowStockItem } from '../types';

interface LowStockScreenProps {
  onBack: () => void;
  onNavigateToQuickSale: () => void;
  onNavigateToProducts: () => void;
}

export const LowStockScreen: React.FC<LowStockScreenProps> = ({
  onBack,
  onNavigateToQuickSale,
  onNavigateToProducts,
}) => {
  const [items, setItems] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadData = async () => {
    try {
      const data = await getLowStockProducts();
      setItems(data);
    } catch (err) {
      console.error('Failed to load low stock items:', err);
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

  const outOfStockCount = items.filter((i) => i.is_out_of_stock).length;
  const lowStockCount = items.filter((i) => !i.is_out_of_stock).length;

  const renderItem = ({ item }: { item: LowStockItem }) => {
    const formattedQty = Number(item.quantity).toLocaleString(undefined, {
      maximumFractionDigits: 3,
    });
    const formattedThreshold = Number(item.low_stock_threshold).toLocaleString(
      undefined,
      { maximumFractionDigits: 3 }
    );

    return (
      <View
        style={[
          styles.itemCard,
          item.is_out_of_stock ? styles.itemCardOut : styles.itemCardLow,
        ]}
      >
        <View style={styles.itemHeaderRow}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View
            style={[
              styles.statusBadge,
              item.is_out_of_stock
                ? styles.statusBadgeOut
                : styles.statusBadgeLow,
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                item.is_out_of_stock
                  ? styles.statusBadgeTextOut
                  : styles.statusBadgeTextLow,
              ]}
            >
              {item.is_out_of_stock ? 'OUT OF STOCK' : 'LOW STOCK'}
            </Text>
          </View>
        </View>

        <View style={styles.itemDetailsRow}>
          <View style={styles.stockInfo}>
            <Text style={styles.currentStockLabel}>Remaining Stock:</Text>
            <Text
              style={[
                styles.currentStockValue,
                item.is_out_of_stock && styles.currentStockValueOut,
              ]}
            >
              {formattedQty} {item.unit}
            </Text>
          </View>

          <View style={styles.thresholdInfo}>
            <Text style={styles.thresholdLabel}>Alert Level:</Text>
            <Text style={styles.thresholdValue}>
              Below {formattedThreshold} {item.unit}
            </Text>
          </View>
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
            accessibilityLabel="Back to Home"
          >
            <Text style={styles.backButtonText}>← Home</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Low Stock Alerts</Text>
          <Text style={styles.subtitle}>
            Products that need restocking for your neighbourhood shop
          </Text>
        </View>

        {/* Real-time Summary Bar */}
        {!loading && items.length > 0 && (
          <View style={styles.summaryBar}>
            <Text style={styles.summaryTitle}>
              {items.length} {items.length === 1 ? 'item needs' : 'items need'} attention
            </Text>
            <View style={styles.summaryChipsRow}>
              {outOfStockCount > 0 && (
                <View style={styles.summaryChipOut}>
                  <Text style={styles.summaryChipOutText}>
                    {outOfStockCount} Out of Stock
                  </Text>
                </View>
              )}
              {lowStockCount > 0 && (
                <View style={styles.summaryChipLow}>
                  <Text style={styles.summaryChipLowText}>
                    {lowStockCount} Low Stock
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* List or Empty State */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Checking stock levels...</Text>
          </View>
        ) : items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Text style={styles.emptyIcon}>✅</Text>
            </View>
            <Text style={styles.emptyTitle}>All stock looks good</Text>
            <Text style={styles.emptySubtitle}>
              No items are currently below their low-stock alert threshold.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={onNavigateToProducts}
              accessibilityRole="button"
            >
              <Text style={styles.emptyButtonText}>View All Products</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
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
  title: {
    ...Typography.title,
    color: Colors.primaryDark,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  summaryBar: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  summaryTitle: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  summaryChipsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  summaryChipOut: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  summaryChipOutText: {
    ...Typography.badge,
    color: Colors.error,
    fontWeight: '700',
  },
  summaryChipLow: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFE0B2',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  summaryChipLowText: {
    ...Typography.badge,
    color: Colors.warning,
    fontWeight: '700',
  },
  listContent: {
    paddingVertical: Spacing.xs,
    paddingBottom: Spacing.xxl,
  },
  separator: {
    height: Spacing.sm,
  },
  itemCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  itemCardOut: {
    borderColor: '#EF9A9A',
    backgroundColor: '#FFF8F8',
  },
  itemCardLow: {
    borderColor: '#FFE082',
    backgroundColor: '#FFFEF7',
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  itemName: {
    ...Typography.subtitle,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  statusBadge: {
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  statusBadgeOut: {
    backgroundColor: Colors.error,
  },
  statusBadgeLow: {
    backgroundColor: Colors.warning,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusBadgeTextOut: {
    color: Colors.textInverse,
  },
  statusBadgeTextLow: {
    color: Colors.textInverse,
  },
  itemDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: Spacing.sm,
  },
  stockInfo: {
    flex: 1,
  },
  currentStockLabel: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    fontSize: 12,
  },
  currentStockValue: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.primaryDark,
    fontSize: 17,
    marginTop: 1,
  },
  currentStockValueOut: {
    color: Colors.error,
  },
  thresholdInfo: {
    alignItems: 'flex-end',
  },
  thresholdLabel: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    fontSize: 12,
  },
  thresholdValue: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 1,
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
    color: Colors.primaryDark,
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
});
