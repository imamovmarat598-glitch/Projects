/**
 * Export Format Tests
 * Tests for CSV, JSON, KML, GPX export functionality
 */

// Type definitions
interface GPSCoordinates {
  latitude: number
  longitude: number
  altitude?: number
  accuracy?: number
}

interface PhotoMetadata {
  id: string
  uri: string
  coordinates: GPSCoordinates
  timestamp: number
  createdAt: number
  updatedAt: number
  note?: string
  address?: string
  thumbnailUri?: string
  fileSize?: number
  dimensions?: {
    width: number
    height: number
  }
}

// Export format generators
const generateCSV = (photos: PhotoMetadata[]): string => {
  const headers = ['id', 'latitude', 'longitude', 'altitude', 'timestamp', 'note', 'address']
  const rows = photos.map(p => [
    p.id,
    p.coordinates.latitude,
    p.coordinates.longitude,
    p.coordinates.altitude || '',
    new Date(p.timestamp).toISOString(),
    `"${(p.note || '').replace(/"/g, '""')}"`,
    `"${(p.address || '').replace(/"/g, '""')}"`,
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

// Test data
const mockPhotos: PhotoMetadata[] = [
  {
    id: 'photo-abc12345-6789',
    uri: 'file://photos/moscow.jpg',
    coordinates: {
      latitude: 55.7558,
      longitude: 37.6173,
      altitude: 150,
      accuracy: 5,
    },
    timestamp: 1705312200000,
    createdAt: 1705312200000,
    updatedAt: 1705312200000,
    note: 'Red Square, Moscow',
    address: 'Красная площадь, Москва',
  },
  {
    id: 'photo-def67890-1234',
    uri: 'file://photos/nyc.jpg',
    coordinates: {
      latitude: 40.7128,
      longitude: -74.006,
      altitude: 10,
      accuracy: 3,
    },
    timestamp: 1705398600000,
    createdAt: 1705398600000,
    updatedAt: 1705398600000,
    note: 'Statue of Liberty',
    address: 'Liberty Island, NY',
  },
  {
    id: 'photo-ghi11111-5678',
    uri: 'file://photos/sydney.jpg',
    coordinates: {
      latitude: -33.8688,
      longitude: 151.2093,
      altitude: 5,
    },
    timestamp: 1705485000000,
    createdAt: 1705485000000,
    updatedAt: 1705485000000,
  },
]

describe('CSV Export', () => {
  test('should generate valid CSV with headers', () => {
    const csv = generateCSV(mockPhotos)
    const lines = csv.split('\n')

    expect(lines[0]).toBe('id,latitude,longitude,altitude,timestamp,note,address')
  })

  test('should include all photos', () => {
    const csv = generateCSV(mockPhotos)
    const lines = csv.split('\n')

    // Header + 3 photos = 4 lines
    expect(lines.length).toBe(4)
  })

  test('should format coordinates correctly', () => {
    const csv = generateCSV(mockPhotos)

    expect(csv).toContain('55.7558')
    expect(csv).toContain('37.6173')
    expect(csv).toContain('-74.006')
    expect(csv).toContain('-33.8688')
  })

  test('should handle photos without notes', () => {
    const csv = generateCSV(mockPhotos)
    const lines = csv.split('\n')
    const sydneyLine = lines[3]

    expect(sydneyLine).toContain('""') // Empty note and address
  })

  test('should escape quotes in notes', () => {
    const photoWithQuotes: PhotoMetadata = {
      ...mockPhotos[0],
      note: 'Said "Hello World"',
    }
    const csv = generateCSV([photoWithQuotes])

    expect(csv).toContain('""Hello World""')
  })

  test('should handle empty array', () => {
    const csv = generateCSV([])
    const lines = csv.split('\n')

    expect(lines.length).toBe(1)
    expect(lines[0]).toContain('id,latitude')
  })
})

describe('KML Export', () => {
  test('should generate valid KML structure', () => {
    const kml = generateKML(mockPhotos)

    expect(kml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(kml).toContain('<kml xmlns="http://www.opengis.net/kml/2.2">')
    expect(kml).toContain('<Document>')
    expect(kml).toContain('<name>GeoMark Photos</name>')
    expect(kml).toContain('</Document>')
    expect(kml).toContain('</kml>')
  })

  test('should create Placemark for each photo', () => {
    const kml = generateKML(mockPhotos)
    const placemarkCount = (kml.match(/<Placemark>/g) || []).length

    expect(placemarkCount).toBe(3)
  })

  test('should format coordinates as lon,lat,alt (KML order)', () => {
    const kml = generateKML(mockPhotos)

    // KML uses longitude,latitude,altitude order
    expect(kml).toContain('<coordinates>37.6173,55.7558,150</coordinates>')
    expect(kml).toContain('<coordinates>-74.006,40.7128,10</coordinates>')
  })

  test('should include photo notes in description', () => {
    const kml = generateKML(mockPhotos)

    expect(kml).toContain('<description>Red Square, Moscow</description>')
    expect(kml).toContain('<description>Statue of Liberty</description>')
  })

  test('should handle photos without altitude (default to 0)', () => {
    const photoWithoutAlt: PhotoMetadata = {
      ...mockPhotos[0],
      coordinates: { latitude: 55.7558, longitude: 37.6173 },
    }
    const kml = generateKML([photoWithoutAlt])

    expect(kml).toContain(',0</coordinates>')
  })

  test('should use truncated ID in name', () => {
    const kml = generateKML(mockPhotos)

    expect(kml).toContain('<name>Photo photo-ab</name>')
  })
})

describe('GPX Export', () => {
  test('should generate valid GPX structure', () => {
    const gpx = generateGPX(mockPhotos)

    expect(gpx).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(gpx).toContain('<gpx version="1.1" creator="GeoMark">')
    expect(gpx).toContain('</gpx>')
  })

  test('should create waypoint for each photo', () => {
    const gpx = generateGPX(mockPhotos)
    const wptCount = (gpx.match(/<wpt/g) || []).length

    expect(wptCount).toBe(3)
  })

  test('should include lat/lon as attributes', () => {
    const gpx = generateGPX(mockPhotos)

    expect(gpx).toContain('lat="55.7558"')
    expect(gpx).toContain('lon="37.6173"')
    expect(gpx).toContain('lat="40.7128"')
    expect(gpx).toContain('lon="-74.006"')
  })

  test('should include elevation element', () => {
    const gpx = generateGPX(mockPhotos)

    expect(gpx).toContain('<ele>150</ele>')
    expect(gpx).toContain('<ele>10</ele>')
    expect(gpx).toContain('<ele>5</ele>')
  })

  test('should include timestamp in ISO format', () => {
    const gpx = generateGPX(mockPhotos)

    expect(gpx).toContain('<time>')
    expect(gpx).toMatch(/<time>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
  })

  test('should include description', () => {
    const gpx = generateGPX(mockPhotos)

    expect(gpx).toContain('<desc>Red Square, Moscow</desc>')
    expect(gpx).toContain('<desc>Statue of Liberty</desc>')
  })
})

describe('JSON Export', () => {
  test('should generate valid JSON', () => {
    const json = JSON.stringify(mockPhotos, null, 2)
    const parsed = JSON.parse(json)

    expect(Array.isArray(parsed)).toBe(true)
    expect(parsed.length).toBe(3)
  })

  test('should preserve all properties', () => {
    const json = JSON.stringify(mockPhotos, null, 2)
    const parsed = JSON.parse(json)

    expect(parsed[0].id).toBe('photo-abc12345-6789')
    expect(parsed[0].coordinates.latitude).toBe(55.7558)
    expect(parsed[0].coordinates.longitude).toBe(37.6173)
    expect(parsed[0].note).toBe('Red Square, Moscow')
  })

  test('should handle undefined optional fields', () => {
    const json = JSON.stringify(mockPhotos, null, 2)
    const parsed = JSON.parse(json)

    // Sydney photo has no note
    expect(parsed[2].note).toBeUndefined()
  })

  test('should be reversible', () => {
    const json = JSON.stringify(mockPhotos, null, 2)
    const parsed = JSON.parse(json)
    const reStringified = JSON.stringify(parsed, null, 2)

    expect(reStringified).toBe(json)
  })
})

describe('Export Format Selection', () => {
  type ExportFormat = 'csv' | 'json' | 'kml' | 'gpx'

  const getMimeType = (format: ExportFormat): string => {
    switch (format) {
      case 'csv':
        return 'text/csv'
      case 'json':
        return 'application/json'
      case 'kml':
        return 'application/vnd.google-earth.kml+xml'
      case 'gpx':
        return 'application/gpx+xml'
    }
  }

  const getFileExtension = (format: ExportFormat): string => {
    return `.${format}`
  }

  test('should return correct MIME types', () => {
    expect(getMimeType('csv')).toBe('text/csv')
    expect(getMimeType('json')).toBe('application/json')
    expect(getMimeType('kml')).toBe('application/vnd.google-earth.kml+xml')
    expect(getMimeType('gpx')).toBe('application/gpx+xml')
  })

  test('should return correct file extensions', () => {
    expect(getFileExtension('csv')).toBe('.csv')
    expect(getFileExtension('json')).toBe('.json')
    expect(getFileExtension('kml')).toBe('.kml')
    expect(getFileExtension('gpx')).toBe('.gpx')
  })
})
