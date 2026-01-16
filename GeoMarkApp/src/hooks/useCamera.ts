import { useState, useCallback } from 'react'
import { CameraView, useCameraPermissions } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import { Paths, File, Directory } from 'expo-file-system'
import { v4 as uuid } from 'uuid'
import type { GPSCoordinates, PhotoMetadata } from '../types/photo'

export function useCamera() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions()
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions()
  const [isCapturing, setIsCapturing] = useState(false)

  const hasPermissions = cameraPermission?.granted && mediaPermission?.granted

  const requestPermissions = useCallback(async () => {
    const cameraResult = await requestCameraPermission()
    const mediaResult = await requestMediaPermission()
    return cameraResult.granted && mediaResult.granted
  }, [requestCameraPermission, requestMediaPermission])

  const capturePhoto = useCallback(
    async (
      cameraRef: React.RefObject<CameraView | null>,
      location: GPSCoordinates | null
    ): Promise<PhotoMetadata | null> => {
      if (!cameraRef.current || isCapturing) return null

      setIsCapturing(true)

      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.85,
          exif: true,
        })

        if (!photo) {
          throw new Error('Failed to capture photo')
        }

        const id = uuid()
        const timestamp = Date.now()
        const fileName = `geomark_${timestamp}.jpg`

        // Create photos directory
        const photosDir = new Directory(Paths.document, 'photos')
        if (!photosDir.exists) {
          photosDir.create()
        }

        // Create new file
        const photoFile = new File(photosDir, fileName)
        const sourceFile = new File(photo.uri)

        // Move photo to app directory
        sourceFile.move(photoFile)

        const photoPath = photoFile.uri

        const metadata: PhotoMetadata = {
          id,
          uri: photoPath,
          coordinates: location || {
            latitude: 0,
            longitude: 0,
          },
          timestamp,
          createdAt: timestamp,
          updatedAt: timestamp,
          fileSize: photoFile.size,
          dimensions: {
            width: photo.width,
            height: photo.height,
          },
        }

        // Save to media library (optional)
        await MediaLibrary.saveToLibraryAsync(photoPath)

        return metadata
      } catch (error) {
        console.error('Capture error:', error)
        return null
      } finally {
        setIsCapturing(false)
      }
    },
    [isCapturing]
  )

  return {
    hasPermissions,
    requestPermissions,
    capturePhoto,
    isCapturing,
  }
}
