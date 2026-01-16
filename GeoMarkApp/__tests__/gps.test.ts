/**
 * GPS Coordinates Tests
 * Tests for validating GPS coordinate handling in GeoMark app
 */

// Type definitions (mirror of src/types/photo.ts)
interface GPSCoordinates {
  latitude: number
  longitude: number
  altitude?: number
  accuracy?: number
}

// Validation functions
const isValidLatitude = (lat: number): boolean => {
  return typeof lat === 'number' && !isNaN(lat) && lat >= -90 && lat <= 90
}

const isValidLongitude = (lon: number): boolean => {
  return typeof lon === 'number' && !isNaN(lon) && lon >= -180 && lon <= 180
}

const isValidCoordinates = (coords: GPSCoordinates): boolean => {
  return isValidLatitude(coords.latitude) && isValidLongitude(coords.longitude)
}

const formatCoordinates = (coords: GPSCoordinates): string => {
  const lat = coords.latitude.toFixed(6)
  const lon = coords.longitude.toFixed(6)
  const latDir = coords.latitude >= 0 ? 'N' : 'S'
  const lonDir = coords.longitude >= 0 ? 'E' : 'W'
  return `${Math.abs(coords.latitude).toFixed(6)}°${latDir}, ${Math.abs(coords.longitude).toFixed(6)}°${lonDir}`
}

const calculateDistance = (
  coord1: GPSCoordinates,
  coord2: GPSCoordinates
): number => {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (coord1.latitude * Math.PI) / 180
  const φ2 = (coord2.latitude * Math.PI) / 180
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

describe('GPS Coordinate Validation', () => {
  describe('Latitude Validation', () => {
    test('valid latitudes should pass', () => {
      expect(isValidLatitude(0)).toBe(true)
      expect(isValidLatitude(45)).toBe(true)
      expect(isValidLatitude(-45)).toBe(true)
      expect(isValidLatitude(90)).toBe(true)
      expect(isValidLatitude(-90)).toBe(true)
    })

    test('invalid latitudes should fail', () => {
      expect(isValidLatitude(91)).toBe(false)
      expect(isValidLatitude(-91)).toBe(false)
      expect(isValidLatitude(180)).toBe(false)
      expect(isValidLatitude(NaN)).toBe(false)
    })
  })

  describe('Longitude Validation', () => {
    test('valid longitudes should pass', () => {
      expect(isValidLongitude(0)).toBe(true)
      expect(isValidLongitude(90)).toBe(true)
      expect(isValidLongitude(-90)).toBe(true)
      expect(isValidLongitude(180)).toBe(true)
      expect(isValidLongitude(-180)).toBe(true)
    })

    test('invalid longitudes should fail', () => {
      expect(isValidLongitude(181)).toBe(false)
      expect(isValidLongitude(-181)).toBe(false)
      expect(isValidLongitude(360)).toBe(false)
      expect(isValidLongitude(NaN)).toBe(false)
    })
  })

  describe('Coordinate Validation', () => {
    test('Moscow coordinates should be valid', () => {
      const moscow: GPSCoordinates = { latitude: 55.7558, longitude: 37.6173 }
      expect(isValidCoordinates(moscow)).toBe(true)
    })

    test('New York coordinates should be valid', () => {
      const newYork: GPSCoordinates = { latitude: 40.7128, longitude: -74.006 }
      expect(isValidCoordinates(newYork)).toBe(true)
    })

    test('Sydney coordinates should be valid', () => {
      const sydney: GPSCoordinates = { latitude: -33.8688, longitude: 151.2093 }
      expect(isValidCoordinates(sydney)).toBe(true)
    })

    test('Null Island (0,0) should be valid', () => {
      const nullIsland: GPSCoordinates = { latitude: 0, longitude: 0 }
      expect(isValidCoordinates(nullIsland)).toBe(true)
    })

    test('invalid coordinates should fail', () => {
      expect(isValidCoordinates({ latitude: 100, longitude: 0 })).toBe(false)
      expect(isValidCoordinates({ latitude: 0, longitude: 200 })).toBe(false)
    })
  })
})

describe('GPS Coordinate Formatting', () => {
  test('should format Moscow coordinates correctly', () => {
    const moscow: GPSCoordinates = { latitude: 55.7558, longitude: 37.6173 }
    const formatted = formatCoordinates(moscow)
    expect(formatted).toContain('55.755800°N')
    expect(formatted).toContain('37.617300°E')
  })

  test('should format negative coordinates with correct direction', () => {
    const sydney: GPSCoordinates = { latitude: -33.8688, longitude: 151.2093 }
    const formatted = formatCoordinates(sydney)
    expect(formatted).toContain('S')
    expect(formatted).toContain('E')
  })

  test('should format western hemisphere correctly', () => {
    const newYork: GPSCoordinates = { latitude: 40.7128, longitude: -74.006 }
    const formatted = formatCoordinates(newYork)
    expect(formatted).toContain('N')
    expect(formatted).toContain('W')
  })
})

describe('Distance Calculation', () => {
  test('distance between same point should be 0', () => {
    const point: GPSCoordinates = { latitude: 55.7558, longitude: 37.6173 }
    const distance = calculateDistance(point, point)
    expect(distance).toBe(0)
  })

  test('distance from Moscow to St Petersburg should be ~635 km', () => {
    const moscow: GPSCoordinates = { latitude: 55.7558, longitude: 37.6173 }
    const spb: GPSCoordinates = { latitude: 59.9343, longitude: 30.3351 }
    const distance = calculateDistance(moscow, spb)
    // Should be approximately 635 km
    expect(distance).toBeGreaterThan(600000)
    expect(distance).toBeLessThan(700000)
  })

  test('distance from Moscow to New York should be ~7500 km', () => {
    const moscow: GPSCoordinates = { latitude: 55.7558, longitude: 37.6173 }
    const newYork: GPSCoordinates = { latitude: 40.7128, longitude: -74.006 }
    const distance = calculateDistance(moscow, newYork)
    // Should be approximately 7500 km
    expect(distance).toBeGreaterThan(7000000)
    expect(distance).toBeLessThan(8000000)
  })
})

describe('GPS Accuracy Levels', () => {
  const getAccuracyLevel = (accuracy: number): string => {
    if (accuracy <= 5) return 'excellent'
    if (accuracy <= 10) return 'good'
    if (accuracy <= 30) return 'fair'
    return 'poor'
  }

  test('accuracy <= 5m should be excellent', () => {
    expect(getAccuracyLevel(1)).toBe('excellent')
    expect(getAccuracyLevel(5)).toBe('excellent')
  })

  test('accuracy 6-10m should be good', () => {
    expect(getAccuracyLevel(6)).toBe('good')
    expect(getAccuracyLevel(10)).toBe('good')
  })

  test('accuracy 11-30m should be fair', () => {
    expect(getAccuracyLevel(15)).toBe('fair')
    expect(getAccuracyLevel(30)).toBe('fair')
  })

  test('accuracy > 30m should be poor', () => {
    expect(getAccuracyLevel(50)).toBe('poor')
    expect(getAccuracyLevel(100)).toBe('poor')
  })
})
