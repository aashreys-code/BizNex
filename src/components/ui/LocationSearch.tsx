/**
 * LocationSearch — India-wide location autocomplete
 * 
 * Uses Nominatim (OpenStreetMap) for geocoding — free, no API key needed.
 * Supports fuzzy matching, keyboard navigation, and structured location data.
 * 
 * Data source: OpenStreetMap Nominatim
 * Source note shown to users for transparency.
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { Search, MapPin, Loader2, X, Navigation } from 'lucide-react'

interface LocationResult {
  displayName: string
  shortName: string
  lat: number
  lng: number
  village?: string
  block?: string
  district?: string
  state?: string
  source: string
}

interface LocationSearchProps {
  value: string
  locationData?: {
    village?: string
    block?: string
    district?: string
    state?: string
    lat?: number
    lng?: number
    source?: string
  }
  onSelect: (location: LocationResult) => void
  placeholder?: string
}

export default function LocationSearch({
  value,
  locationData,
  onSelect,
  placeholder = 'Search for your village, town, or area...',
}: LocationSearchProps) {
  const [query, setQuery] = useState(value || '')
  const [results, setResults] = useState<LocationResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search
  const searchLocations = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', India')}&limit=8&addressdetails=1&countrycodes=in`
      const response = await fetch(url, {
        headers: { 'User-Agent': 'BizNex/1.0 (business-advisor-app)' },
        signal: AbortSignal.timeout(8000),
      })

      if (!response.ok) throw new Error('Search failed')

      const data = await response.json()
      const mapped: LocationResult[] = data.map((item: any) => {
        const addr = item.address || {}
        const village = addr.village || addr.town || addr.city || addr.hamlet || addr.locality || ''
        const block = addr.suburb || addr.quarter || addr.neighbourhood || addr.county || ''
        const district = addr.district || addr.county || addr.city_district || addr.state_district || ''
        const state = addr.state || ''

        // Build a clean short name
        const parts = [village || item.display_name.split(',')[0], district, state].filter(Boolean)
        const shortName = parts.join(', ')

        return {
          displayName: item.display_name,
          shortName,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          village: village || undefined,
          block: block || undefined,
          district: district || undefined,
          state: state || undefined,
          source: 'OpenStreetMap Nominatim',
        }
      })

      setResults(mapped)
      setShowResults(true)
      setSelectedIndex(-1)
    } catch (err) {
      console.warn('Location search failed:', err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQuery(val)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => searchLocations(val), 300)
  }

  function handleSelect(result: LocationResult) {
    setQuery(result.shortName)
    setShowResults(false)
    onSelect(result)
    inputRef.current?.blur()
  }

  function handleClear() {
    setQuery('')
    setResults([])
    setShowResults(false)
    onSelect({
      displayName: '',
      shortName: '',
      lat: 0,
      lng: 0,
      source: '',
    })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showResults || results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSelect(results[selectedIndex])
    } else if (e.key === 'Escape') {
      setShowResults(false)
    }
  }

  function handleUseCurrentLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          // Reverse geocode to get location name
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`
          const response = await fetch(url, {
            headers: { 'User-Agent': 'BizNex/1.0 (business-advisor-app)' },
            signal: AbortSignal.timeout(8000),
          })

          if (!response.ok) throw new Error('Reverse geocoding failed')

          const data = await response.json()
          const addr = data.address || {}
          const village = addr.village || addr.town || addr.city || addr.hamlet || ''
          const block = addr.suburb || addr.quarter || addr.neighbourhood || addr.county || ''
          const district = addr.district || addr.county || addr.city_district || ''
          const state = addr.state || ''

          const parts = [village || data.display_name.split(',')[0], district, state].filter(Boolean)

          const result: LocationResult = {
            displayName: data.display_name,
            shortName: parts.join(', '),
            lat: latitude,
            lng: longitude,
            village: village || undefined,
            block: block || undefined,
            district: district || undefined,
            state: state || undefined,
            source: 'Your device location + OpenStreetMap',
          }

          setQuery(result.shortName)
          onSelect(result)
        } catch (err) {
          console.warn('Reverse geocoding failed:', err)
          // Still use coordinates even if reverse geocoding fails
          const result: LocationResult = {
            displayName: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            shortName: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            lat: latitude,
            lng: longitude,
            source: 'Your device location',
          }
          setQuery(result.shortName)
          onSelect(result)
        } finally {
          setGeoLoading(false)
        }
      },
      (err) => {
        setGeoLoading(false)
        if (err.code === 1) {
          alert('Location permission denied. Please enable location access or type your location manually.')
        } else {
          alert('Unable to get your location. Please type it manually.')
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setShowResults(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="input-field pl-10 pr-20 w-full"
          autoComplete="off"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <button
              onClick={handleClear}
              className="p-1 rounded-md transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={14} />
            </button>
          )}
          {loading && (
            <Loader2 size={14} className="animate-spin" style={{ color: 'var(--accent-bright)' }} />
          )}
        </div>
      </div>

      {/* Use Current Location Button */}
      <button
        onClick={handleUseCurrentLocation}
        disabled={geoLoading}
        className="mt-2 flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg transition-colors w-full"
        style={{
          background: 'var(--bg-surface)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border)',
        }}
      >
        {geoLoading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Navigation size={14} style={{ color: 'var(--accent-bright)' }} />
        )}
        {geoLoading ? 'Getting your location...' : 'Use my current location'}
      </button>

      {/* Results Dropdown */}
      {showResults && results.length > 0 && (
        <div
          className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-strong)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {results.map((result, i) => (
            <button
              key={i}
              onClick={() => handleSelect(result)}
              className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors"
              style={{
                background: i === selectedIndex ? 'var(--accent-dim)' : 'transparent',
                borderBottom: i < results.length - 1 ? '1px solid var(--border)' : 'none',
              }}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <MapPin size={16} style={{ color: 'var(--accent-bright)' }} className="shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                  {result.shortName}
                </p>
                <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                  {result.district && `${result.district} · `}
                  {result.state}
                  {result.village && ` · ${result.village}`}
                </p>
              </div>
            </button>
          ))}
          <div className="px-4 py-2" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Location data: OpenStreetMap Nominatim
            </p>
          </div>
        </div>
      )}

      {/* No Results */}
      {showResults && !loading && results.length === 0 && query.length >= 2 && (
        <div
          className="absolute z-50 w-full mt-1 rounded-xl p-4 text-center"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-strong)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            No locations found for "{query}"
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Try searching for a district, town, or village name
          </p>
        </div>
      )}

      {/* Selected Location Details */}
      {locationData && locationData.lat && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-md" style={{
            background: 'var(--accent-dim)',
            color: 'var(--accent-bright)',
            border: '1px solid var(--border)',
          }}>
            📍 {locationData.lat.toFixed(4)}, {locationData.lng?.toFixed(4)}
          </span>
        </div>
      )}
    </div>
  )
}
