import React, { createContext, useState, useEffect, useContext } from 'react';
import { AppState } from 'react-native';
import { SplashScreen, Stack } from 'expo-router';
import LottieView from 'lottie-react-native';
import { View, StyleSheet } from 'react-native';
import { supabase } from '~/utils/supabase';
import { TamaguiProvider, ThemeName, Theme } from 'tamagui';
import config from '../tamagui.config';
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

export const AuthContext = createContext({
  isAuthenticated: false,
  signOut: async () => {},
});

export const ThemeContext = createContext({
  currentTheme: 'light' as ThemeName,
  toggleTheme: () => {},
});

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Simulate resource loading or initialization logic
    const prepareApp = async () => {
      // Load fonts, check auth, etc.
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate async task
      setAppReady(true); // Indicate the app is ready
      SplashScreen.hideAsync(); // Hide the native splash screen
    };

    prepareApp();
  }, []);


  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('light');

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();

    // Check initial session
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    })();

    // Listen for auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        console.log('User signed in');
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        console.log('User signed out');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed');
      }
    });

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, [loaded]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        supabase.auth.startAutoRefresh();
        console.log('Started token auto-refresh');
      } else {
        supabase.auth.stopAutoRefresh();
        console.log('Stopped token auto-refresh');
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      supabase.auth.stopAutoRefresh(); // Ensure no leaks when unmounting
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  if (!loaded) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, signOut }}>
      <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
      <TamaguiProvider config={config}>
        <Theme name={currentTheme}>
        {!appReady ? (
          // Render Lottie animation while app is not ready
          <View style={styles.container}>
            <LottieView
              source={require('../assets/LoadingPin.json')} // Path to your Lottie animation file
              autoPlay
              loop={true} // Stops when animation completes
              // onAnimationFinish={() => setAppReady(true)} // Signal app is ready
              style={styles.lottie}
            />
          </View>
        ) : (
          <>
            <Stack screenOptions={{ headerShown: false }} />
          </>
        )}
          {/* <Stack screenOptions = {{headerShown: false}} /> */}
        </Theme>
      </TamaguiProvider>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 300,
    height: 300,
  },
});