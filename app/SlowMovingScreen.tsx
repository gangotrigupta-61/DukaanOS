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
  const { strings, t } = useLanguage();
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
              {item.is_never_sold ? strings.statusNeverSold : strings.statusSlowMoving}
            </Text>
          </View>
        </View>

        <View style={styles.itemDetailsRow}>
          <View style={styles.stockInfo}>
            <Text style={styles.detailLabel}>{strings.currentStock}:</Text>
            <Text style={styles.stockValue}>
              {formattedQty} {item.unit}
            </Text>
          </View>

          <View style={styles.movementInfo}>
            <Text style={styles.detailLabel}>{strings.slowMoving}:</Text>
            {item.is_never_sold ? (
              <Text style={styles.neverSoldText}>{strings.statusNeverSold}</Text>
            ) : (
              <Text style={styles.slowMovingText}>
                {t('lastSoldDaysAgo', { days: item.days_since_last_sale ?? 0 })}
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
            accessibilityLabel={strings.btnCancel}
          >
            <Text style={styles.backButtonText}>{strings.btnCancel}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{strings.slowMoving}</Text>
          <Text style={styles.subtitle}>
            {strings.slowMovingSubtitle}
          </Text>
        </View>

        {/* Real-time Summary Bar */}
        {!loading && items.length > 0 && (
          <View style={styles.summaryBar}>
            <Text style={styles.summaryTitle}>
              {items.length} {strings.productsNeedMovement}
            </Text>
            <View style={styles.summaryChipsRow}>
              {neverSoldCount > 0 && (
                <View style={styles.summaryChipNever}>
                  <Text style={styles.summaryChipNeverText}>
                    {neverSoldCount} {strings.statusNeverSold}
                  </Text>
                </View>
              )}
              {slowMovingCount > 0 && (
                <View style={styles.summaryChipSlow}>
                  <Text style={styles.summaryChipSlowText}>
                    {slowMovingCount} {strings.statusSlowMoving}
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
              <Text style={styles.emptyIcon}>🚀</Text>
            </View>
            <Text style={styles.emptyTitle}>{strings.allProductsMoving}</Text>
            <Text style={styles.emptySubtitle}>
              {strings.allProductsMovingSubtitle}
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
  summaryChipNever: {
    backgroundColor: '#EDE7F6',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1C4E9',
  },
  summaryChipNeverText: {
    color: Colors.purple,
    fontWeight: '700',
    fontSize: 12,
  },
  summaryChipSlow: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  summaryChipSlowText: {
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
  itemCardNever: {
    borderColor: '#D1C4E9',
    backgroundColor: '#FAF8FC',
  },
  itemCardSlow: {
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
  statusBadgeNever: {
    backgroundColor: '#EDE7F6',
  },
  statusBadgeSlow: {
    backgroundColor: '#FFF3E0',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  statusBadgeTextNever: {
    color: Colors.purple,
  },
  statusBadgeTextSlow: {
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
  detailLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
    marginBottom: 2,
  },
  stockValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  movementInfo: {
    flex: 1.4,
    alignItems: 'flex-end',
  },
  neverSoldText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.purple,
  },
  slowMovingText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.warning,
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
