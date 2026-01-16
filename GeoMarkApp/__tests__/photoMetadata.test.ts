/**
 * Photo Metadata Tests
 * Tests for photo metadata structure and validation
 */

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

// Validation functions
const isValidPhotoId = (id: string): boolean => {
  return typeof id === 'string' && id.length > 0
}

const isValidUri = (uri: string): boolean => {
  return typeof uri === 'string' && (uri.startsWith('file://') || uri.startsWith('content://'))
}

const isValidTimestamp = (timestamp: number): boolean => {
  return typeof timestamp === 'number' && timestamp > 0 && timestamp <= Date.now() + 86400000
}

const isValidPhotoMetadata = (photo: PhotoMetadata): boolean => {
  return (
    isValidPhotoId(photo.id) &&
    isValidUri(photo.uri) &&
    typeof photo.coordinates === 'object' &&
    isValidTimestamp(photo.timestamp)
  )
}

const generatePhotoId = (): string => {
  return `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

const createPhotoMetadata = (
  uri: string,
  coordinates: GPSCoordinates,
  options?: Partial<PhotoMetadata>
): PhotoMetadata => {
  const now = Date.now()
  return {
    id: generatePhotoId(),
    uri,
    coordinates,
    timestamp: now,
    createdAt: now,
    updatedAt: now,
    ...options,
  }
}

describe('Photo ID Generation', () => {
  test('should generate unique IDs', () => {
    const ids = new Set<string>()
    for (let i = 0; i < 100; i++) {
      ids.add(generatePhotoId())
    }
    expect(ids.size).toBe(100)
  })

  test('should generate IDs with correct prefix', () => {
    const id = generatePhotoId()
    expect(id).toMatch(/^photo-\d+-[a-z0-9]+$/)
  })

  test('should validate correct IDs', () => {
    expect(isValidPhotoId('photo-123-abc')).toBe(true)
    expect(isValidPhotoId('any-string')).toBe(true)
  })

  test('should reject invalid IDs', () => {
    expect(isValidPhotoId('')).toBe(false)
  })
})

describe('Photo URI Validation', () => {
  test('should accept file:// URIs', () => {
    expect(isValidUri('file://photos/image.jpg')).toBe(true)
    expect(isValidUri('file:///storage/emulated/0/DCIM/photo.jpg')).toBe(true)
  })

  test('should accept content:// URIs (Android)', () => {
    expect(isValidUri('content://media/external/images/1234')).toBe(true)
  })

  test('should reject http URLs', () => {
    expect(isValidUri('http://example.com/photo.jpg')).toBe(false)
    expect(isValidUri('https://example.com/photo.jpg')).toBe(false)
  })

  test('should reject empty strings', () => {
    expect(isValidUri('')).toBe(false)
  })
})

describe('Timestamp Validation', () => {
  test('should accept current timestamp', () => {
    expect(isValidTimestamp(Date.now())).toBe(true)
  })

  test('should accept past timestamps', () => {
    expect(isValidTimestamp(Date.now() - 86400000)).toBe(true) // Yesterday
    expect(isValidTimestamp(1705312200000)).toBe(true) // Jan 15, 2024
  })

  test('should reject zero', () => {
    expect(isValidTimestamp(0)).toBe(false)
  })

  test('should reject negative timestamps', () => {
    expect(isValidTimestamp(-1)).toBe(false)
  })

  test('should reject far future timestamps', () => {
    expect(isValidTimestamp(Date.now() + 86400000 * 365)).toBe(false) // 1 year in future
  })
})

describe('Photo Metadata Creation', () => {
  test('should create valid metadata with required fields', () => {
    const photo = createPhotoMetadata(
      'file://photos/test.jpg',
      { latitude: 55.7558, longitude: 37.6173 }
    )

    expect(isValidPhotoMetadata(photo)).toBe(true)
    expect(photo.uri).toBe('file://photos/test.jpg')
    expect(photo.coordinates.latitude).toBe(55.7558)
  })

  test('should include timestamps', () => {
    const before = Date.now()
    const photo = createPhotoMetadata(
      'file://photos/test.jpg',
      { latitude: 0, longitude: 0 }
    )
    const after = Date.now()

    expect(photo.timestamp).toBeGreaterThanOrEqual(before)
    expect(photo.timestamp).toBeLessThanOrEqual(after)
    expect(photo.createdAt).toBe(photo.timestamp)
    expect(photo.updatedAt).toBe(photo.timestamp)
  })

  test('should allow optional fields', () => {
    const photo = createPhotoMetadata(
      'file://photos/test.jpg',
      { latitude: 55.7558, longitude: 37.6173, altitude: 150 },
      {
        note: 'Test note',
        address: 'Moscow, Russia',
        fileSize: 2048000,
        dimensions: { width: 4032, height: 3024 },
      }
    )

    expect(photo.note).toBe('Test note')
    expect(photo.address).toBe('Moscow, Russia')
    expect(photo.fileSize).toBe(2048000)
    expect(photo.dimensions?.width).toBe(4032)
  })
})

describe('Photo Metadata Validation', () => {
  test('should validate complete metadata', () => {
    const photo: PhotoMetadata = {
      id: 'photo-123',
      uri: 'file://photos/test.jpg',
      coordinates: { latitude: 55.7558, longitude: 37.6173 },
      timestamp: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    expect(isValidPhotoMetadata(photo)).toBe(true)
  })

  test('should reject metadata with invalid ID', () => {
    const photo: PhotoMetadata = {
      id: '',
      uri: 'file://photos/test.jpg',
      coordinates: { latitude: 55.7558, longitude: 37.6173 },
      timestamp: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    expect(isValidPhotoMetadata(photo)).toBe(false)
  })

  test('should reject metadata with invalid URI', () => {
    const photo: PhotoMetadata = {
      id: 'photo-123',
      uri: 'invalid-uri',
      coordinates: { latitude: 55.7558, longitude: 37.6173 },
      timestamp: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    expect(isValidPhotoMetadata(photo)).toBe(false)
  })
})

describe('Photo Dimensions', () => {
  const calculateAspectRatio = (width: number, height: number): number => {
    return width / height
  }

  const isLandscape = (width: number, height: number): boolean => {
    return width > height
  }

  const isPortrait = (width: number, height: number): boolean => {
    return height > width
  }

  test('should calculate aspect ratio correctly', () => {
    expect(calculateAspectRatio(4032, 3024)).toBeCloseTo(1.333, 2) // 4:3
    expect(calculateAspectRatio(1920, 1080)).toBeCloseTo(1.778, 2) // 16:9
    expect(calculateAspectRatio(1080, 1080)).toBe(1) // 1:1
  })

  test('should detect landscape orientation', () => {
    expect(isLandscape(4032, 3024)).toBe(true)
    expect(isLandscape(1920, 1080)).toBe(true)
    expect(isLandscape(1080, 1920)).toBe(false)
  })

  test('should detect portrait orientation', () => {
    expect(isPortrait(3024, 4032)).toBe(true)
    expect(isPortrait(1080, 1920)).toBe(true)
    expect(isPortrait(1920, 1080)).toBe(false)
  })
})

describe('File Size Formatting', () => {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }

  test('should format bytes', () => {
    expect(formatFileSize(500)).toBe('500 B')
  })

  test('should format kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB')
    expect(formatFileSize(1536)).toBe('1.5 KB')
  })

  test('should format megabytes', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1.0 MB')
    expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB')
  })

  test('should format gigabytes', () => {
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.0 GB')
  })
})
