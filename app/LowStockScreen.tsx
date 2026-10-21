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
import { Strings } from '../constants/strings';
import { getLowStockProducts } from '../db';
import { LowStockItem } from '../types';

interface LowStockScreenProps {
  onBack: () => void;
  onNavigateToQuickSale: () => void;
  onNavigateToProducts: () => void;
}

export const LowStockScreen: React.FC<LowStockScreenProps> = ({
  onBack,
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
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
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
              {item.is_out_of_stock ? Strings.statusOutOfStock : Strings.statusLowStock}
            </Text>
          </View>
        </View>

        <View style={styles.itemDetailsRow}>
          <View style={styles.stockInfo}>
            <Text style={styles.currentStockLabel}>Remaining / बाकी बचा:</Text>
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
            <Text style={styles.thresholdLabel}>Alert Level / अलर्ट सीमा:</Text>
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
            <Text style={styles.backButtonText}>{Strings.btnCancel}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{Strings.lowStock}</Text>
          <Text style={styles.subtitle}>
            Products that need restocking for your neighbourhood shop • सामान जो खत्म होने वाला है
          </Text>
        </View>

        {/* Real-time Summary Bar */}
        {!loading && items.length > 0 && (
          <View style={styles.summaryBar}>
            <Text style={styles.summaryTitle}>
              {items.length} {items.length === 1 ? 'item needs' : 'items need'} attention • ध्यान दें
            </Text>
            <View style={styles.summaryChipsRow}>
              {outOfStockCount > 0 && (
                <View style={styles.summaryChipOut}>
                  <Text style={styles.summaryChipOutText}>
                    {outOfStockCount} Out of Stock / खत्म
                  </Text>
                </View>
              )}
              {lowStockCount > 0 && (
                <View style={styles.summaryChipLow}>
                  <Text style={styles.summaryChipLowText}>
                    {lowStockCount} Low Stock / कम स्टॉक
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
            <Text style={styles.emptyTitle}>All good! • सब ठीक है</Text>
            <Text style={styles.emptySubtitle}>
              No products are currently low on stock. All items are above their alert threshold.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={onNavigateToProducts}
              accessibilityRole="button"
            >
              <Text style={styles.emptyButtonText}>{Strings.btnViewProducts}</Text>
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
    marginBottom: Spacing.sm,
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
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
    fontSize: 12,
  },
  summaryBar: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm + 4,
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
    fontSize: 14,
  },
  summaryChipsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  summaryChipOut: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FFCDD2',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  summaryChipOutText: {
    ...Typography.badge,
    color: Colors.error,
    fontSize: 11,
  },
  summaryChipLow: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFE0B2',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  summaryChipLowText: {
    ...Typography.badge,
    color: Colors.warning,
    fontSize: 11,
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
    fontSize: 16,
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
    fontWeight: '800',
    letterSpacing: 0.3,
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
    fontSize: 11,
  },
  currentStockValue: {
    ...Typography.body,
    fontWeight: '800',
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
    fontSize: 11,
  },
  thresholdValue: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '700',
    marginTop: 1,
    fontSize: 12,
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
  },
  emptyButtonText: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textInverse,
  },
});
