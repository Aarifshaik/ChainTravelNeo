import React from 'react';
import { Button } from 'tamagui';
import { useTheme } from 'tamagui';
import { Image } from 'react-native';

interface GoogleButtonProps {
    handleGoogleSignIn: () => void;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ handleGoogleSignIn }) => {
    return (
        <Button 
            icon={
                <Image 
                    source={require('../../assets/googlenew.png')}
                    style={{ width: 38, height: 38 }} 
                />
            } 
            onPress={handleGoogleSignIn}
            flex={1}
        >
            <Button.Text>Continue with Google</Button.Text>
        </Button>
    );
};

export default GoogleButton;
