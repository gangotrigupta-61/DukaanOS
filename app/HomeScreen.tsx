import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { OfflineBadge } from '../components';
import { Colors, Spacing, Touch, Typography } from '../constants/theme';
import { Strings } from '../constants/strings';
import {
  getDatabase,
  getInventoryInsights,
  getProducts,
  getShop,
  initDatabase,
} from '../db';
import { DatabaseInitResult, InventoryInsights, Screen, Shop } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const [initResult, setInitResult] = useState<DatabaseInitResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [shop, setShop] = useState<Shop | null>(null);
  const [productCount, setProductCount] = useState<number>(0);
  const [insights, setInsights] = useState<InventoryInsights | null>(null);

  const loadData = async () => {
    try {
      const db = await getDatabase();
      const result = await initDatabase(db);
      setInitResult(result);

      const activeShop = await getShop(db);
      setShop(activeShop);

      const products = await getProducts(db);
      setProductCount(products.length);

      const computedInsights = await getInventoryInsights(db);
      setInsights(computedInsights);
    } catch (err) {
      setInitResult({
        success: false,
        tables: [],
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalAttentionCount =
    (insights?.lowStockCount ?? 0) + (insights?.outOfStockCount ?? 0);
  const totalSlowCount =
    (insights?.slowMovingCount ?? 0) + (insights?.neverSoldCount ?? 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Block */}
        <View style={styles.headerBlock}>
          <View style={styles.brandRow}>
            <Text style={styles.appName}>{Strings.appName}</Text>
            <OfflineBadge compact />
          </View>
          <Text style={styles.subtitle}>{Strings.taglineBilingual}</Text>
        </View>

        {/* Shop Info Card */}
        {shop ? (
          <View style={styles.shopCard}>
            <View style={styles.shopInfoRow}>
              <View style={styles.shopTextContainer}>
                <Text style={styles.shopGreeting}>Active Store • दुकान</Text>
                <Text style={styles.shopTitle} numberOfLines={1}>
                  {shop.shop_name}
                </Text>
                <Text style={styles.shopDetails}>
                  {shop.shop_type} •{' '}
                  {shop.language === 'hi'
                    ? 'हिंदी'
                    : shop.language === 'hi-en'
                    ? 'Hinglish'
                    : 'English'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => onNavigate('shop_setup')}
                style={styles.editShopButton}
                accessibilityRole="button"
                accessibilityLabel="Edit shop details"
              >
                <Text style={styles.editShopButtonText}>{Strings.editShop}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.setupBanner}
            onPress={() => onNavigate('shop_setup')}
            accessibilityRole="button"
            accessibilityLabel="Setup shop now"
          >
            <View style={styles.setupBannerText}>
              <Text style={styles.setupBannerTitle}>Setup Your Shop / दुकान जोड़ें</Text>
              <Text style={styles.setupBannerSubtitle}>
                Add your shop name and preferences to personalize DukaanOS
              </Text>
            </View>
            <Text style={styles.setupBannerArrow}>→</Text>
          </TouchableOpacity>
        )}

        {/* Phase 4 & 5 Core Inventory Health Cards */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionHeader}>Inventory Health • स्टॉक की स्थिति</Text>

          <View style={styles.insightsGrid}>
            {/* Low Stock Card */}
            <TouchableOpacity
              style={[
                styles.insightCard,
                totalAttentionCount > 0 ? styles.insightCardAlert : styles.insightCardHealthy,
              ]}
              onPress={() => onNavigate('low_stock')}
              accessibilityRole="button"
              accessibilityLabel={`Low Stock: ${totalAttentionCount} items`}
            >
              <View style={styles.insightHeaderRow}>
                <Text style={styles.insightIcon}>⚠</Text>
                <View
                  style={[
                    styles.insightCountPill,
                    totalAttentionCount > 0
                      ? styles.insightCountPillAlert
                      : styles.insightCountPillHealthy,
                  ]}
                >
                  <Text
                    style={[
                      styles.insightBadgeCount,
                      totalAttentionCount > 0
                        ? styles.insightBadgeCountAlert
                        : styles.insightBadgeCountHealthy,
                    ]}
                  >
                    {totalAttentionCount}
                  </Text>
                </View>
              </View>
              <Text style={styles.insightCardTitle}>Low Stock / कम स्टॉक</Text>
              <Text style={styles.insightCardSubtitle}>
                {totalAttentionCount === 0
                  ? 'All stock healthy • सब पर्याप्त'
                  : insights?.outOfStockCount
                  ? `${insights.outOfStockCount} Out • ${insights.lowStockCount} Low`
                  : `${totalAttentionCount} items need restock`}
              </Text>
            </TouchableOpacity>

            {/* Slow Moving Card */}
            <TouchableOpacity
              style={[
                styles.insightCard,
                totalSlowCount > 0 ? styles.insightCardSlow : styles.insightCardHealthy,
              ]}
              onPress={() => onNavigate('slow_moving')}
              accessibilityRole="button"
              accessibilityLabel={`Slow Moving: ${totalSlowCount} items`}
            >
              <View style={styles.insightHeaderRow}>
                <Text style={styles.insightIcon}>🐌</Text>
                <View
                  style={[
                    styles.insightCountPill,
                    totalSlowCount > 0
                      ? styles.insightCountPillSlow
                      : styles.insightCountPillHealthy,
                  ]}
                >
                  <Text
                    style={[
                      styles.insightBadgeCount,
                      totalSlowCount > 0
                        ? styles.insightBadgeCountSlow
                        : styles.insightBadgeCountHealthy,
                    ]}
                  >
                    {totalSlowCount}
                  </Text>
                </View>
              </View>
              <Text style={styles.insightCardTitle}>Slow Moving / धीमी बिक्री</Text>
              <Text style={styles.insightCardSubtitle}>
                {totalSlowCount === 0
                  ? 'Active movement • सब बिक रहा'
                  : insights?.neverSoldCount
                  ? `${insights.neverSoldCount} Never Sold • ${insights.slowMovingCount} Slow`
                  : `${totalSlowCount} inactive (30+ days)`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Primary Shopkeeper Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionHeader}>Quick Actions • मुख्य कार्य</Text>

          {/* Quick Sale Hero Button */}
          <TouchableOpacity
            style={styles.heroSaleButton}
            onPress={() => onNavigate('quick_sale')}
            accessibilityRole="button"
            accessibilityLabel="Record Quick Sale"
          >
            <View style={styles.heroSaleIconContainer}>
              <Text style={styles.heroSaleIcon}>⚡</Text>
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.heroSaleTitle}>{Strings.quickSale}</Text>
              <Text style={styles.heroSaleSubtitle}>
                Instant sale with automatic stock deduction • तुरंत बिक्री
              </Text>
            </View>
            <Text style={styles.heroSaleArrow}>→</Text>
          </TouchableOpacity>

          {/* View Stock Button */}
          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={() => onNavigate('products')}
            accessibilityRole="button"
            accessibilityLabel="View Products and Stock"
          >
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>📦</Text>
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>{Strings.products}</Text>
              <Text style={styles.actionSubtitle}>
                {productCount === 0
                  ? 'No items added yet • कोई सामान नहीं'
                  : `${productCount} ${productCount === 1 ? 'item' : 'items'} in inventory • स्टॉक देखें`}
              </Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          {/* Add Product Button */}
          <TouchableOpacity
            style={styles.secondaryActionButton}
            onPress={() => onNavigate('add_product')}
            accessibilityRole="button"
            accessibilityLabel="Add New Product"
          >
            <View style={styles.actionIconContainerSecondary}>
              <Text style={styles.actionIcon}>➕</Text>
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitleSecondary}>{Strings.addProduct}</Text>
              <Text style={styles.actionSubtitle}>
                Add stock items with alert threshold • नया सामान जोड़ें
              </Text>
            </View>
            <Text style={styles.actionArrowSecondary}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Offline & System Foundation Card (Preserved from Phase 1) */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Local Offline Storage • स्थानीय स्टोरेज</Text>

          {isLoading ? (
            <View style={styles.statusRow}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.statusText}>Connecting to local database...</Text>
            </View>
          ) : initResult?.success ? (
            <View>
              <View style={styles.statusRow}>
                <View style={styles.statusIndicatorSuccess} />
                <Text style={styles.statusTextSuccess}>
                  Local SQLite storage active (बिना इंटरनेट सुरक्षित)
                </Text>
              </View>
              <Text style={styles.detailsText}>
                Verified tables: {initResult.tables.join(', ') || 'products, sales, shops'}
              </Text>
            </View>
          ) : (
            <View style={styles.statusRow}>
              <View style={styles.statusIndicatorError} />
              <Text style={styles.statusTextError}>
                Storage error: {initResult?.error || 'Unknown error'}
              </Text>
            </View>
          )}
        </View>

        {/* Footer info */}
        <View style={styles.footer}>
          <Text style={styles.footerNote}>
            DukaanOS • Designed for Indian Small Retailers
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  headerBlock: {
    marginBottom: Spacing.md,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  appName: {
    ...Typography.title,
    color: Colors.primaryDark,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontSize: 13,
  },
  shopCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  shopInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shopTextContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  shopGreeting: {
    ...Typography.bodySmall,
    color: Colors.primaryLight,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 11,
  },
  shopTitle: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: 2,
  },
  shopDetails: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
    fontSize: 12,
  },
  editShopButton: {
    minHeight: 38,
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.sm + 2,
    borderRadius: 8,
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.accentLight,
    borderWidth: 1,
  },
  editShopButtonText: {
    ...Typography.bodySmall,
    color: Colors.primaryDark,
    fontWeight: '700',
    fontSize: 12,
  },
  setupBanner: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.accentLight,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  setupBannerText: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  setupBannerTitle: {
    ...Typography.subtitle,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  setupBannerSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  setupBannerArrow: {
    fontSize: 24,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  insightsSection: {
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.xs + 2,
    fontWeight: '700',
    fontSize: 12,
  },
  insightsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  insightCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    minHeight: 90,
    justifyContent: 'space-between',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  insightCardAlert: {
    borderColor: '#FFCDD2',
    backgroundColor: '#FFFBFB',
  },
  insightCardSlow: {
    borderColor: '#FFE0B2',
    backgroundColor: '#FFFCF7',
  },
  insightCardHealthy: {
    borderColor: Colors.border,
  },
  insightHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  insightIcon: {
    fontSize: 20,
  },
  insightCountPill: {
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  insightCountPillAlert: {
    backgroundColor: '#FFEBEE',
  },
  insightCountPillSlow: {
    backgroundColor: '#FFF3E0',
  },
  insightCountPillHealthy: {
    backgroundColor: Colors.primarySurface,
  },
  insightBadgeCount: {
    fontSize: 16,
    fontWeight: '800',
  },
  insightBadgeCountAlert: {
    color: Colors.error,
  },
  insightBadgeCountSlow: {
    color: Colors.warning,
  },
  insightBadgeCountHealthy: {
    color: Colors.primaryLight,
  },
  insightCardTitle: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontSize: 14,
  },
  insightCardSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
    fontSize: 11,
  },
  actionsSection: {
    marginBottom: Spacing.md,
  },
  heroSaleButton: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 12,
    minHeight: Touch.buttonHeight + 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm + 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  heroSaleIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  heroSaleIcon: {
    fontSize: 22,
  },
  heroSaleTitle: {
    ...Typography.subtitle,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  heroSaleSubtitle: {
    ...Typography.bodySmall,
    color: Colors.accentLight,
    marginTop: 2,
    fontSize: 12,
  },
  heroSaleArrow: {
    fontSize: 22,
    color: Colors.textInverse,
    fontWeight: '700',
    marginLeft: Spacing.sm,
  },
  primaryActionButton: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderStrong,
    borderWidth: 1.5,
    borderRadius: 12,
    minHeight: Touch.buttonHeight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm + 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  secondaryActionButton: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1.5,
    borderRadius: 12,
    minHeight: Touch.buttonHeight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  actionIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  actionIconContainerSecondary: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  actionTitleSecondary: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  actionSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 2,
    fontSize: 12,
  },
  actionArrow: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: '700',
    marginLeft: Spacing.sm,
  },
  actionArrowSecondary: {
    fontSize: 20,
    color: Colors.textMuted,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.xs,
    fontSize: 11,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusIndicatorSuccess: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  statusIndicatorError: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
  },
  statusText: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
  },
  statusTextSuccess: {
    ...Typography.bodySmall,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  statusTextError: {
    ...Typography.bodySmall,
    color: Colors.error,
  },
  detailsText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    marginLeft: Spacing.md,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  footerNote: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    fontSize: 12,
  },
});
