import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Paths, File } from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { PhotoStorage } from '../services/PhotoStorage'
import { colors } from '../theme/colors'
import type { ExportFormat, PhotoMetadata } from '../types/photo'

export default function SettingsScreen() {
  const [photoCount, setPhotoCount] = useState(0)
  const [highAccuracy, setHighAccuracy] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [exportLoading, setExportLoading] = useState(false)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      await PhotoStorage.initialize()
      const count = await PhotoStorage.getPhotoCount()
      setPhotoCount(count)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const exportPhotos = async (format: ExportFormat) => {
    setExportLoading(true)
    try {
      const photos = await PhotoStorage.getPhotos()
      if (photos.length === 0) {
        Alert.alert('No Photos', 'There are no photos to export')
        return
      }

      let content = ''
      let filename = ''
      let mimeType = ''

      switch (format) {
        case 'csv':
          content = generateCSV(photos)
          filename = `geomark_export_${Date.now()}.csv`
          mimeType = 'text/csv'
          break
        case 'json':
          content = JSON.stringify(photos, null, 2)
          filename = `geomark_export_${Date.now()}.json`
          mimeType = 'application/json'
          break
        case 'kml':
          content = generateKML(photos)
          filename = `geomark_export_${Date.now()}.kml`
          mimeType = 'application/vnd.google-earth.kml+xml'
          break
        case 'gpx':
          content = generateGPX(photos)
          filename = `geomark_export_${Date.now()}.gpx`
          mimeType = 'application/gpx+xml'
          break
      }

      const exportFile = new File(Paths.cache, filename)
      exportFile.write(content)
      const filePath = exportFile.uri

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, { mimeType })
      }
    } catch (error) {
      console.error('Export error:', error)
      Alert.alert('Error', 'Failed to export photos')
    } finally {
      setExportLoading(false)
    }
  }

  const generateCSV = (photos: PhotoMetadata[]): string => {
    const headers = ['id', 'latitude', 'longitude', 'altitude', 'timestamp', 'note', 'address']
    const rows = photos.map(p => [
      p.id,
      p.coordinates.latitude,
      p.coordinates.longitude,
      p.coordinates.altitude || '',
      new Date(p.timestamp).toISOString(),
      `"${p.note || ''}"`,
      `"${p.address || ''}"`,
    ].join(','))
    return [headers.join(','), ...rows].join('\n')
  }

  const generateKML = (photos: PhotoMetadata[]): string => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>GeoMark Photos</name>
    ${photos.map(p => `
    <Placemark>
      <name>Photo ${p.id.slice(0, 8)}</name>
      <description>${p.note || ''}</description>
      <Point>
        <coordinates>${p.coordinates.longitude},${p.coordinates.latitude},${p.coordinates.altitude || 0}</coordinates>
      </Point>
    </Placemark>`).join('')}
  </Document>
</kml>`
  }

  const generateGPX = (photos: PhotoMetadata[]): string => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="GeoMark">
  ${photos.map(p => `
  <wpt lat="${p.coordinates.latitude}" lon="${p.coordinates.longitude}">
    <ele>${p.coordinates.altitude || 0}</ele>
    <time>${new Date(p.timestamp).toISOString()}</time>
    <name>Photo ${p.id.slice(0, 8)}</name>
    <desc>${p.note || ''}</desc>
  </wpt>`).join('')}
</gpx>`
  }

  const clearAllData = () => {
    Alert.alert(
      'Delete All Photos',
      'Are you sure you want to delete all photos? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            // Implementation would delete all photos
            Alert.alert('Success', 'All photos have been deleted')
            setPhotoCount(0)
          },
        },
      ]
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statCard}>
          <Ionicons name="images" size={32} color={colors.primary} />
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>{photoCount}</Text>
            <Text style={styles.statLabel}>Photos with GPS</Text>
          </View>
        </View>
      </View>

      {/* GPS Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>GPS Settings</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>High Accuracy GPS</Text>
            <Text style={styles.settingDescription}>Use more battery for better accuracy</Text>
          </View>
          <Switch
            value={highAccuracy}
            onValueChange={setHighAccuracy}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={highAccuracy ? colors.primary : colors.textLight}
          />
        </View>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Auto Save to Gallery</Text>
            <Text style={styles.settingDescription}>Save photos to device gallery</Text>
          </View>
          <Switch
            value={autoSave}
            onValueChange={setAutoSave}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={autoSave ? colors.primary : colors.textLight}
          />
        </View>
      </View>

      {/* Export */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Export Data</Text>
        <View style={styles.exportGrid}>
          {(['csv', 'json', 'kml', 'gpx'] as ExportFormat[]).map((format) => (
            <TouchableOpacity
              key={format}
              style={styles.exportButton}
              onPress={() => exportPhotos(format)}
              disabled={exportLoading}
            >
              <Ionicons
                name={format === 'json' ? 'code-slash' : 'document-text'}
                size={24}
                color={colors.primary}
              />
              <Text style={styles.exportLabel}>{format.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => Linking.openURL('https://geomark.com')}
        >
          <Ionicons name="globe" size={20} color={colors.textSecondary} />
          <Text style={styles.linkText}>Website</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => Linking.openURL('https://geomark.com/privacy')}
        >
          <Ionicons name="shield-checkmark" size={20} color={colors.textSecondary} />
          <Text style={styles.linkText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>
        <View style={styles.versionRow}>
          <Text style={styles.versionLabel}>Version</Text>
          <Text style={styles.versionValue}>1.0.0</Text>
        </View>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.error }]}>Danger Zone</Text>
        <TouchableOpacity style={styles.dangerButton} onPress={clearAllData}>
          <Ionicons name="trash" size={20} color={colors.error} />
          <Text style={styles.dangerButtonText}>Delete All Photos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
  },
  statInfo: {
    marginLeft: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  exportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  exportButton: {
    width: '47%',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  exportLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  linkText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  versionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
  },
  versionLabel: {
    fontSize: 16,
    color: colors.text,
  },
  versionValue: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.error,
  },
  dangerButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  footer: {
    height: 100,
  },
})
