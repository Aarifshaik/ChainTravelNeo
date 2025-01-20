import { useRef, useEffect } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';

export default function App() {
  const router = useRouter();
  // const animation = useRef<LottieView>(null);
  let devanimation: LottieView;
  interface AnimationRef {
    play: () => void;
  }

  const player = (): void => {
    (devanimation as AnimationRef).play();
  };


  useEffect(() => {
    devanimation.play();
  }, []);

  return (
    <View style={styles.animationContainer}>
      <LottieView
        autoPlay
        loop={true}
        ref={(animation) => {
          devanimation = animation as LottieView;

        }}
        style={{
          width: 400,
          height: 600,
          backgroundColor: '#eee',
        }}
        source={require('../assets/locationPin.json')}
      />
      <View style={styles.buttonContainer}>
        <Button 
          title="Restart Animation" 
          // onPress={player}
          onPress={()=>router.back()} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonContainer: {
    paddingTop: 20,
  },
});