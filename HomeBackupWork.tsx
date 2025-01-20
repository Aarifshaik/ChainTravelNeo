

import React, { useState, useEffect, useContext,useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { AuthContext, ThemeContext } from './_layout';
import { useRouter } from 'expo-router';
import darkModeStyle from '../assets/darkModeStyle.json';
import uber from '../assets/Uber.json';

import LottieView from 'lottie-react-native';


export default function Mao() {
  const router = useRouter();
  const { currentTheme,currentColor,toggleTheme,togglePalette } = useContext(ThemeContext);
  const SunnyColor = currentTheme === 'light' ? '#1b1f24' : '#f8f9fa'
  const { signOut } = useContext(AuthContext);
  // const [refresh, setRefresh] = useState(false);
  const [initialRegion, setInitialRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);

  const [markers, setMarkers] = useState([
    { id: 1, latitude: 16.524391, longitude: 80.627509 },
  ]);

  const devanimation = useRef<LottieView>(null);
  // const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (devanimation.current) {
      devanimation.current.play();
    }
  }, []);

  // Fetch location on mount or refresh
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      setMarkers((prevMarkers) =>
        prevMarkers.map((marker) => ({
          ...marker,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }))
      );
    })();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    await signOut();
    router.replace('/');
  };

  // Refresh handler
  // const handleRefresh = () => {
  //   setRefresh((prev) => !prev); // Trigger rerender
  // };

  return (
    <View 
    style={styles.container} 
    // key={refresh ? 1 : 0}
    >
      {/* Logout Button */}
      <TouchableOpacity onPress={handleLogout} style={styles.signOutButton}>
        <Ionicons name="log-out-outline" size={30} color={SunnyColor} />
      </TouchableOpacity>

      {/* Refresh Button */}
      {/* <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
        <Ionicons name="refresh-outline" size={30} color={SunnyColor} />
      </TouchableOpacity> */}

      {initialRegion && (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          // customMapStyle={darkModeStyle}
          // customMapStyle={uber}
          // customMapStyle={currentTheme === 'dark' ? darkModeStyle : uber}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={`Marker ${marker.id}`}
              description={`Location for marker ${marker.id}`}
            >
              {/* <Image
                source={require('../assets/bus.png')}
                style={styles.markerImage}
              /> */}
               <View style={{ width: 120, height: 100 }}>
               <LottieView
                  autoPlay
                  speed={1.2}
                  loop={true}
                  ref={devanimation}
                  style={{ width: '100%', height: '100%' }}
                  source={require('../assets/locationPin.json')}
                />
               </View>
            </Marker>
          ))}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  refreshButton: {
    position: 'absolute',
    top: 60,
    right: 15,
    zIndex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerImage: {
    width: 40,
    height: 40,
  },
});
