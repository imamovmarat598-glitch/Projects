import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native'
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps'
import { Ionicons } from '@expo/vector-icons'
import { PhotoStorage } from '../services/PhotoStorage'
import { useLocation } from '../hooks/useLocation'
import { colors } from '../theme/colors'
import type { PhotoMetadata } from '../types/photo'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

const { width, height } = Dimensions.get('window')

interface Props {
  navigation: NativeStackNavigationProp<any>
}

export default function MapScreen({ navigation }: Props) {
  const mapRef = useRef<MapView>(null)
  const [photos, setPhotos] = useState<PhotoMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const { location } = useLocation()

  const loadPhotos = useCallback(async () => {
    try {
      await PhotoStorage.initialize()
      const data = await PhotoStorage.getPhotos()
      setPhotos(data.filter(p => p.coordinates.latitude && p.coordinates.longitude))
    } catch (error) {
      console.error('Failed to load photos:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPhotos()
  }, [loadPhotos])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadPhotos()
    })
    return unsubscribe
  }, [navigation, loadPhotos])

  const goToMyLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      })
    }
  }

  const fitToMarkers = () => {
    if (photos.length > 0 && mapRef.current) {
      const coordinates = photos.map(p => ({
        latitude: p.coordinates.latitude,
        longitude: p.coordinates.longitude,
      }))
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
        animated: true,
      })
    }
  }

  const initialRegion = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: 55.7558,
        longitude: 37.6173,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {photos.map((photo) => (
          <Marker
            key={photo.id}
            coordinate={{
              latitude: photo.coordinates.latitude,
              longitude: photo.coordinates.longitude,
            }}
          >
            <View style={styles.markerContainer}>
              <Image source={{ uri: photo.uri }} style={styles.markerImage} />
            </View>
            <Callout
              onPress={() => navigation.navigate('PhotoDetail', { photo })}
            >
              <View style={styles.callout}>
                <Image source={{ uri: photo.uri }} style={styles.calloutImage} />
                <Text style={styles.calloutText}>View Details</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Map</Text>
        <Text style={styles.subtitle}>
          {photos.length} photos on map
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={goToMyLocation}>
          <Ionicons name="locate" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={fitToMarkers}>
          <Ionicons name="scan" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  controls: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    gap: 12,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  markerContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: colors.primary,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  markerImage: {
    width: '100%',
    height: '100%',
  },
  callout: {
    width: 150,
    alignItems: 'center',
  },
  calloutImage: {
    width: 140,
    height: 100,
    borderRadius: 8,
  },
  calloutText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
})
