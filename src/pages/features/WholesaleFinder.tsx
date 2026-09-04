import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import {
  Package, MapPin, Loader2, IndianRupee, ExternalLink,
  Edit3, ChevronUp, ChevronDown, Phone, Navigation, AlertCircle,
} from 'lucide-react'
import { useBusiness } from '../../contexts/BusinessContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import {
  calculateSourcingPlan, findNearbySuppliers, getSupplierCategories,
  type MaterialRequirement, type SupplierResult,
} from '../../lib/wholesale-data'

export default function WholesaleFinder() {
  const { business } = useBusiness()
  const { t } = useTranslation()
  const [budget, setBudget] = useState(business?.investmentAmount ? String(business.investmentAmount) : '')
  const [loading, setLoading] = useState(false)
  const [suppliers, setSuppliers] = useState<SupplierResult[]>([])
  const [showEdit, setShowEdit] = useState(false)

  const sourcingPlan = business ? calculateSourcingPlan(
    business.businessType,
    Number(budget || business.investmentAmount || 100000)
  ) : null

  useEffect(() => {
    if (business && !suppliers.length && !loading) handleSearch()
  }, [])

  async function handleSearch() {
    if (!business?.locationData?.lat || !business?.locationData?.lng) return
    setLoading(true)
    try {
      const categories = getSupplierCategories(business.businessType)
      const results = await findNearbySuppliers(
        business.locationData.lat,
        business.locationData.lng,
        business.radius || 10,
        categories
      )
      setSuppliers(results)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
          Find Wholesale & Suppliers
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Know where to buy materials for your {business?.businessType || 'business'}
        </p>
      </div>

      {/* Budget Input */}
      <div className="flex justify-end">
        <button onClick={() => setShowEdit(!showEdit)} className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          style={{ color: 'var(--text-muted)' }}>
          <Edit3 size={12} />{showEdit ? 'Hide' : 'Change Budget'}{showEdit ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>
      <AnimatePresence>
        {showEdit && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <Card className="p-5">
              <Input label="Your Available Budget (₹)" type="number" value={budget}
                onChange={(e) => setBudget(e.target.value)} icon={<IndianRupee size={16} />} />
              <p className="text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>
                This helps us suggest how much to spend on initial stock and equipment.
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sourcing Plan */}
      {sourcingPlan && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* Budget Breakdown */}
          <div className="card p-5" style={{ background: 'var(--accent-dim)', border: '1px solid var(--border)' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--accent-bright)' }}>
              💰 Where Should Your Money Go?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-card)' }}>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>TOTAL BUDGET</p>
                <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  ₹{Number(budget || business?.investmentAmount || 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-card)' }}>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>INITIAL STOCK</p>
                <p className="text-lg font-bold" style={{ color: 'var(--accent-bright)' }}>
                  ₹{sourcingPlan.totalEstimatedMin.toLocaleString('en-IN')} – ₹{sourcingPlan.totalEstimatedMax.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-card)' }}>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>EQUIPMENT</p>
                <p className="text-lg font-bold" style={{ color: 'var(--info)' }}>
                  Included above
                </p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ background: 'var(--bg-card)' }}>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>ITEMS</p>
                <p className="text-lg font-bold" style={{ color: 'var(--accent-bright)' }}>
                  {sourcingPlan.materials.length}
                </p>
              </div>
            </div>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              ⓘ Cost estimates are based on industry benchmarks for rural India. Actual prices may vary.
            </p>
          </div>

          {/* Material List */}
          <Card>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              📦 What You'll Need to Buy
            </h3>
            <div className="space-y-2">
              {sourcingPlan.materials.map((material, i) => (
                <MaterialRow key={i} material={material} index={i} />
              ))}
            </div>
          </Card>

          {/* Recommendations */}
          <Card>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              💡 Sourcing Tips
            </h3>
            <div className="space-y-2">
              {sourcingPlan.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-xs mt-0.5" style={{ color: 'var(--accent-bright)' }}>•</span>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{rec}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Nearby Suppliers */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                📍 Nearby Wholesale & Suppliers
              </h3>
              <Button variant="ghost" size="sm" onClick={handleSearch} loading={loading}>
                <MapPin size={14} />Refresh
              </Button>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <Loader2 size={24} className="animate-spin mx-auto mb-2" style={{ color: 'var(--accent-bright)' }} />
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Searching nearby wholesale markets...</p>
              </div>
            ) : suppliers.length > 0 ? (
              <div className="space-y-2">
                {suppliers.slice(0, 8).map((supplier, i) => (
                  <SupplierRow key={i} supplier={supplier} />
                ))}
                <p className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>
                  Data source: OpenStreetMap. Results depend on available map data in your area.
                </p>
              </div>
            ) : (
              <div className="p-6 text-center">
                <AlertCircle size={24} className="mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  No nearby wholesale sources found for this category.
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  Try expanding the search radius or check local mandis and wholesale markets.
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </div>
  )
}

function MaterialRow({ material, index }: { material: MaterialRequirement; index: number }) {
  const priorityColors = {
    essential: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e', border: 'rgba(34,197,94,0.25)' },
    important: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: 'rgba(59,130,246,0.25)' },
    optional: { bg: 'var(--bg-surface)', color: 'var(--text-muted)', border: 'var(--border)' },
  }
  const pc = priorityColors[material.priority]

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--bg-surface)' }}>
      <div className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0"
        style={{ background: 'var(--accent-dim)', color: 'var(--accent-bright)' }}>
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{material.name}</p>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
            style={{ background: pc.bg, color: pc.color, border: `1px solid ${pc.border}` }}>
            {material.priority}
          </span>
        </div>
        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{material.description}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs font-bold" style={{ color: 'var(--accent-bright)' }}>
          ₹{material.estimatedCostRange[0].toLocaleString('en-IN')} – ₹{material.estimatedCostRange[1].toLocaleString('en-IN')}
        </p>
        <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>estimated</p>
      </div>
    </div>
  )
}

function SupplierRow({ supplier }: { supplier: SupplierResult }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'var(--accent-dim)' }}>
        <Package size={14} style={{ color: 'var(--accent-bright)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{supplier.name}</p>
        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
          {supplier.type} · {supplier.distance} km away
        </p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {supplier.phone && (
          <a href={`tel:${supplier.phone}`} className="p-1.5 rounded-md transition-colors"
            style={{ color: 'var(--text-muted)' }}>
            <Phone size={12} />
          </a>
        )}
        <a
          href={`https://www.openstreetmap.org/?mlat=${supplier.lat}&mlon=${supplier.lng}#map=16/${supplier.lat}/${supplier.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-md transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <Navigation size={12} />
        </a>
      </div>
    </div>
  )
}
