import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import {
  AddProductScreen,
  HomeScreen,
  ProductsScreen,
  QuickSaleScreen,
  ShopSetupScreen,
} from './app/index';
import { Colors } from './constants/theme';
import { getDatabase, getShop, initDatabase } from './db';
import { Screen } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  useEffect(() => {
    async function setupApp() {
      try {
        const db = await getDatabase();
        await initDatabase(db);
        const shop = await getShop(db);

        // If no shop exists yet, guide the user to first-time setup
        if (!shop) {
          setCurrentScreen('shop_setup');
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

  switch (currentScreen) {
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

    case 'home':
    default:
      return (
        <HomeScreen onNavigate={(screen: Screen) => setCurrentScreen(screen)} />
      );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
