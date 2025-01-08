import { useRouter } from 'expo-router';
import { View, Text, Button, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Image } from 'react-native';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from './_layout';
import { ThemeContext } from './_layout';

export default function Mao() {
  const router = useRouter();
  const { currentTheme,toggleTheme } = useContext(ThemeContext);
  const SunnyColor = currentTheme === 'light' ? '#1b1f24' : '#f8f9fa'
  const {signOut} = useContext(AuthContext);
  const [initialRegion, setInitialRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);


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
      // console.log(location);
      setMarkers((prevMarkers) =>
        prevMarkers.map((marker) => ({
          ...marker,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }))
      );
    })();
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.replace('/');
  };


  const [markers, setMarkers] = useState([
    { id: 1, latitude: 16.524391, longitude: 80.627509 },
  ]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setMarkers((prevMarkers) =>
  //       prevMarkers.map((marker) => ({
  //         ...marker,
  //         latitude: marker.latitude + Math.random() * 0.0002 - 0.00001, // Random movement in latitude
  //         longitude: marker.longitude + Math.random() * 0.0002 - 0.00001, // Random movement in longitude
  //       }))
  //     );
  //   }, 1000);
  //   return () => clearInterval(interval); // Cleanup interval on component unmount
  // }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
      onPress={handleLogout}
        style={styles.signOutButton}
        >
        <Ionicons name="sunny-outline" size={30} color={SunnyColor} />
      </TouchableOpacity>
      {initialRegion && (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={`Marker ${marker.id}`}
              description={`Moving marker ${marker.id}`}
            >
              <Image
                source={require('../assets/bus.png')}
                style={styles.markerImage}
              />
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
  map: {
    width: '100%',
    height: '100%',
  },
  markerImage: {
    width: 40,
    height: 40,
  },
});