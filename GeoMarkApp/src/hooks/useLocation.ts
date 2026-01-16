import { useState, useEffect, useCallback } from 'react'
import * as Location from 'expo-location'
import type { GPSCoordinates } from '../types/photo'

export type GPSAccuracy = 'high' | 'medium' | 'low' | 'off'

interface LocationState {
  location: GPSCoordinates | null
  accuracy: GPSAccuracy
  error: string | null
  isLoading: boolean
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    location: null,
    accuracy: 'off',
    error: null,
    isLoading: true,
  })

  const getAccuracyLevel = (accuracy?: number): GPSAccuracy => {
    if (!accuracy) return 'off'
    if (accuracy < 10) return 'high'
    if (accuracy < 50) return 'medium'
    return 'low'
  }

  const requestPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setState(prev => ({
          ...prev,
          error: 'Permission to access location was denied',
          isLoading: false,
        }))
        return false
      }
      return true
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to request location permission',
        isLoading: false,
      }))
      return false
    }
  }, [])

  const getCurrentLocation = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const hasPermission = await requestPermission()
      if (!hasPermission) return null

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })

      const coords: GPSCoordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude ?? undefined,
        accuracy: location.coords.accuracy ?? undefined,
      }

      setState({
        location: coords,
        accuracy: getAccuracyLevel(location.coords.accuracy ?? undefined),
        error: null,
        isLoading: false,
      })

      return coords
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to get current location',
        isLoading: false,
      }))
      return null
    }
  }, [requestPermission])

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null

    const startWatching = async () => {
      const hasPermission = await requestPermission()
      if (!hasPermission) return

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 5,
        },
        (location) => {
          const coords: GPSCoordinates = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude ?? undefined,
            accuracy: location.coords.accuracy ?? undefined,
          }

          setState({
            location: coords,
            accuracy: getAccuracyLevel(location.coords.accuracy ?? undefined),
            error: null,
            isLoading: false,
          })
        }
      )
    }

    startWatching()

    return () => {
      if (subscription) {
        subscription.remove()
      }
    }
  }, [requestPermission])

  return {
    ...state,
    getCurrentLocation,
    requestPermission,
  }
}
