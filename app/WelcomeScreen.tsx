import React from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { OfflineBadge, LanguageSelector } from '../components';
import { Colors, Spacing, Touch, Typography } from '../constants/theme';
import { useLanguage } from '../context';

export interface WelcomeScreenProps {
  onStart: () => void;
}

const { width } = Dimensions.get('window');

/**
 * Clean vector illustration of a traditional Indian neighbourhood Kirana store
 * Built with pure React Native components for instant, lightweight offline rendering.
 */
const KiranaStorefrontIllustration = () => {
  return (
    <View style={styles.illustrationContainer} accessibilityRole="image" accessibilityLabel="Indian Kirana Store Illustration">
      {/* Store Signboard */}
      <View style={styles.storeSignboard}>
        <View style={styles.signboardInner}>
          <Text style={styles.signboardIcon}>🏪</Text>
          <View style={styles.signboardTextCol}>
            <Text style={styles.signboardTitle}>किराना स्टोर • KIRANA</Text>
            <Text style={styles.signboardSubtitle}>DUKAAN-OS SMART STORE</Text>
          </View>
        </View>
      </View>

      {/* Awning / Chajja with striped scalloped canopy */}
      <View style={styles.awningContainer}>
        <View style={styles.awningRow}>
          {[...Array(7)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.awningStripe,
                i % 2 === 0 ? styles.awningStripeGreen : styles.awningStripeCream,
              ]}
            />
          ))}
        </View>
        <View style={styles.awningValanceRow}>
          {[...Array(7)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.awningScallop,
                i % 2 === 0 ? styles.awningScallopGreen : styles.awningScallopCream,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Main Storefront Body */}
      <View style={styles.storeBody}>
        {/* Interior Shelves with Goods */}
        <View style={styles.storeShelfArea}>
          <View style={styles.shelfRow}>
            <View style={[styles.jarItem, { backgroundColor: '#FFD54F' }]}>
              <Text style={styles.itemEmoji}>🌾</Text>
            </View>
            <View style={[styles.jarItem, { backgroundColor: '#81C784' }]}>
              <Text style={styles.itemEmoji}>🫘</Text>
            </View>
            <View style={[styles.jarItem, { backgroundColor: '#FF8A65' }]}>
              <Text style={styles.itemEmoji}>🧂</Text>
            </View>
            <View style={[styles.jarItem, { backgroundColor: '#90CAF9' }]}>
              <Text style={styles.itemEmoji}>🥛</Text>
            </View>
            <View style={[styles.jarItem, { backgroundColor: '#CE93D8' }]}>
              <Text style={styles.itemEmoji}>☕</Text>
            </View>
          </View>
          <View style={styles.shelfDivider} />
          <View style={styles.shelfRow}>
            <View style={[styles.boxItem, { backgroundColor: '#FFE082' }]}>
              <Text style={styles.boxItemText}>CHANA</Text>
            </View>
            <View style={[styles.boxItem, { backgroundColor: '#C8E6C9' }]}>
              <Text style={styles.boxItemText}>RICE</Text>
            </View>
            <View style={[styles.boxItem, { backgroundColor: '#FFCCBC' }]}>
              <Text style={styles.boxItemText}>SUGAR</Text>
            </View>
            <View style={[styles.boxItem, { backgroundColor: '#BBDEFB' }]}>
              <Text style={styles.boxItemText}>OIL</Text>
            </View>
          </View>
        </View>

        {/* Counter and Sacks (Bori) in Front */}
        <View style={styles.storeCounterArea}>
          <View style={styles.sackContainer}>
            <View style={[styles.grainSack, { backgroundColor: '#E0CCA7' }]}>
              <Text style={styles.sackLabel}>चावल</Text>
              <Text style={styles.sackSub}>20 kg</Text>
            </View>
            <View style={[styles.grainSack, { backgroundColor: '#D7CCC8' }]}>
              <Text style={styles.sackLabel}>दाल</Text>
              <Text style={styles.sackSub}>15 kg</Text>
            </View>
          </View>

          <View style={styles.counterDesk}>
            <View style={styles.posTerminal}>
              <Text style={styles.posIcon}>📱</Text>
              <Text style={styles.posText}>DukaanOS</Text>
            </View>
            <View style={styles.counterWeighScale}>
              <Text style={styles.scaleEmoji}>⚖️</Text>
            </View>
          </View>
        </View>

        {/* Storefront Plinth / Ground Base */}
        <View style={styles.storePlinth}>
          <View style={styles.plinthStripe} />
        </View>
      </View>
    </View>
  );
};

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const { strings } = useLanguage();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Mini Header with Brand, Language Selector & Offline Badge */}
        <View style={styles.topHeader}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeIcon}>🏪</Text>
            <Text style={styles.brandBadgeTitle}>{strings.appName}</Text>
          </View>
          <View style={styles.headerRight}>
            <LanguageSelector compact />
            <OfflineBadge compact />
          </View>
        </View>

        {/* Storefront Illustration Card */}
        <View style={styles.heroCard}>
          <KiranaStorefrontIllustration />
        </View>

        {/* Main Branding Section */}
        <View style={styles.brandingSection}>
          <Text style={styles.mainTitle}>{strings.appName}</Text>
          <Text style={styles.mainTagline}>{strings.welcomeTagline}</Text>
          <Text style={styles.mainSubtitle}>{strings.welcomeSubtitle}</Text>
        </View>

        {/* Feature Highlights Grid */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresHeading}>{strings.welcomeWhyRetailers}</Text>

          <View style={styles.featuresList}>
            {/* Feature 1 */}
            <View style={styles.featureItem}>
              <View style={[styles.featureIconBox, { backgroundColor: '#E8F5E9' }]}>
                <Text style={styles.featureEmoji}>📦</Text>
              </View>
              <View style={styles.featureTextBox}>
                <Text style={styles.featureTitle}>{strings.welcomeFeatureStockTitle}</Text>
                <Text style={styles.featureDesc}>{strings.welcomeFeatureStockDesc}</Text>
              </View>
            </View>

            {/* Feature 2 */}
            <View style={styles.featureItem}>
              <View style={[styles.featureIconBox, { backgroundColor: '#FFF8E1' }]}>
                <Text style={styles.featureEmoji}>⚡</Text>
              </View>
              <View style={styles.featureTextBox}>
                <Text style={styles.featureTitle}>{strings.welcomeFeatureSalesTitle}</Text>
                <Text style={styles.featureDesc}>{strings.welcomeFeatureSalesDesc}</Text>
              </View>
            </View>

            {/* Feature 3 */}
            <View style={styles.featureItem}>
              <View style={[styles.featureIconBox, { backgroundColor: '#FBE9E7' }]}>
                <Text style={styles.featureEmoji}>🔔</Text>
              </View>
              <View style={styles.featureTextBox}>
                <Text style={styles.featureTitle}>{strings.welcomeFeatureAlertsTitle}</Text>
                <Text style={styles.featureDesc}>{strings.welcomeFeatureAlertsDesc}</Text>
              </View>
            </View>

            {/* Feature 4 */}
            <View style={styles.featureItem}>
              <View style={[styles.featureIconBox, { backgroundColor: '#EDE7F6' }]}>
                <Text style={styles.featureEmoji}>🧠</Text>
              </View>
              <View style={styles.featureTextBox}>
                <Text style={styles.featureTitle}>{strings.welcomeFeatureInsightsTitle}</Text>
                <Text style={styles.featureDesc}>{strings.welcomeFeatureInsightsDesc}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Offline-First USP Highlight Card */}
        <View style={styles.offlineHighlightCard}>
          <View style={styles.offlineIconRow}>
            <View style={styles.offlineBadgePill}>
              <Text style={styles.offlinePillIcon}>📶❌</Text>
              <Text style={styles.offlinePillText}>{strings.welcomeWorksOffline}</Text>
            </View>
            <Text style={styles.offlineSecurityBadge}>100% Local SQLite</Text>
          </View>
          <Text style={styles.offlineHeadline}>{strings.welcomeNoInternet}</Text>
          <Text style={styles.offlineDescription}>{strings.welcomeOfflineDesc}</Text>
        </View>

        {/* Primary CTA Area */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={onStart}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel={strings.welcomeShuruKarein}
          >
            <Text style={styles.ctaButtonText}>{strings.welcomeShuruKarein}</Text>
          </TouchableOpacity>

          <Text style={styles.ctaNote}>{strings.welcomeSetupTime}</Text>
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
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Platform.OS === 'android' ? Spacing.lg : Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.xs + 2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  brandBadgeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  brandBadgeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primaryDark,
    letterSpacing: -0.3,
  },

  /* Hero Card & Storefront */
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  illustrationContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  storeSignboard: {
    backgroundColor: Colors.primaryDark,
    width: '92%',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
    borderWidth: 2,
    borderColor: '#FFD54F',
    marginBottom: -4,
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  signboardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signboardIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  signboardTextCol: {
    alignItems: 'center',
  },
  signboardTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.6,
  },
  signboardSubtitle: {
    color: '#C8E6C9',
    fontWeight: '700',
    fontSize: 9,
    letterSpacing: 1,
  },
  awningContainer: {
    width: '96%',
    zIndex: 2,
  },
  awningRow: {
    flexDirection: 'row',
    height: 18,
    width: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    overflow: 'hidden',
  },
  awningStripe: {
    flex: 1,
  },
  awningStripeGreen: {
    backgroundColor: Colors.primary,
  },
  awningStripeCream: {
    backgroundColor: '#FFFFFF',
  },
  awningValanceRow: {
    flexDirection: 'row',
    height: 8,
    width: '100%',
  },
  awningScallop: {
    flex: 1,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  awningScallopGreen: {
    backgroundColor: Colors.primary,
  },
  awningScallopCream: {
    backgroundColor: '#FFFFFF',
  },
  storeBody: {
    width: '94%',
    backgroundColor: '#FAF7F0',
    borderWidth: 1,
    borderColor: '#D7CCC8',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: Spacing.sm,
    paddingTop: 8,
    paddingBottom: 4,
    marginTop: -2,
    zIndex: 1,
  },
  storeShelfArea: {
    backgroundColor: '#F5EFEB',
    borderRadius: 6,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E6D7CE',
  },
  shelfRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 2,
  },
  shelfDivider: {
    height: 2,
    backgroundColor: '#D7CCC8',
    marginVertical: 4,
    borderRadius: 1,
  },
  jarItem: {
    width: 28,
    height: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  itemEmoji: {
    fontSize: 13,
  },
  boxItem: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
  },
  boxItemText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#3E2723',
    letterSpacing: 0.3,
  },
  storeCounterArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  sackContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  grainSack: {
    width: 38,
    height: 32,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BCAAA4',
  },
  sackLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#4E342E',
  },
  sackSub: {
    fontSize: 7,
    fontWeight: '700',
    color: '#6D4C41',
  },
  counterDesk: {
    backgroundColor: '#8D6E63',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#5D4037',
  },
  posTerminal: {
    backgroundColor: '#263238',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  posIcon: {
    fontSize: 10,
  },
  posText: {
    fontSize: 8,
    color: '#81C784',
    fontWeight: '800',
  },
  counterWeighScale: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scaleEmoji: {
    fontSize: 13,
  },
  storePlinth: {
    marginTop: 6,
    height: 6,
    backgroundColor: '#795548',
    borderRadius: 2,
  },
  plinthStripe: {
    height: 2,
    backgroundColor: '#4E342E',
  },

  /* Branding Header */
  brandingSection: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.8,
    marginBottom: 4,
  },
  mainTagline: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 6,
    textAlign: 'center',
  },
  mainSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.md,
  },

  /* Features Grid */
  featuresContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  featuresHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm + 4,
  },
  featuresList: {
    gap: Spacing.sm + 2,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  featureEmoji: {
    fontSize: 22,
  },
  featureTextBox: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 1,
  },
  featureDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  /* Offline USP Card */
  offlineHighlightCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 18,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#A5D6A7',
    marginBottom: Spacing.lg,
  },
  offlineIconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs + 2,
  },
  offlineBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  offlinePillIcon: {
    fontSize: 11,
  },
  offlinePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  offlineSecurityBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primaryDark,
    backgroundColor: 'rgba(27, 94, 32, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  offlineHeadline: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  offlineDescription: {
    fontSize: 13,
    color: '#2E5931',
    lineHeight: 19,
  },

  /* CTA Area */
  ctaContainer: {
    alignItems: 'center',
    paddingBottom: Spacing.sm,
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    width: '100%',
    height: 56, // Guaranteed >= 48dp touch target
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  ctaNote: {
    marginTop: Spacing.sm,
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
