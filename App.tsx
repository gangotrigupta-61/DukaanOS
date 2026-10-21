import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import {
  AddProductScreen,
  HomeScreen,
  LowStockScreen,
  ProductsScreen,
  QuickSaleScreen,
  ShopSetupScreen,
  SlowMovingScreen,
  WelcomeScreen,
} from './app/index';
import { Language } from './constants/strings';
import { Colors } from './constants/theme';
import { LanguageProvider } from './context';
import { getDatabase, getShop, initDatabase } from './db';
import { Screen } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [initialLanguage, setInitialLanguage] = useState<Language>('hi-en');

  useEffect(() => {
    async function setupApp() {
      try {
        const db = await getDatabase();
        await initDatabase(db);
        const shop = await getShop(db);

        if (shop?.language) {
          setInitialLanguage(shop.language as Language);
        }

        // If no shop exists yet, guide the user to Welcome landing screen
        if (!shop) {
          setCurrentScreen('welcome');
        } else {
          setCurrentScreen('home');
        }
      } catch (err) {
        console.error('App initialization error:', err);
      } finally {
        setIsInitializing(false);
      }
    }

    setupApp();
  }, []);

  if (isInitializing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onStart={() => setCurrentScreen('shop_setup')}
          />
        );

      case 'shop_setup':
        return (
          <ShopSetupScreen
            onComplete={() => setCurrentScreen('home')}
            onCancel={() => setCurrentScreen('home')}
          />
        );

      case 'products':
        return (
          <ProductsScreen
            onBack={() => setCurrentScreen('home')}
            onAddProduct={() => setCurrentScreen('add_product')}
            onQuickSale={() => setCurrentScreen('quick_sale')}
            onNavigateToLowStock={() => setCurrentScreen('low_stock')}
            onNavigateToSlowMoving={() => setCurrentScreen('slow_moving')}
          />
        );

      case 'add_product':
        return (
          <AddProductScreen
            onSuccess={() => setCurrentScreen('products')}
            onCancel={() => setCurrentScreen('products')}
          />
        );

      case 'quick_sale':
        return (
          <QuickSaleScreen
            onBack={() => setCurrentScreen('home')}
            onNavigateToAddProduct={() => setCurrentScreen('add_product')}
            onNavigateToProducts={() => setCurrentScreen('products')}
          />
        );

      case 'low_stock':
        return (
          <LowStockScreen
            onBack={() => setCurrentScreen('home')}
            onNavigateToQuickSale={() => setCurrentScreen('quick_sale')}
            onNavigateToProducts={() => setCurrentScreen('products')}
          />
        );

      case 'slow_moving':
        return (
          <SlowMovingScreen
            onBack={() => setCurrentScreen('home')}
            onNavigateToQuickSale={() => setCurrentScreen('quick_sale')}
            onNavigateToProducts={() => setCurrentScreen('products')}
          />
        );

      case 'home':
      default:
        return (
          <HomeScreen onNavigate={(screen: Screen) => setCurrentScreen(screen)} />
        );
    }
  };

  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      {renderScreen()}
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
