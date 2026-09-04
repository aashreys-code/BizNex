/**
 * Geocoding service using Nominatim (OpenStreetMap) — free, no API key needed.
 * Resolves any location string to real latitude/longitude coordinates.
 */

export interface GeocodedLocation {
  lat: number
  lng: number
  displayName: string
  district?: string
  state?: string
  country?: string
}

/**
 * Convert a location string (e.g. "Pune, Maharashtra") to real coordinates.
 * Uses Nominatim for geocoding — fully free and open-source.
 */
export async function geocodeLocation(location: string): Promise<GeocodedLocation | null> {
  const query = `${location}, India`
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'BizNex/1.0 (business-advisor-app)',
      },
      signal: AbortSignal.timeout(10_000),
    })

    if (!response.ok) return null

    const data = await response.json()
    if (!data || data.length === 0) return null

    const result = data[0]
    const address = result.address || {}

    return {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      displayName: result.display_name || location,
      district: address.county || address.district || address.city || undefined,
      state: address.state || undefined,
      country: address.country || undefined,
    }
  } catch (err) {
    console.warn('Geocoding failed for:', location, err)
    return null
  }
}

/**
 * Reverse geocode — get location name from coordinates.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'BizNex/1.0 (business-advisor-app)',
      },
      signal: AbortSignal.timeout(10_000),
    })

    if (!response.ok) return null

    const data = await response.json()
    return data.display_name || null
  } catch {
    return null
  }
}
