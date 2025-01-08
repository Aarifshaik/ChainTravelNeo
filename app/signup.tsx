import React from 'react';
import {  YStack } from 'tamagui';
import { SignUpScreen } from '../components/Authenticate';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from './_layout';
import { Theme } from 'tamagui';



export default function Register() {
  const { currentTheme,currentColor,toggleTheme,togglePalette } = useContext(ThemeContext);
  const SunnyColor = currentTheme === 'light' ? '#1b1f24' : '#f8f9fa'

  return (
    <Theme name={currentColor}>
    <YStack flex={1} ai="center" jc="center" bg="$background" padding="$6">
      
      <YStack
        position="absolute"
        top={10}
        right={10}
        zIndex={1} 
      >
        <TouchableOpacity onPress={toggleTheme} onLongPress={togglePalette}>
        <Ionicons name="sunny-outline" size={30} color= {SunnyColor} />
        </TouchableOpacity>
      </YStack>
      <SignUpScreen />
    </YStack>
    </Theme>
  );
}
