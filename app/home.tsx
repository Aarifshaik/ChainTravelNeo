import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Region } from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { AuthContext, ThemeContext } from './_layout';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { insertLocationData,fetchLocationData,updateLocationData } from '~/utils/locationutils';

export default function MapScreen() {
  const router = useRouter();
  const { currentTheme, currentColor, toggleTheme, togglePalette } = useContext(ThemeContext);
  const SunnyColor = currentTheme === 'light' ? '#1b1f24' : '#f8f9fa';
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const { signOut } = useContext(AuthContext);
  const [locationLoading, setLocationLoading] = useState(true);
  const [userRegion, setUserRegion] = useState<Region | null>(null);
  const [markers, setMarkers] = useState([
    { id: 1, latitude: 11.992822538070827, longitude: 8.4806207767557 },
  ]);
  const [locationData, setLocationData] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const vehicleId = 'V12345'; 
  //11.992822538070827, 8.4806207767557

  const mapRef = useRef<MapView>(null);

  interface MarkerType {
    id: number;
    latitude: number;
    longitude: number;
  }

  interface MapPressEvent {
    nativeEvent: {
      coordinate: {
        latitude: number;
        longitude: number;
      };
    };
  }

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    console.log('Map pressed at:', latitude, longitude);
    const newMarker: MarkerType = {
      id: markers.length + 1,
      latitude,
      longitude,
    };
    // setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    setMarkers((prevMarkers) => [newMarker]);
  };

  // Function to fetch and update location and markers
  const fetchLocationAndUpdate = async () => {
    try {
      if (mapRef.current) {
        // const globalRegion = {
        //   latitude: 20.5937, // Center latitude of India
        //   longitude: 78.9629, // Center longitude of India
        //   latitudeDelta: 100, // Adjust to control zoom level
        //   longitudeDelta: 100,
        // };
        const globalRegion = {
          latitude: 0, // Center latitude of India
          longitude: 0, // Center longitude of India
          latitudeDelta: 100, // Adjust to control zoom level
          longitudeDelta: 100,
        };
        console.log('Loading global view of india...');
        mapRef.current.animateToRegion(globalRegion, 3000); // animation time of 3 seconds ofr going to indian view

      }
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }
      
      setLocationLoading(true);
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
      // let location = { coords: { latitude: 16.524391, longitude: 80.627509 } };
      // let location = { coords: { latitude: 11.992822538070827, longitude: 8.4806207767557 } };
      setLocationLoading(false);
      const fetchedRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      setUserRegion(fetchedRegion);

      setMarkers((prevMarkers) =>
        prevMarkers.map((marker) => ({
          ...marker,
          // Modify or keep as static
        }))
      );
      console.log('Go to your current location...');
      setTimeout(() => {
        mapRef.current?.animateToRegion(fetchedRegion, 3000); // 2 seconds for zoom-in
        }, 3000);
      

    } catch (error) {
      Alert.alert('Error', 'Failed to fetch location');
    }
  };

  // Fetch location on component mount
  useEffect(() => {
    fetchLocationAndUpdate();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    await signOut();
    router.replace('/');
  };

  const handleInsertLocation = async () => {
    const vehicleId = 'V12345'; // Replace with actual vehicle ID
    const latitude = currentLocation?.coords.latitude || 0;
    const longitude = currentLocation?.coords.longitude || 0;
    const accuracy = currentLocation?.coords.accuracy; // Optional
    const speed = currentLocation?.coords.speed // Optional
    const heading = currentLocation?.coords.heading; // Optional

    const result = await insertLocationData(vehicleId, latitude, longitude, accuracy, speed, heading);

    if (result.success) {
      console.log('Location data inserted successfully:', result.data);
    } else {
      console.error('Failed to insert location data:', result.error);
    }
  };

  const getLocationData = async () => {
    const result = await fetchLocationData(vehicleId, 5); // Fetch latest 5 locations
    if (result.success) {
      setLocationData(result.data);
      console.log('Location data fetched successfully:', result.data);
    } else {
      setError('Failed to fetch location data.');
    }
  };


  const handleUpdateLocation = async () => {
    
      const vehicleId = 'V12345'; // Replace with actual vehicle ID
      const latitude = currentLocation?.coords.latitude || 0;
      const longitude = currentLocation?.coords.longitude || 0;
      const accuracy = currentLocation?.coords.accuracy; // Optional
      const speed = currentLocation?.coords.speed // Optional
      const heading = currentLocation?.coords.heading; // Optional
      const locationId = 1; // Replace with the actual location ID
      const result = await updateLocationData(locationId, vehicleId, latitude, longitude, accuracy, speed, heading);

    if (result.success) {
      alert('Location data updated successfully!');
    } else {
      alert('Failed to update location data.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleLogout} style={styles.signOutButton}>
        <Ionicons name="log-out-outline" size={30} color={SunnyColor} />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleUpdateLocation} style={styles.location}>
        <Ionicons name="location" size={30} color={SunnyColor} />
      </TouchableOpacity>

      <TouchableOpacity onPress={getLocationData} style={styles.fetch}>
        <Ionicons name="globe-outline" size={30} color={SunnyColor} />
      </TouchableOpacity>

      <TouchableOpacity onPress={fetchLocationAndUpdate} style={styles.refreshButton}>
        <Ionicons name="refresh-outline" size={30} color={SunnyColor} />
      </TouchableOpacity>

      <MapView
        ref={mapRef}
        style={styles.map}
        toolbarEnabled={false}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 0, // Center latitude of India
          longitude: 0, // Center longitude of India
          latitudeDelta: 80, // Adjust to control zoom level
          longitudeDelta: 80,
        }}
        onPress={handleMapPress}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => { console.log('Marker pressed') }}
            anchor={{ x: 0.5, y: 0.5 }}
            title={`Marker ${marker.id}`}
            description={`Location for marker ${marker.id}`}
          />
        ))}

        {/* Optionally, add user's location marker */}
        {userRegion && !locationLoading && (
          <Marker
            coordinate={{
              latitude: userRegion.latitude,
              longitude: userRegion.longitude,
            }}
            title="Your Location"
            description="This is where you are"
            pinColor="blue" // Different color to distinguish
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  signOutButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.8)', // Optional: Add background for better visibility
    borderRadius: 25,
    padding: 5,
  },
  location: {
    position: 'absolute',
    top: 15,
    right: 115,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.8)', // Optional: Add background for better visibility
    borderRadius: 25,
    padding: 5,
  },
  fetch: {
    position: 'absolute',
    top: 15,
    right: 165,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.8)', // Optional: Add background for better visibility
    borderRadius: 25,
    padding: 5,
  },
  refreshButton: {
    position: 'absolute',
    top: 15,
    right: 65,
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.8)', // Optional: Add background for better visibility
    borderRadius: 25,
    padding: 5,
  },  
  map: {
    width: '100%',
    height: '100%',
  },
});
