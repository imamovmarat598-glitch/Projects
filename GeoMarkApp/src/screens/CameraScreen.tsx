import React, { useRef, useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { CameraView, CameraType } from 'expo-camera'
import { Ionicons } from '@expo/vector-icons'
import { useLocation, GPSAccuracy } from '../hooks/useLocation'
import { useCamera } from '../hooks/useCamera'
import { PhotoStorage } from '../services/PhotoStorage'
import { colors } from '../theme/colors'

export default function CameraScreen() {
  const cameraRef = useRef<CameraView>(null)
  const [facing, setFacing] = useState<CameraType>('back')
  const [flash, setFlash] = useState<'off' | 'on' | 'auto'>('auto')

  const { location, accuracy, error: locationError, isLoading: locationLoading } = useLocation()
  const { hasPermissions, requestPermissions, capturePhoto, isCapturing } = useCamera()

  useEffect(() => {
    requestPermissions()
    PhotoStorage.initialize()
  }, [])

  const handleCapture = async () => {
    if (!location) {
      Alert.alert('GPS', 'Waiting for GPS signal...')
      return
    }

    const photo = await capturePhoto(cameraRef, location)
    if (photo) {
      await PhotoStorage.savePhoto(photo)
      Alert.alert('Success', 'Photo saved with GPS coordinates!')
    } else {
      Alert.alert('Error', 'Failed to capture photo')
    }
  }

  const toggleFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'))
  }

  const toggleFlash = () => {
    setFlash(current => {
      if (current === 'off') return 'on'
      if (current === 'on') return 'auto'
      return 'off'
    })
  }

  const getGPSColor = (acc: GPSAccuracy) => {
    switch (acc) {
      case 'high':
        return colors.gpsHigh
      case 'medium':
        return colors.gpsMedium
      case 'low':
        return colors.gpsLow
      default:
        return colors.gpsOff
    }
  }

  const getFlashIcon = () => {
    switch (flash) {
      case 'on':
        return 'flash'
      case 'auto':
        return 'flash-outline'
      default:
        return 'flash-off'
    }
  }

  if (!hasPermissions) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Camera and storage permissions are required
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermissions}>
          <Text style={styles.permissionButtonText}>Grant Permissions</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
      >
        {/* Top Controls */}
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
            <Ionicons name={getFlashIcon()} size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={toggleFacing}>
            <Ionicons name="camera-reverse" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* GPS Indicator */}
        <View style={styles.gpsIndicator}>
          <View style={[styles.gpsDot, { backgroundColor: getGPSColor(accuracy) }]} />
          <Text style={styles.gpsText}>
            {locationLoading
              ? 'Getting GPS...'
              : location
              ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
              : 'No GPS signal'}
          </Text>
          {location?.accuracy && (
            <Text style={styles.gpsAccuracy}>
              {accuracy === 'high' ? 'HIGH' : accuracy === 'medium' ? 'MED' : 'LOW'}
              {' '}({Math.round(location.accuracy)}m)
            </Text>
          )}
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <View style={styles.captureButtonOuter}>
            <TouchableOpacity
              style={[
                styles.captureButton,
                isCapturing && styles.captureButtonDisabled,
              ]}
              onPress={handleCapture}
              disabled={isCapturing}
            >
              {isCapturing ? (
                <ActivityIndicator color="white" size="large" />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  permissionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  permissionButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gpsIndicator: {
    position: 'absolute',
    top: 110,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  gpsDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  gpsText: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'monospace',
  },
  gpsAccuracy: {
    color: 'white',
    fontSize: 11,
    marginLeft: 8,
    fontWeight: '600',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    alignItems: 'center',
  },
  captureButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
  },
})
