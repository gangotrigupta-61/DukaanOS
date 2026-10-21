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
  const { strings } = useLanguage();
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
              {item.is_out_of_stock ? strings.statusOutOfStock : strings.statusLowStock}
            </Text>
          </View>
        </View>

        <View style={styles.itemDetailsRow}>
          <View style={styles.stockInfo}>
            <Text style={styles.currentStockLabel}>{strings.remainingLabel}:</Text>
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
            <Text style={styles.thresholdLabel}>{strings.threshold}:</Text>
            <Text style={styles.thresholdValue}>
              {formattedThreshold} {item.unit}
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
            accessibilityLabel={strings.btnCancel}
          >
            <Text style={styles.backButtonText}>{strings.btnCancel}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{strings.lowStock}</Text>
          <Text style={styles.subtitle}>
            {strings.lowStockSubtitle}
          </Text>
        </View>

        {/* Real-time Summary Bar */}
        {!loading && items.length > 0 && (
          <View style={styles.summaryBar}>
            <Text style={styles.summaryTitle}>
              {items.length} {strings.itemsNeedAttention}
            </Text>
            <View style={styles.summaryChipsRow}>
              {outOfStockCount > 0 && (
                <View style={styles.summaryChipOut}>
                  <Text style={styles.summaryChipOutText}>
                    {outOfStockCount} {strings.statusOutOfStock}
                  </Text>
                </View>
              )}
              {lowStockCount > 0 && (
                <View style={styles.summaryChipLow}>
                  <Text style={styles.summaryChipLowText}>
                    {lowStockCount} {strings.statusLowStock}
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
            <Text style={styles.loadingText}>{strings.loadingStock}</Text>
          </View>
        ) : items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Text style={styles.emptyIcon}>✅</Text>
            </View>
            <Text style={styles.emptyTitle}>{strings.allGoodStock}</Text>
            <Text style={styles.emptySubtitle}>
              {strings.allGoodStockSubtitle}
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={onNavigateToProducts}
              accessibilityRole="button"
              accessibilityLabel={strings.btnViewProducts}
            >
              <Text style={styles.emptyButtonText}>{strings.btnViewProducts}</Text>
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
    fontSize: 14,
    lineHeight: 20,
  },
  summaryBar: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  summaryChipsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  summaryChipOut: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  summaryChipOutText: {
    color: Colors.error,
    fontWeight: '700',
    fontSize: 12,
  },
  summaryChipLow: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  summaryChipLowText: {
    color: Colors.warning,
    fontWeight: '700',
    fontSize: 12,
  },
  listContent: {
    paddingBottom: Spacing.xxl,
  },
  separator: {
    height: Spacing.sm,
  },
  itemCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  itemCardOut: {
    borderColor: '#FFCDD2',
    backgroundColor: '#FFFDFD',
  },
  itemCardLow: {
    borderColor: '#FFE0B2',
    backgroundColor: '#FFFDF9',
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  itemName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeOut: {
    backgroundColor: '#FFEBEE',
  },
  statusBadgeLow: {
    backgroundColor: '#FFF3E0',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  statusBadgeTextOut: {
    color: Colors.error,
  },
  statusBadgeTextLow: {
    color: Colors.warning,
  },
  itemDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceMuted,
    borderRadius: 8,
    padding: Spacing.sm + 2,
  },
  stockInfo: {
    flex: 1,
  },
  currentStockLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
    marginBottom: 2,
  },
  currentStockValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  currentStockValueOut: {
    color: Colors.error,
  },
  thresholdInfo: {
    alignItems: 'flex-end',
  },
  thresholdLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
    marginBottom: 2,
  },
  thresholdValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textMuted,
    marginTop: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxl,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyTitle: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
    height: Touch.buttonHeight,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textInverse,
  },
});
