export interface GPSCoordinates {
  latitude: number
  longitude: number
  altitude?: number
  accuracy?: number
}

export interface PhotoMetadata {
  id: string
  uri: string
  thumbnailUri?: string
  coordinates: GPSCoordinates
  timestamp: number
  createdAt: number
  updatedAt: number
  note?: string
  address?: string
  fileSize?: number
  dimensions?: {
    width: number
    height: number
  }
}

export interface PhotoFilter {
  dateFrom?: number
  dateTo?: number
  searchQuery?: string
  boundingBox?: {
    northEast: GPSCoordinates
    southWest: GPSCoordinates
  }
}

export type ExportFormat = 'kml' | 'gpx' | 'csv' | 'json'
