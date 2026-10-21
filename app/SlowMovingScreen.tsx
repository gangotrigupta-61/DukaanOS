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
import { getSlowMovingProducts } from '../db';
import { SlowMovingItem } from '../types';

interface SlowMovingScreenProps {
  onBack: () => void;
  onNavigateToQuickSale: () => void;
  onNavigateToProducts: () => void;
}

export const SlowMovingScreen: React.FC<SlowMovingScreenProps> = ({
  onBack,
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
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
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
              {item.is_never_sold ? Strings.statusNeverSold : Strings.statusSlowMoving}
            </Text>
          </View>
        </View>

        <View style={styles.itemDetailsRow}>
          <View style={styles.stockInfo}>
            <Text style={styles.detailLabel}>Current Stock / स्टॉक:</Text>
            <Text style={styles.stockValue}>
              {formattedQty} {item.unit}
            </Text>
          </View>

          <View style={styles.movementInfo}>
            <Text style={styles.detailLabel}>Sales Activity / बिक्री स्थिति:</Text>
            {item.is_never_sold ? (
              <Text style={styles.neverSoldText}>No sales recorded yet (कभी नहीं बिका)</Text>
            ) : (
              <Text style={styles.slowMovingText}>
                Last sold: {item.days_since_last_sale} days ago ({item.days_since_last_sale} दिन पहले)
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
            <Text style={styles.backButtonText}>{Strings.btnCancel}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{Strings.slowMoving}</Text>
          <Text style={styles.subtitle}>
            Products with no sales recorded in the last 30+ days or never sold • सामान जो नहीं बिक रहा
          </Text>
        </View>

        {/* Real-time Summary Bar */}
        {!loading && items.length > 0 && (
          <View style={styles.summaryBar}>
            <Text style={styles.summaryTitle}>
              {items.length} {items.length === 1 ? 'product needs' : 'products need'} movement • ध्यान दें
            </Text>
            <View style={styles.summaryChipsRow}>
              {neverSoldCount > 0 && (
                <View style={styles.summaryChipNever}>
                  <Text style={styles.summaryChipNeverText}>
                    {neverSoldCount} Never Sold / कभी नहीं बिका
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
            <Text style={styles.emptyTitle}>All products are moving! • सब सामान बिक रहा है</Text>
            <Text style={styles.emptySubtitle}>
              Great news! Every product in your store has recorded sales within the last 30 days.
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
  summaryChipNever: {
    backgroundColor: '#EDE7F6',
    borderColor: '#D1C4E9',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  summaryChipNeverText: {
    ...Typography.badge,
    color: Colors.purple,
    fontSize: 11,
  },
  summaryChipSlow: {
    backgroundColor: '#FFF3E0',
    borderColor: '#FFE0B2',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  summaryChipSlowText: {
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
    fontSize: 16,
  },
  statusBadge: {
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  statusBadgeNever: {
    backgroundColor: Colors.purple,
  },
  statusBadgeSlow: {
    backgroundColor: Colors.warning,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
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
    fontSize: 11,
  },
  stockValue: {
    ...Typography.body,
    fontWeight: '800',
    color: Colors.primaryDark,
    fontSize: 16,
    marginTop: 1,
  },
  movementInfo: {
    alignItems: 'flex-end',
  },
  neverSoldText: {
    ...Typography.bodySmall,
    color: Colors.purple,
    fontWeight: '700',
    marginTop: 1,
    fontSize: 12,
  },
  slowMovingText: {
    ...Typography.bodySmall,
    color: Colors.warning,
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
