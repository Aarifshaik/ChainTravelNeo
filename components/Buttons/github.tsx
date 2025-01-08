import React from 'react';
import { Button } from 'tamagui';
import { useContext } from 'react';
import { ThemeContext } from '../../app/_layout';
import { Ionicons } from '@expo/vector-icons';

const GitHubButton = () => {
  const { currentTheme } = useContext(ThemeContext);
  const GitIconColor = currentTheme === 'light' ? '#1b1f24' : '#f8f9fa'

  return (
    <>
    <Button
      icon={
        <Ionicons
          name="logo-github"
          size={30}
          color={GitIconColor} // Use an existing color property
        />
      }
      flex={1}
      minWidth="100%"
    >
      <Button.Text>Continue with GitHub</Button.Text>
    </Button>
    </>
  );
};

export default GitHubButton;
