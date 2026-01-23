import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  RefreshControl,
  Modal,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { PhotoStorage } from '../services/PhotoStorage'
import { useLocation } from '../hooks/useLocation'
import { colors } from '../theme/colors'
import type { PhotoMetadata } from '../types/photo'
import { SATELLITE_SERVICES } from '../utils/satelliteLinks'

export default function MapScreen() {
  const [photos, setPhotos] = useState<PhotoMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMetadata | null>(null)
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
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadPhotos()
  }, [loadPhotos])

  const onRefresh = () => {
    setRefreshing(true)
    loadPhotos()
  }

  const openInMaps = (photo: PhotoMetadata) => {
    setSelectedPhoto(photo)
  }

  const openSatelliteService = (serviceId: string, coords: { latitude: number; longitude: number }) => {
    const service = SATELLITE_SERVICES.find(s => s.id === serviceId)
    if (service) {
      Linking.openURL(service.getLink(coords))
    }
  }

  const openAllInMaps = () => {
    if (photos.length === 0) return

    // Open first photo location
    const { latitude, longitude } = photos[0].coordinates
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    Linking.openURL(url)
  }

  const formatCoordinates = (lat: number, lon: number): string => {
    const latDir = lat >= 0 ? 'N' : 'S'
    const lonDir = lon >= 0 ? 'E' : 'W'
    return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lon).toFixed(4)}°${lonDir}`
  }

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Map</Text>
        <Text style={styles.subtitle}>
          {photos.length} photos with GPS
        </Text>
      </View>

      {/* Current Location */}
      {location && (
        <View style={styles.currentLocation}>
          <Ionicons name="navigate" size={20} color={colors.primary} />
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Your location</Text>
            <Text style={styles.locationCoords}>
              {formatCoordinates(location.latitude, location.longitude)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.openMapsButton}
            onPress={() => {
              const url = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`
              Linking.openURL(url)
            }}
          >
            <Ionicons name="open-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Open All in Maps */}
      {photos.length > 0 && (
        <TouchableOpacity style={styles.openAllButton} onPress={openAllInMaps}>
          <Ionicons name="map" size={20} color="white" />
          <Text style={styles.openAllText}>Open in Google Maps</Text>
        </TouchableOpacity>
      )}

      {/* Photo List */}
      <ScrollView
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Loading...</Text>
          </View>
        ) : photos.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={64} color={colors.textLight} />
            <Text style={styles.emptyTitle}>No geotagged photos</Text>
            <Text style={styles.emptyText}>
              Take photos with GPS to see them here
            </Text>
          </View>
        ) : (
          photos.map((photo) => (
            <TouchableOpacity
              key={photo.id}
              style={styles.photoCard}
              onPress={() => openInMaps(photo)}
            >
              <Image source={{ uri: photo.uri }} style={styles.thumbnail} />
              <View style={styles.photoInfo}>
                <Text style={styles.photoCoords}>
                  {formatCoordinates(
                    photo.coordinates.latitude,
                    photo.coordinates.longitude
                  )}
                </Text>
                <Text style={styles.photoDate}>{formatDate(photo.timestamp)}</Text>
                {photo.note && (
                  <Text style={styles.photoNote} numberOfLines={1}>
                    {photo.note}
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
            </TouchableOpacity>
          ))
        )}
        <View style={styles.footer} />
      </ScrollView>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Ionicons name="information-circle" size={16} color={colors.textSecondary} />
        <Text style={styles.infoText}>
          Tap on photo to view satellite imagery
        </Text>
      </View>

      {/* Satellite Services Modal */}
      <Modal
        visible={selectedPhoto !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Спутниковые снимки</Text>
              <TouchableOpacity onPress={() => setSelectedPhoto(null)}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            {selectedPhoto && (
              <>
                <View style={styles.photoPreview}>
                  <Image source={{ uri: selectedPhoto.uri }} style={styles.previewImage} />
                  <Text style={styles.previewCoords}>
                    {formatCoordinates(
                      selectedPhoto.coordinates.latitude,
                      selectedPhoto.coordinates.longitude
                    )}
                  </Text>
                </View>

                <ScrollView style={styles.servicesList}>
                  {SATELLITE_SERVICES.map((service) => (
                    <TouchableOpacity
                      key={service.id}
                      style={[styles.serviceCard, { borderLeftColor: service.color }]}
                      onPress={() => {
                        openSatelliteService(service.id, selectedPhoto.coordinates)
                        setSelectedPhoto(null)
                      }}
                    >
                      <View style={[styles.serviceIcon, { backgroundColor: service.color + '20' }]}>
                        <Ionicons name={service.icon as any} size={24} color={service.color} />
                      </View>
                      <View style={styles.serviceInfo}>
                        <Text style={styles.serviceName}>{service.name}</Text>
                        <Text style={styles.serviceDescription}>{service.description}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
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
  currentLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  locationCoords: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  openMapsButton: {
    padding: 8,
  },
  openAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  openAllText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  photoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.border,
  },
  photoInfo: {
    flex: 1,
    marginLeft: 12,
  },
  photoCoords: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  photoDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  photoNote: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  footer: {
    height: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  photoPreview: {
    padding: 20,
    alignItems: 'center',
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  previewCoords: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
  servicesList: {
    paddingHorizontal: 20,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
})
