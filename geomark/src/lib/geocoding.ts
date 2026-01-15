export interface GeocodingResult {
  address: string | null
  city: string | null
  country: string | null
}

export async function reverseGeocode(lat: number, lng: number): Promise<GeocodingResult> {
  try {
    // Using OpenStreetMap Nominatim (free)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'GeoMark/1.0',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Geocoding failed')
    }

    const data = await response.json()

    const address = data.display_name || null
    const city =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.municipality ||
      null
    const country = data.address?.country || null

    return { address, city, country }
  } catch (error) {
    console.error('Geocoding error:', error)
    return { address: null, city: null, country: null }
  }
}
