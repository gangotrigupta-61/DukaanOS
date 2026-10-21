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
import { getSlowMovingProducts } from '../db';
import { SlowMovingItem } from '../types';

interface SlowMovingScreenProps {
  onBack: () => void;
  onNavigateToQuickSale: () => void;
  onNavigateToProducts: () => void;
}

export const SlowMovingScreen: React.FC<SlowMovingScreenProps> = ({
  onBack,
  onNavigateToQuickSale,
  onNavigateToProducts,
}) => {
  const [items, setItems] = useState<SlowMovingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadData = async () => {
    try {
      const data = await getSlowMovingProducts(30);
      setItems(data);
    } catch (err) {
      console.error('Failed to load slow moving items:', err);
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

  const neverSoldCount = items.filter((i) => i.is_never_sold).length;
  const slowMovingCount = items.filter((i) => !i.is_never_sold).length;

  const renderItem = ({ item }: { item: SlowMovingItem }) => {
    const formattedQty = Number(item.quantity).toLocaleString(undefined, {
      maximumFractionDigits: 3,
    });

    return (
      <View
        style={[
          styles.itemCard,
          item.is_never_sold ? styles.itemCardNever : styles.itemCardSlow,
        ]}
      >
        <View style={styles.itemHeaderRow}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View
            style={[
              styles.statusBadge,
              item.is_never_sold
                ? styles.statusBadgeNever
                : styles.statusBadgeSlow,
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                item.is_never_sold
                  ? styles.statusBadgeTextNever
                  : styles.statusBadgeTextSlow,
              ]}
            >
              {item.is_never_sold ? 'NEVER SOLD' : 'SLOW MOVING'}
            </Text>
          </View>
        </View>

        <View style={styles.itemDetailsRow}>
          <View style={styles.stockInfo}>
            <Text style={styles.detailLabel}>Current Stock:</Text>
            <Text style={styles.stockValue}>
              {formattedQty} {item.unit}
            </Text>
          </View>

          <View style={styles.movementInfo}>
            <Text style={styles.detailLabel}>Sales Activity:</Text>
            {item.is_never_sold ? (
              <Text style={styles.neverSoldText}>No sales recorded yet</Text>
            ) : (
              <Text style={styles.slowMovingText}>
                Last sold: {item.days_since_last_sale} days ago
              </Text>
            )}
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

          <Text style={styles.title}>Slow-Moving Stock</Text>
          <Text style={styles.subtitle}>
            Products with no sales recorded in the last 30+ days or never sold
          </Text>
        </View>

        {/* Real-time Summary Bar */}
        {!loading && items.length > 0 && (
          <View style={styles.summaryBar}>
            <Text style={styles.summaryTitle}>
              {items.length} {items.length === 1 ? 'product needs' : 'products need'} attention
            </Text>
            <View style={styles.summaryChipsRow}>
              {neverSoldCount > 0 && (
                <View style={styles.summaryChipNever}>
                  <Text style={styles.summaryChipNeverText}>
                    {neverSoldCount} Never Sold
                  </Text>
                </View>
              )}
              {slowMovingCount > 0 && (
                <View style={styles.summaryChipSlow}>
                  <Text style={styles.summaryChipSlowText}>
                    {slowMovingCount} Inactive (30+ days)
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
            <Text style={styles.loadingText}>Analyzing sales history...</Text>
          </View>
        ) : items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Text style={styles.emptyIcon}>🚀</Text>
            </View>
            <Text style={styles.emptyTitle}>All products are moving actively!</Text>
            <Text style={styles.emptySubtitle}>
              Great job! Every product in your store has recorded sales within the last 30 days.
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
  summaryChipNever: {
    backgroundColor: '#EDE7F6',
    borderColor: '#D1C4E9',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  summaryChipNeverText: {
    ...Typography.badge,
    color: '#5E35B1',
    fontWeight: '700',
  },
  summaryChipSlow: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFE0B2',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  summaryChipSlowText: {
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
  itemCardNever: {
    borderColor: '#D1C4E9',
    backgroundColor: '#FCFBFE',
  },
  itemCardSlow: {
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
  statusBadgeNever: {
    backgroundColor: '#673AB7',
  },
  statusBadgeSlow: {
    backgroundColor: Colors.warning,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusBadgeTextNever: {
    color: Colors.textInverse,
  },
  statusBadgeTextSlow: {
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
  detailLabel: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    fontSize: 12,
  },
  stockValue: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.primaryDark,
    fontSize: 16,
    marginTop: 1,
  },
  movementInfo: {
    alignItems: 'flex-end',
  },
  neverSoldText: {
    ...Typography.bodySmall,
    color: '#673AB7',
    fontWeight: '700',
    marginTop: 1,
  },
  slowMovingText: {
    ...Typography.bodySmall,
    color: Colors.warning,
    fontWeight: '700',
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
