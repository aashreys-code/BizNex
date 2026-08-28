import { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MapPin, Loader2, Store, TrendingUp, Star, Users, BarChart3, Target, Filter, X, Download, Edit3, ChevronUp, ChevronDown } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts'
import { findNearbyBusinesses } from '../../lib/ai'
import { useBusiness } from '../../contexts/BusinessContext'
import { useAuth } from '../../contexts/AuthContext'
import { ScrollReveal } from '../../components/react-bits'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import jsPDF from 'jspdf'

/* ─── Types ─────────────────────────────────────────────── */

interface Competitor {
  name: string
  type: string
  lat: number
  lng: number
  distance: number
  popularity: number
  demand: number
  monthlyRevenue: number
  rating: number
  progressScore: number
  established: number
  strengths: string[]
  weaknesses: string[]
  specialties: string[]
}

interface CompetitorResult {
  userBusiness: {
    name: string
    lat: number
    lng: number
    popularity: number
    demand: number
    monthlyRevenue: number
    rating: number
    progressScore: number
  }
  competitors: Competitor[]
  marketSummary: {
    totalCompetitors: number
    averageDemand: number
    averagePopularity: number
    marketSaturation: string
    bestOpportunity: string
    threatLevel: string
  }
  demandTrend: { month: string; demand: number }[]
  popularityComparison: { name: string; score: number }[]
  recommendations: string[]
}

/* ─── Custom SVG markers (unique per type) ──────────────── */

function createSvgIcon(svg: string, size = 36) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center">${svg}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}

const MARKER_COLORS = [
  { bg: '#ef4444', label: 'Retail' },
  { bg: '#f97316', label: 'Wholesale' },
  { bg: '#3b82f6', label: 'Specialty' },
  { bg: '#8b5cf6', label: 'Fashion' },
  { bg: '#ec4899', label: 'Food' },
  { bg: '#14b8a6', label: 'Services' },
  { bg: '#eab308', label: 'Other' },
]

function getMarkerColor(type: string) {
  const t = type.toLowerCase()
  if (t.includes('retail') || t.includes('general')) return MARKER_COLORS[0]
  if (t.includes('wholesale') || t.includes('supply')) return MARKER_COLORS[1]
  if (t.includes('specialty') || t.includes('electronics')) return MARKER_COLORS[2]
  if (t.includes('fashion') || t.includes('clothing') || t.includes('textile')) return MARKER_COLORS[3]
  if (t.includes('food') || t.includes('restaurant') || t.includes('dairy')) return MARKER_COLORS[4]
  if (t.includes('service')) return MARKER_COLORS[5]
  return MARKER_COLORS[6]
}

function competitorIcon(type: string) {
  const c = getMarkerColor(type)
  const svg = `<svg viewBox="0 0 40 48" width="36" height="42" xmlns="http://www.w3.org/2000/svg">
    <defs><filter id="ds"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.4" flood-color="${c.bg}"/></filter></defs>
    <path d="M20 46C20 46 38 28 38 18C38 8.07 29.94 0 20 0C10.06 0 2 8.07 2 18C2 28 20 46 20 46Z" fill="${c.bg}" filter="url(#ds)"/>
    <circle cx="20" cy="17" r="7" fill="white" opacity="0.9"/>
    <text x="20" y="20" text-anchor="middle" font-size="9" font-weight="bold" fill="${c.bg}">${c.label[0]}</text>
  </svg>`
  return createSvgIcon(svg, 38)
}

function userIcon() {
  const svg = `<svg viewBox="0 0 44 52" width="42" height="48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="ug"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.5" flood-color="#21F1A8"/></filter>
    </defs>
    <path d="M22 50C22 50 42 30 42 19C42 8.5 33.5 0 22 0C10.5 0 2 8.5 2 19C2 30 22 50 22 50Z" fill="#21F1A8" filter="url(#ug)"/>
    <circle cx="22" cy="18" r="8" fill="#0e0e0e" opacity="0.85"/>
    <text x="22" y="21.5" text-anchor="middle" font-size="11" font-weight="bold" fill="#21F1A8">★</text>
  </svg>`
  return createSvgIcon(svg, 44)
}

/* ─── Fly-to helper ─────────────────────────────────────── */

function FlyTo({ center }: { center: [number, number] }) {
  const map = useMap()
  useMemo(() => {
    map.flyTo(center, 13, { duration: 1.5 })
  }, [center, map])
  return null
}

/* ─── Score bar ─────────────────────────────────────────── */

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-300 font-medium">{value}/100</span>
      </div>
      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  )
}

/* ─── Main component ────────────────────────────────────── */

export default function NearbyCompetitors() {
  const { profile } = useAuth()
  const { business, isComplete } = useBusiness()
  const [businessType, setBusinessType] = useState(business?.businessType || '')
  const [location, setLocation] = useState(business?.location || profile?.district || '')
  const [radius, setRadius] = useState(business?.radius ? String(business.radius) : '10')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CompetitorResult | null>(null)
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null)
  const [filterType, setFilterType] = useState('All')
  const [downloading, setDownloading] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  useEffect(() => {
    if (!result && !loading) handleSearch()
  }, [])

  const downloadReport = useCallback(() => {
    if (!result) return
    setDownloading(true)
    try {
      const doc = new jsPDF()
      const pageW = doc.internal.pageSize.getWidth()
      let y = 20

      // Title
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('Competitor Comparison Report', pageW / 2, y, { align: 'center' })
      y += 8
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(120)
      doc.text(`${result.userBusiness.name} · ${businessType} · ${location}`, pageW / 2, y, { align: 'center' })
      y += 4
      doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageW / 2, y, { align: 'center' })
      y += 10
      doc.setDrawColor(43, 238, 52)
      doc.setLineWidth(0.5)
      doc.line(20, y, pageW - 20, y)
      y += 10

      // Your Business Summary
      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0)
      doc.text('Your Business', 20, y)
      y += 7
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Demand: ${result.userBusiness.demand}/100  |  Popularity: ${result.userBusiness.popularity}/100  |  Rating: ${result.userBusiness.rating}/5  |  Score: ${result.userBusiness.progressScore}/100`, 20, y)
      y += 6
      doc.text(`Monthly Revenue: INR ${result.userBusiness.monthlyRevenue.toLocaleString('en-IN')}`, 20, y)
      y += 12

      // Key Metrics
      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.text('Market Overview', 20, y)
      y += 7
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const metrics = [
        `Total Competitors: ${result.marketSummary.totalCompetitors}`,
        `Average Demand: ${result.marketSummary.averageDemand}%`,
        `Average Popularity: ${result.marketSummary.averagePopularity}%`,
        `Market Saturation: ${result.marketSummary.marketSaturation}`,
        `Threat Level: ${result.marketSummary.threatLevel}`,
      ]
      metrics.forEach((m) => { doc.text(m, 20, y); y += 6 })
      y += 2
      doc.setFont('helvetica', 'italic')
      doc.text(`Best Opportunity: ${result.marketSummary.bestOpportunity}`, 20, y, { maxWidth: pageW - 40 })
      y += 12

      // Competitor Table
      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0)
      doc.text('Competitor Comparison', 20, y)
      y += 8

      const cols = [
        { header: 'Name', w: 42 },
        { header: 'Type', w: 28 },
        { header: 'Dist', w: 14 },
        { header: 'Rating', w: 16 },
        { header: 'Demand', w: 16 },
        { header: 'Popularity', w: 22 },
        { header: 'Revenue/mo', w: 28 },
        { header: 'Score', w: 14 },
      ]

      // Table header
      doc.setFillColor(240, 240, 240)
      doc.rect(18, y - 4, pageW - 36, 8, 'F')
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      let x = 20
      cols.forEach((col) => { doc.text(col.header, x, y + 1); x += col.w })
      y += 8

      // Table rows
      doc.setFont('helvetica', 'normal')
      const list = filterType === 'All' ? result.competitors : result.competitors.filter((c) => c.type === filterType)
      list.forEach((c, idx) => {
        if (y > 260) { doc.addPage(); y = 20 }
        if (idx % 2 === 0) { doc.setFillColor(248, 248, 248); doc.rect(18, y - 3.5, pageW - 36, 7, 'F') }
        x = 20
        const row = [
          c.name.length > 22 ? c.name.slice(0, 20) + '…' : c.name,
          c.type,
          `${c.distance} km`,
          `${c.rating}`,
          `${c.demand}`,
          `${c.popularity}`,
          `INR ${c.monthlyRevenue.toLocaleString('en-IN')}`,
          `${c.progressScore}`,
        ]
        row.forEach((val, ci) => { doc.text(String(val), x, y + 1); x += cols[ci].w })
        y += 7
      })
      y += 8

      // Competitor details (strengths/weaknesses)
      if (y > 220) { doc.addPage(); y = 20 }
      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.text('Competitor Strengths & Weaknesses', 20, y)
      y += 8
      doc.setFontSize(9)
      list.forEach((c) => {
        if (y > 250) { doc.addPage(); y = 20 }
        doc.setFont('helvetica', 'bold')
        doc.text(`${c.name} (${c.type})`, 20, y)
        y += 5
        doc.setFont('helvetica', 'normal')
        doc.text(`Strengths: ${c.strengths.join(', ')}`, 24, y, { maxWidth: pageW - 48 })
        y += 5
        doc.text(`Weaknesses: ${c.weaknesses.join(', ')}`, 24, y, { maxWidth: pageW - 48 })
        y += 5
        doc.text(`Specialties: ${c.specialties.join(', ')}`, 24, y, { maxWidth: pageW - 48 })
        y += 8
      })

      // Recommendations
      if (y > 220) { doc.addPage(); y = 20 }
      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.text('Recommendations', 20, y)
      y += 8
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      result.recommendations.forEach((rec, i) => {
        if (y > 265) { doc.addPage(); y = 20 }
        doc.text(`${i + 1}. ${rec}`, 20, y, { maxWidth: pageW - 40 })
        y += 7
      })

      // Footer
      const pages = doc.getNumberOfPages()
      for (let p = 1; p <= pages; p++) {
        doc.setPage(p)
        doc.setFontSize(7)
        doc.setTextColor(150)
        doc.text(`BizNex Competitor Report · Page ${p} of ${pages}`, pageW / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' })
      }

      doc.save(`competitor-report-${businessType.replace(/\s+/g, '-').toLowerCase()}-${location.replace(/\s+/g, '-').toLowerCase()}.pdf`)
    } finally {
      setDownloading(false)
    }
  }, [result, filterType, businessType, location])

  async function handleSearch() {
    const type = businessType || business?.businessType || ''
    const loc = location || business?.location || ''
    if (!type || !loc) return
    setLoading(true)
    try {
      const data = await findNearbyBusinesses({
        businessType: type,
        location: loc,
        radius: Number(radius || business?.radius || 10),
      })
      setResult(data)
      setSelectedCompetitor(null)
      setFilterType('All')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const mapCenter: [number, number] = result
    ? [result.userBusiness.lat, result.userBusiness.lng]
    : [14.68, 77.59]

  const availableTypes = useMemo(() => {
    if (!result) return []
    const types = Array.from(new Set(result.competitors.map((c) => c.type)))
    return ['All', ...types]
  }, [result])

  const filteredCompetitors = useMemo(() => {
    if (!result) return []
    if (filterType === 'All') return result.competitors
    return result.competitors.filter((c) => c.type === filterType)
  }, [result, filterType])

  const filteredPopularityComparison = useMemo(() => {
    if (!result) return []
    const filtered = filteredCompetitors.map((c) => ({ name: c.name, score: c.popularity }))
    return [{ name: 'Your Business', score: result.userBusiness.popularity }, ...filtered]
  }, [result, filteredCompetitors])

  // Clear selection if filtered out
  const visibleSelected = useMemo(() => {
    if (!selectedCompetitor) return null
    return filteredCompetitors.find((c) => c.name === selectedCompetitor.name) ?? null
  }, [selectedCompetitor, filteredCompetitors])

  const filteredRadarData = useMemo(() => {
    return filteredCompetitors.slice(0, 5).map((c) => ({
      subject: c.name.split(' ')[0],
      popularity: c.popularity,
      demand: c.demand,
      progress: c.progressScore,
      fullMark: 100,
    }))
  }, [filteredCompetitors])

  const radarData = result
    ? result.competitors.slice(0, 5).map((c) => ({
        subject: c.name.split(' ')[0],
        popularity: c.popularity,
        demand: c.demand,
        progress: c.progressScore,
        fullMark: 100,
      }))
    : []

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <ScrollReveal>
        <div>
          <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>Nearby Competitors</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Discover similar businesses, compare demand & popularity, and find your edge
          </p>
        </div>
      </ScrollReveal>
      {result && (
        <div className="flex justify-end">
          <Button variant="secondary" onClick={downloadReport} loading={downloading}>
            <Download size={16} />
            Download PDF
          </Button>
        </div>
      )}

      {/* Edit Toggle */}
      <div className="flex justify-end">
        <button onClick={() => setShowEdit(!showEdit)} className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          style={{ color: 'var(--text-muted)' }}>
          <Edit3 size={12} />{showEdit ? 'Hide' : 'Edit Details'}{showEdit ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>
      <AnimatePresence>
        {showEdit && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <Card className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input label="Business Type" value={businessType} onChange={(e) => setBusinessType(e.target.value)} icon={<Store size={18} />} />
                <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} icon={<MapPin size={18} />} />
                <Input label="Search Radius (km)" type="number" value={radius} onChange={(e) => setRadius(e.target.value)} icon={<Target size={18} />} />
              </div>
              <div className="mt-4">
                <Button onClick={() => { setShowEdit(false); handleSearch() }} loading={loading}>
                  <Store size={18} />Refresh Competitors
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && (
        <Card className="p-10 text-center">
          <Loader2 size={36} className="animate-spin mx-auto mb-3" style={{ color: 'var(--accent-bright)' }} />
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Scanning Nearby Businesses...</h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Analyzing competitors and market data in your area.</p>
        </Card>
      )}

      {/* Results */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Store, label: filterType === 'All' ? 'Competitors' : `${filterType} Count`, value: filteredCompetitors.length },
              { icon: TrendingUp, label: 'Avg Demand', value: `${result.marketSummary.averageDemand}%` },
              { icon: Users, label: 'Avg Popularity', value: `${result.marketSummary.averagePopularity}%` },
              { icon: BarChart3, label: 'Saturation', value: result.marketSummary.marketSaturation },
              { icon: Star, label: 'Your Score', value: `${result.userBusiness.progressScore}/100` },
            ].map((m, i) => (
              <div key={i} className="card p-3 text-center">
                <m.icon size={18} className="mx-auto mb-1.5" style={{ color: 'var(--accent-bright)' }} />
                <p className="text-[11px] font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>{m.label}</p>
                <p className="text-base font-bold" style={{ color: 'var(--accent-bright)' }}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Type Filter */}
          {availableTypes.length > 2 && (
            <ScrollReveal delay={0.15}>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Filter size={14} className="shrink-0" style={{ color: 'var(--text-muted)' }} />
                <span className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>Filter by type:</span>
                {availableTypes.map((type) => {
                  const active = filterType === type
                  const mc = type === 'All' ? null : getMarkerColor(type)
                  return (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className="relative px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-150"
                      style={{
                        background: active ? 'var(--accent-dim)' : 'transparent',
                        color: active ? 'var(--accent-bright)' : 'var(--text-muted)',
                        border: `1px solid ${active ? 'var(--accent-bright)' : 'transparent'}`,
                      }}
                    >
                      <span className="flex items-center gap-1.5">
                        {mc && (
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ background: mc.bg }}
                          />
                        )}
                        {type}
                        {active && type !== 'All' && (
                          <X size={12} className="ml-0.5 opacity-60" />
                        )}
                      </span>
                    </button>
                  )
                })}
                {filterType !== 'All' && (
                  <button
                    onClick={() => setFilterType('All')}
                    className="px-2 py-1 rounded-full text-xs text-moss-400 hover:bg-moss-400/10 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </ScrollReveal>
          )}

          {/* Map + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leaflet Map */}
            <Card className="lg:col-span-2 p-0 overflow-hidden" hover={false}>
              <div className="p-4 pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <MapPin size={16} style={{ color: 'var(--accent-bright)' }} />
                  Competitor Map
                </h3>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Click markers for details — green star is you</p>
              </div>
              <div className="h-[420px] relative">
                <MapContainer
                  center={mapCenter}
                  zoom={13}
                  scrollWheelZoom={true}
                  className="h-full w-full"
                  style={{ background: '#141414' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  />
                  <FlyTo center={mapCenter} />

                  {/* User marker */}
                  <Marker
                    position={[result.userBusiness.lat, result.userBusiness.lng]}
                    icon={userIcon()}
                  >
                    <Popup>
                      <div style={{ color: '#141414', fontFamily: 'Inter, sans-serif', minWidth: 160 }}>
                        <strong style={{ fontSize: 14 }}>★ {result.userBusiness.name}</strong>
                        <br />
                        <span style={{ fontSize: 12 }}>Your Business</span>
                        <br />
                        <span style={{ fontSize: 12 }}>
                          Demand: {result.userBusiness.demand}/100 · Pop: {result.userBusiness.popularity}/100
                        </span>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Competitor markers */}
                  {filteredCompetitors.map((c, i) => (
                    <Marker
                      key={c.name}
                      position={[c.lat, c.lng]}
                      icon={competitorIcon(c.type)}
                      eventHandlers={{
                        click: () => setSelectedCompetitor(c),
                      }}
                    >
                      <Popup>
                        <div style={{ color: '#141414', fontFamily: 'Inter, sans-serif', minWidth: 170 }}>
                          <strong style={{ fontSize: 14 }}>{c.name}</strong>
                          <br />
                          <span style={{ fontSize: 12, color: '#6b7280' }}>{c.type} · {c.distance} km away</span>
                          <br />
                          <span style={{ fontSize: 12 }}>
                            ★ {c.rating} · Demand: {c.demand} · Pop: {c.popularity}
                          </span>
                          <br />
                          <span style={{ fontSize: 12 }}>
                            Revenue: ₹{c.monthlyRevenue.toLocaleString('en-IN')}/mo
                          </span>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </Card>

            {/* Competitor List Sidebar */}
            <Card className="p-3 overflow-y-auto max-h-[480px]" hover={false}>
              <h3 className="text-xs font-semibold mb-2.5 flex items-center justify-between" style={{ color: 'var(--text-primary)' }}>
                <span>Nearby Businesses</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
                  {filteredCompetitors.length}
                </span>
              </h3>
              <div className="space-y-1.5">
                {filteredCompetitors.length === 0 && (
                  <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>No businesses match this filter.</p>
                )}
                {filteredCompetitors.map((c, i) => {
                  const mc = getMarkerColor(c.type)
                  const isSelected = selectedCompetitor?.name === c.name
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedCompetitor(c)}
                      className="w-full text-left p-2.5 rounded-lg transition-all duration-150"
                      style={{
                        background: isSelected ? 'var(--accent-dim)' : 'transparent',
                        border: isSelected ? '1px solid var(--accent-bright)' : '1px solid transparent',
                      }}
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: `${mc.bg}20` }}
                        >
                          <span className="text-[10px] font-bold" style={{ color: mc.bg }}>
                            {mc.label[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{c.name}</p>
                          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                            {c.type} · {c.distance} km · ★ {c.rating}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                              D: <span className="font-medium" style={{ color: 'var(--success)' }}>{c.demand}</span>
                            </span>
                            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                              P: <span className="font-medium" style={{ color: 'var(--info)' }}>{c.popularity}</span>
                            </span>
                            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                              ₹{(c.monthlyRevenue / 1000).toFixed(0)}k
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Selected Competitor Detail */}
          {visibleSelected && (
            <ScrollReveal>
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{visibleSelected.name}</h3>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {visibleSelected.type} · Est. {visibleSelected.established} · {visibleSelected.distance} km away
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold" style={{ color: 'var(--accent-bright)' }}>★ {visibleSelected.rating}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Rating</p>
                  </div>
                </div>

                {/* Score bars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-3">
                    <ScoreBar label="Demand" value={visibleSelected.demand} color="#22c55e" />
                    <ScoreBar label="Popularity" value={visibleSelected.popularity} color="#3b82f6" />
                    <ScoreBar label="Progress" value={visibleSelected.progressScore} color="#8b5cf6" />
                  </div>
                  <div className="space-y-3">
                    <ScoreBar label="Your Demand" value={result.userBusiness.demand} color="#22c55e80" />
                    <ScoreBar label="Your Popularity" value={result.userBusiness.popularity} color="#3b82f680" />
                    <ScoreBar label="Your Progress" value={result.userBusiness.progressScore} color="#8b5cf680" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-green-400">
                      ₹{visibleSelected.monthlyRevenue.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      vs your ₹{result.userBusiness.monthlyRevenue.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Strengths / Weaknesses / Specialties */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
                    <h4 className="text-xs font-semibold mb-1.5" style={{ color: 'var(--success)' }}>Strengths</h4>
                    <ul className="space-y-0.5">
                      {visibleSelected.strengths.map((s, i) => (
                        <li key={i} className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                    <h4 className="text-xs font-semibold mb-1.5" style={{ color: 'var(--danger)' }}>Weaknesses</h4>
                    <ul className="space-y-0.5">
                      {visibleSelected.weaknesses.map((w, i) => (
                        <li key={i} className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>• {w}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                    <h4 className="text-xs font-semibold mb-1.5" style={{ color: 'var(--accent-bright)' }}>Specialties</h4>
                    <div className="flex flex-wrap gap-1">
                      {visibleSelected.specialties.map((s, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-md"
                          style={{ background: 'var(--accent-dim)', color: 'var(--accent-bright)' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </ScrollReveal>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Demand Trend */}
            <Card>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <TrendingUp size={16} style={{ color: 'var(--accent-bright)' }} />
                Market Demand Trend
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={result.demandTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} />
                  <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: '8px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="demand" stroke="var(--accent-bright)" strokeWidth={2} dot={{ fill: 'var(--accent-bright)', r: 3 }} activeDot={{ r: 5, fill: 'var(--accent-bright)' }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Popularity Comparison */}
            <Card>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <BarChart3 size={16} style={{ color: 'var(--info)' }} />
                Popularity Comparison
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={filteredPopularityComparison} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" stroke="var(--text-muted)" fontSize={11} domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" stroke="var(--text-muted)" fontSize={10} width={90}
                    tickFormatter={(v: string) => (v.length > 12 ? v.slice(0, 10) + '…' : v)} />
                  <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="score" radius={[0, 3, 3, 0]}>
                    {filteredPopularityComparison.map((entry, i) => (
                      <motion.rect key={i} fill={entry.name === 'Your Business' ? 'var(--accent-bright)' : 'var(--info)'} opacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Radar Chart */}
          {filteredRadarData.length > 0 && (
            <Card>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Target size={16} style={{ color: 'var(--accent-bright)' }} />
                Competitor Radar Overview
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={filteredRadarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="subject" stroke="var(--text-muted)" fontSize={11} />
                  <PolarRadiusAxis stroke="var(--border-strong)" fontSize={10} domain={[0, 100]} />
                  <Radar name="Popularity" dataKey="popularity" stroke="var(--info)" fill="var(--info)" fillOpacity={0.12} />
                  <Radar name="Demand" dataKey="demand" stroke="var(--accent-bright)" fill="var(--accent-bright)" fillOpacity={0.12} />
                  <Radar name="Progress" dataKey="progress" stroke="var(--warning)" fill="var(--warning)" fillOpacity={0.12} />
                  <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: '8px', fontSize: '12px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          )}

          {/* Market Summary & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Market Summary</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Market Saturation</span>
                  <span className="text-xs font-semibold" style={{
                    color: result.marketSummary.marketSaturation === 'Low' ? 'var(--success)' :
                    result.marketSummary.marketSaturation === 'Medium' ? 'var(--warning)' : 'var(--danger)'
                  }}>{result.marketSummary.marketSaturation}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Threat Level</span>
                  <span className="text-xs font-semibold" style={{
                    color: result.marketSummary.threatLevel === 'Low' ? 'var(--success)' :
                    result.marketSummary.threatLevel === 'Medium' ? 'var(--warning)' : 'var(--danger)'
                  }}>{result.marketSummary.threatLevel}</span>
                </div>
                <div className="p-2.5 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
                  <p className="text-[10px] font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>Best Opportunity</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{result.marketSummary.bestOpportunity}</p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Recommendations</h3>
              <ul className="space-y-1.5">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 p-1.5 rounded-lg">
                    <span className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: 'var(--accent-dim)' }}>
                      <span className="text-[10px] font-bold" style={{ color: 'var(--accent-bright)' }}>{i + 1}</span>
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

        </motion.div>
      )}
    </div>
  )
}
