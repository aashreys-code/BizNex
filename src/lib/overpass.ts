/**
 * Overpass API service — queries real business data from OpenStreetMap.
 * Free, no API key required.
 */

export interface OverpassBusiness {
  id: number
  name: string
  type: string
  category: string // OSM category: shop, amenity, craft, etc.
  lat: number
  lng: number
  phone?: string
  website?: string
  openingHours?: string
}

const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter'

/** Map user-entered business types to Overpass query categories */
function buildOverpassQuery(
  businessType: string,
  lat: number,
  lng: number,
  radiusMeters: number
): string {
  const bt = businessType.toLowerCase()

  // Determine which OSM tags to search for based on business type
  const shopTypes: string[] = []
  const amenityTypes: string[] = []
  const craftTypes: string[] = []

  if (bt.includes('grocer') || bt.includes('kirana') || bt.includes('provision') || bt.includes('general store') || bt.includes('supermarket')) {
    shopTypes.push('supermarket', 'convenience', 'general', 'kiosk')
  }
  if (bt.includes('dairy') || bt.includes('milk')) {
    shopTypes.push('dairy')
    amenityTypes.push('cafe')
  }
  if (bt.includes('restaurant') || bt.includes('hotel') || bt.includes('food') || bt.includes('tiffin')) {
    amenityTypes.push('restaurant', 'fast_food', 'cafe', 'bar')
  }
  if (bt.includes('tailor') || bt.includes('stitch') || bt.includes('boutique') || bt.includes('fashion') || bt.includes('cloth')) {
    shopTypes.push('clothes', 'fashion', 'shoes')
    craftTypes.push('tailor')
  }
  if (bt.includes('mobile') || bt.includes('phone') || bt.includes('repair') || bt.includes('electronics')) {
    shopTypes.push('electronics', 'mobile_phone', 'computer')
    craftTypes.push('electronics_repair')
  }
  if (bt.includes('beauty') || bt.includes('salon') || bt.includes('parlour') || bt.includes('spa')) {
    shopTypes.push('beauty')
    amenityTypes.push('beauty_salon')
  }
  if (bt.includes('pharmacy') || bt.includes('medical') || bt.includes('medicine') || bt.includes('drug')) {
    shopTypes.push('chemist')
    amenityTypes.push('pharmacy')
  }
  if (bt.includes('stationery') || bt.includes('book') || bt.includes('print')) {
    shopTypes.push('stationery', 'books', 'print')
  }
  if (bt.includes('fertilizer') || bt.includes('seed') || bt.includes('agro') || bt.includes('farm')) {
    shopTypes.push('garden_centre', 'farm')
  }
  if (bt.includes('hardware') || bt.includes('iron') || bt.includes('steel')) {
    shopTypes.push('hardware')
  }
  if (bt.includes('bakery') || bt.includes('sweet') || bt.includes('cake')) {
    shopTypes.push('bakery', 'confectionery')
    amenityTypes.push('bakery')
  }

  // If no specific match, do a broad shop + amenity search
  if (shopTypes.length === 0 && amenityTypes.length === 0 && craftTypes.length === 0) {
    shopTypes.push('supermarket', 'convenience', 'general')
    amenityTypes.push('restaurant', 'cafe', 'fast_food')
  }

  const parts: string[] = []

  if (shopTypes.length > 0) {
    const shopRegex = shopTypes.join('|')
    parts.push(`node["shop"~"${shopRegex}"](around:${radiusMeters},${lat},${lng});`)
    parts.push(`way["shop"~"${shopRegex}"](around:${radiusMeters},${lat},${lng});`)
  }
  if (amenityTypes.length > 0) {
    const amenityRegex = amenityTypes.join('|')
    parts.push(`node["amenity"~"${amenityRegex}"](around:${radiusMeters},${lat},${lng});`)
    parts.push(`way["amenity"~"${amenityRegex}"](around:${radiusMeters},${lat},${lng});`)
  }
  if (craftTypes.length > 0) {
    const craftRegex = craftTypes.join('|')
    parts.push(`node["craft"~"${craftRegex}"](around:${radiusMeters},${lat},${lng});`)
  }

  return `
[out:json][timeout:15];
(
  ${parts.join('\n  ')}
);
out body;
>;
out skel qt;
`.trim()
}

/** Parse OSM tag values into a readable business type */
function categorizeType(tags: Record<string, string>): string {
  if (tags.shop) {
    const map: Record<string, string> = {
      supermarket: 'Retail',
      convenience: 'Retail',
      general: 'Retail',
      kiosk: 'Retail',
      clothes: 'Fashion',
      fashion: 'Fashion',
      shoes: 'Fashion',
      electronics: 'Electronics',
      mobile_phone: 'Electronics',
      computer: 'Electronics',
      dairy: 'Dairy',
      bakery: 'Bakery',
      confectionery: 'Bakery',
      chemist: 'Pharmacy',
      stationery: 'Stationery',
      books: 'Stationery',
      hardware: 'Hardware',
      garden_centre: 'Agriculture',
      farm: 'Agriculture',
      beauty: 'Beauty',
    }
    return map[tags.shop] || 'Retail'
  }
  if (tags.amenity) {
    const map: Record<string, string> = {
      restaurant: 'Restaurant',
      fast_food: 'Restaurant',
      cafe: 'Cafe',
      bar: 'Restaurant',
      pub: 'Restaurant',
      pharmacy: 'Pharmacy',
      beauty_salon: 'Beauty',
      bakery: 'Bakery',
    }
    return map[tags.amenity] || 'Services'
  }
  if (tags.craft) {
    const map: Record<string, string> = {
      tailor: 'Tailoring',
      electronics_repair: 'Electronics',
      carpenter: 'Services',
    }
    return map[tags.craft] || 'Services'
  }
  return 'Other'
}

/**
 * Query Overpass API for real businesses near a location.
 * Returns an empty array if the API fails (caller should fall back to mock data).
 */
export async function queryNearbyBusinesses(
  businessType: string,
  lat: number,
  lng: number,
  radiusKm: number
): Promise<OverpassBusiness[]> {
  const radiusMeters = radiusKm * 1000
  const query = buildOverpassQuery(businessType, lat, lng, radiusMeters)

  try {
    const response = await fetch(OVERPASS_ENDPOINT, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(20_000),
    })

    if (!response.ok) {
      console.warn(`Overpass API returned ${response.status}`)
      return []
    }

    const data = await response.json()
    const elements: any[] = data.elements || []

    // Build a map of node coordinates
    const nodeCoords: Record<number, { lat: number; lng: number }> = {}
    for (const el of elements) {
      if (el.type === 'node' && el.lat != null && el.lon != null) {
        nodeCoords[el.id] = { lat: el.lat, lng: el.lon }
      }
    }

    // Extract businesses (ways need their center from nodes)
    const businesses: OverpassBusiness[] = []
    const seen = new Set<string>()

    for (const el of elements) {
      if (el.type !== 'node' || !el.tags) continue

      const name = el.tags.name || el.tags['name:en'] || el.tags['name:hi'] || null
      if (!name) continue // Skip unnamed businesses

      // Deduplicate by name + approximate location
      const key = `${name.toLowerCase()}_${Math.round(el.lat * 100)}_${Math.round(el.lon * 100)}`
      if (seen.has(key)) continue
      seen.add(key)

      businesses.push({
        id: el.id,
        name,
        type: categorizeType(el.tags),
        category: el.tags.shop ? 'shop' : el.tags.amenity ? 'amenity' : 'craft',
        lat: el.lat,
        lng: el.lon,
        phone: el.tags.phone || el.tags['contact:phone'] || undefined,
        website: el.tags.website || el.tags['contact:website'] || undefined,
        openingHours: el.tags.opening_hours || undefined,
      })
    }

    return businesses
  } catch (err) {
    console.warn('Overpass API query failed, falling back to mock data:', err)
    return []
  }
}
