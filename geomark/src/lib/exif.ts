import exifr from 'exifr'

export interface ExifData {
  latitude: number | null
  longitude: number | null
  altitude: number | null
  accuracy: number | null
  takenAt: Date | null
  deviceModel: string | null
  width: number | null
  height: number | null
}

export async function extractExif(file: File): Promise<ExifData> {
  try {
    const exif = await exifr.parse(file, {
      gps: true,
      exif: true,
      tiff: true,
    })

    if (!exif) {
      return {
        latitude: null,
        longitude: null,
        altitude: null,
        accuracy: null,
        takenAt: null,
        deviceModel: null,
        width: null,
        height: null,
      }
    }

    return {
      latitude: exif.latitude ?? null,
      longitude: exif.longitude ?? null,
      altitude: exif.GPSAltitude ?? null,
      accuracy: exif.GPSHPositioningError ?? null,
      takenAt: exif.DateTimeOriginal ?? exif.CreateDate ?? null,
      deviceModel: exif.Model ?? exif.Make ?? null,
      width: exif.ImageWidth ?? exif.ExifImageWidth ?? null,
      height: exif.ImageHeight ?? exif.ExifImageHeight ?? null,
    }
  } catch (error) {
    console.error('Error extracting EXIF:', error)
    return {
      latitude: null,
      longitude: null,
      altitude: null,
      accuracy: null,
      takenAt: null,
      deviceModel: null,
      width: null,
      height: null,
    }
  }
}

export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}
