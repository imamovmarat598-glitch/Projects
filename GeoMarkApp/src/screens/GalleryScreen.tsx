import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { PhotoStorage } from '../services/PhotoStorage'
import { colors } from '../theme/colors'
import type { PhotoMetadata } from '../types/photo'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

const { width } = Dimensions.get('window')
const PHOTO_SIZE = (width - 48) / 3

interface Props {
  navigation: NativeStackNavigationProp<any>
}

export default function GalleryScreen({ navigation }: Props) {
  const [photos, setPhotos] = useState<PhotoMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadPhotos = useCallback(async () => {
    try {
      await PhotoStorage.initialize()
      const data = await PhotoStorage.getPhotos()
      setPhotos(data)
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadPhotos()
    })
    return unsubscribe
  }, [navigation, loadPhotos])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    loadPhotos()
  }, [loadPhotos])

  const renderPhoto = ({ item }: { item: PhotoMetadata }) => (
    <TouchableOpacity
      style={styles.photoContainer}
      onPress={() => navigation.navigate('PhotoDetail', { photo: item })}
    >
      <Image source={{ uri: item.uri }} style={styles.photo} />
      <View style={styles.photoOverlay}>
        <Ionicons name="location" size={14} color="white" />
      </View>
    </TouchableOpacity>
  )

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Gallery</Text>
      <Text style={styles.subtitle}>
        {photos.length} {photos.length === 1 ? 'photo' : 'photos'} with GPS
      </Text>
    </View>
  )

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="images-outline" size={64} color={colors.textLight} />
      <Text style={styles.emptyTitle}>No Photos Yet</Text>
      <Text style={styles.emptySubtitle}>
        Take photos with the camera to see them here
      </Text>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        renderItem={renderPhoto}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.list}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  header: {
    padding: 20,
    paddingTop: 60,
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
  list: {
    paddingHorizontal: 16,
  },
  photoContainer: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    margin: 4,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.divider,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
})
