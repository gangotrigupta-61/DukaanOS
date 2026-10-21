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
import { Colors, Spacing, Typography } from '../constants/theme';
import { getDatabase, getProducts, getShop, initDatabase } from '../db';
import { DatabaseInitResult, Screen, Shop } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const [initResult, setInitResult] = useState<DatabaseInitResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [shop, setShop] = useState<Shop | null>(null);
  const [productCount, setProductCount] = useState<number>(0);

  const loadData = async () => {
    try {
      const db = await getDatabase();
      const result = await initDatabase(db);
      setInitResult(result);

      const activeShop = await getShop(db);
      setShop(activeShop);

      const products = await getProducts(db);
      setProductCount(products.length);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Block */}
        <View style={styles.headerBlock}>
          <Text style={styles.appName}>DukaanOS</Text>
          <Text style={styles.subtitle}>Simple stock management for your shop</Text>
          <View style={styles.badgeWrapper}>
            <OfflineBadge />
          </View>
        </View>

        {/* Shop Info Card */}
        {shop ? (
          <View style={styles.shopCard}>
            <View style={styles.shopInfoRow}>
              <View>
                <Text style={styles.shopGreeting}>Active Store</Text>
                <Text style={styles.shopTitle}>{shop.shop_name}</Text>
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
                <Text style={styles.editShopButtonText}>Edit</Text>
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
            <View>
              <Text style={styles.setupBannerTitle}>Setup Your Shop</Text>
              <Text style={styles.setupBannerSubtitle}>
                Add your shop name and preferences to personalize DukaanOS
              </Text>
            </View>
            <Text style={styles.setupBannerArrow}>→</Text>
          </TouchableOpacity>
        )}

        {/* Core Shopkeeper Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionHeader}>Quick Actions</Text>

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
              <Text style={styles.heroSaleTitle}>Quick Sale</Text>
              <Text style={styles.heroSaleSubtitle}>
                Record sale and automatically decrease stock
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
              <Text style={styles.actionTitle}>Products & Stock</Text>
              <Text style={styles.actionSubtitle}>
                {productCount === 0
                  ? 'No items added yet'
                  : `${productCount} ${productCount === 1 ? 'item' : 'items'} in inventory`}
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
              <Text style={styles.actionTitleSecondary}>Add New Product</Text>
              <Text style={styles.actionSubtitle}>
                Record product name, stock quantity, and alert levels
              </Text>
            </View>
            <Text style={styles.actionArrowSecondary}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Phase 1 System Foundation Card (Preserved) */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>System Foundation</Text>

          {isLoading ? (
            <View style={styles.statusRow}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.statusText}>Initializing local database...</Text>
            </View>
          ) : initResult?.success ? (
            <View>
              <View style={styles.statusRow}>
                <View style={styles.statusIndicatorSuccess} />
                <Text style={styles.statusTextSuccess}>
                  Local SQLite storage active
                </Text>
              </View>
              <Text style={styles.detailsText}>
                Verified tables:{' '}
                {initResult.tables.join(', ') || 'products, sales, shops'}
              </Text>
            </View>
          ) : (
            <View style={styles.statusRow}>
              <View style={styles.statusIndicatorError} />
              <Text style={styles.statusTextError}>
                Storage initialization error:{' '}
                {initResult?.error || 'Unknown error'}
              </Text>
            </View>
          )}
        </View>

        {/* Footer info */}
        <View style={styles.footer}>
          <Text style={styles.footerNote}>
            DukaanOS Phase 3 • Core Quick Sale & Automatic Stock Active
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
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  headerBlock: {
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  appName: {
    ...Typography.title,
    color: Colors.primaryDark,
  },
  subtitle: {
    ...Typography.subtitle,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  badgeWrapper: {
    marginTop: Spacing.xs,
  },
  shopCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.md + 2,
    marginBottom: Spacing.lg,
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
  shopGreeting: {
    ...Typography.bodySmall,
    color: Colors.primaryLight,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  },
  editShopButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: 6,
    backgroundColor: Colors.primarySurface,
  },
  editShopButtonText: {
    ...Typography.bodySmall,
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  setupBanner: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.accentLight,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: Spacing.md + 4,
    marginBottom: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    maxWidth: 260,
  },
  setupBannerArrow: {
    fontSize: 24,
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  actionsSection: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },
  heroSaleButton: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 12,
    padding: Spacing.md + 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
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
    fontSize: 24,
  },
  heroSaleTitle: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.textInverse,
    fontSize: 18,
  },
  heroSaleSubtitle: {
    ...Typography.bodySmall,
    color: Colors.accentLight,
    marginTop: 2,
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
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  secondaryActionButton: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  actionIconContainerSecondary: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  actionIcon: {
    fontSize: 22,
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
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    marginBottom: Spacing.lg,
  },
  cardHeader: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusIndicatorSuccess: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.success,
  },
  statusIndicatorError: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.error,
  },
  statusText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  statusTextSuccess: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  statusTextError: {
    ...Typography.body,
    color: Colors.error,
  },
  detailsText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginLeft: Spacing.md + 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  footerNote: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
});
