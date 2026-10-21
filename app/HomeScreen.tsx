import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { OfflineBadge } from '../components';
import { Colors, Spacing, Typography } from '../constants/theme';
import { getDatabase, initDatabase } from '../db';
import { DatabaseInitResult } from '../types';

export const HomeScreen: React.FC = () => {
  const [initResult, setInitResult] = useState<DatabaseInitResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function setupStorage() {
      try {
        const db = await getDatabase();
        const result = await initDatabase(db);
        if (isMounted) {
          setInitResult(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setInitResult({
            success: false,
            tables: [],
            error: err instanceof Error ? err.message : String(err),
          });
          setIsLoading(false);
        }
      }
    }

    setupStorage();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Header Block */}
        <View style={styles.headerBlock}>
          <Text style={styles.appName}>DukaanOS</Text>
          <Text style={styles.subtitle}>Simple stock management for your shop</Text>
          <View style={styles.badgeWrapper}>
            <OfflineBadge />
          </View>
        </View>

        {/* Foundation Status Card */}
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
                Verified tables: {initResult.tables.join(', ') || 'products, shops'}
              </Text>
            </View>
          ) : (
            <View style={styles.statusRow}>
              <View style={styles.statusIndicatorError} />
              <Text style={styles.statusTextError}>
                Storage initialization error: {initResult?.error || 'Unknown error'}
              </Text>
            </View>
          )}
        </View>

        {/* Footer info for shop owner reassurance */}
        <View style={styles.footer}>
          <Text style={styles.footerNote}>
            Phase 1 • Mobile Foundation & SQLite Ready
          </Text>
        </View>
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
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    justifyContent: 'space-between',
  },
  headerBlock: {
    gap: Spacing.xs,
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
    elevation: 2,
    marginVertical: Spacing.xl,
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
