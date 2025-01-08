
import React, { useState, useEffect, useContext } from 'react';
import { SignInScreen } from '../components/Authenticate';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext,AuthContext } from './_layout';
import { YStack } from 'tamagui';

export default function Login() {
    const { currentTheme,toggleTheme } = useContext(ThemeContext);
    const { isAuthenticated, signOut } = useContext(AuthContext);
    const SunnyColor = currentTheme === 'light' ? '#1b1f24' : '#f8f9fa'
    const [appMounted, setAppMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setAppMounted(true); // Set the flag to true when the component mounts
    }, []);

    useEffect(() => {
        if (isAuthenticated && appMounted) {
            // router.replace('/home'); // Navigate only after the app has mounted
            router.replace('/_sitemap');
        }
    }, [isAuthenticated, appMounted, router]);

    if (!appMounted || isAuthenticated) {
        // Render nothing or a loading placeholder while navigating
        return null;
    }

    return (
        <YStack flex={1} ai="center" jc="center" bg="$background" padding="$6">
            <YStack
                position="absolute"
                top={10}
                right={10}
                zIndex={1} // Ensure it stays on top
            >
                <TouchableOpacity onPress={toggleTheme}>
                    <Ionicons name="sunny-outline" size={30} color={SunnyColor} />
                </TouchableOpacity>
            </YStack>
            <SignInScreen />
        </YStack>
    );
}