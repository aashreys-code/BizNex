/**
 * Wholesale & Supplier Intelligence Module
 * 
 * Maps business types to their material requirements and sourcing categories.
 * Uses Overpass API to find nearby wholesale/supplier businesses.
 * 
 * Data sources:
 * - Material categories: Industry knowledge
 * - Nearby suppliers: OpenStreetMap Overpass API (real data)
 * - Cost estimates: Industry benchmarks (clearly labeled as estimates)
 */

export interface MaterialRequirement {
  name: string
  category: string
  estimatedCostRange: [number, number] // min, max in INR
  priority: 'essential' | 'important' | 'optional'
  description: string
}

export interface SupplierResult {
  name: string
  type: string
  category: string
  lat: number
  lng: number
  distance: number
  phone?: string
  source: string
}

export interface SourcingPlan {
  materials: MaterialRequirement[]
  totalEstimatedMin: number
  totalEstimatedMax: number
  recommendations: string[]
}

// Business type → material requirements mapping
const BUSINESS_MATERIALS: Record<string, MaterialRequirement[]> = {
  'bakery': [
    { name: 'Flour (Maida/Atta)', category: 'Ingredients', estimatedCostRange: [3000, 6000], priority: 'essential', description: 'Bulk flour for bread, cookies, and pastries' },
    { name: 'Sugar & Sweeteners', category: 'Ingredients', estimatedCostRange: [1500, 3000], priority: 'essential', description: 'Sugar, jaggery, and other sweeteners' },
    { name: 'Oil & Ghee', category: 'Ingredients', estimatedCostRange: [2000, 4000], priority: 'essential', description: 'Cooking oil and ghee for baking' },
    { name: 'Baking Ingredients', category: 'Ingredients', estimatedCostRange: [1500, 3000], priority: 'essential', description: 'Yeast, baking powder, cocoa, vanilla, etc.' },
    { name: 'Packaging Materials', category: 'Packaging', estimatedCostRange: [1000, 2500], priority: 'important', description: 'Boxes, bags, wrappers, and labels' },
    { name: 'Ovens & Equipment', category: 'Equipment', estimatedCostRange: [15000, 40000], priority: 'essential', description: 'Baking oven, mixer, trays, and tools' },
    { name: 'Refrigeration', category: 'Equipment', estimatedCostRange: [10000, 25000], priority: 'important', description: 'Refrigerator or freezer for storage' },
  ],
  'dairy': [
    { name: 'Milk Collection Equipment', category: 'Equipment', estimatedCostRange: [5000, 15000], priority: 'essential', description: 'Milk cans, strainers, and testing kit' },
    { name: 'Curd & Paneer Making', category: 'Equipment', estimatedCostRange: [3000, 8000], priority: 'important', description: 'Containers, cultures, and molds' },
    { name: 'Packaging (Pouches/Bottles)', category: 'Packaging', estimatedCostRange: [1000, 3000], priority: 'essential', description: 'Milk pouches, bottles, and labels' },
    { name: 'Refrigeration', category: 'Equipment', estimatedCostRange: [15000, 35000], priority: 'essential', description: 'Cold storage for milk and products' },
    { name: 'Display & Serving', category: 'Equipment', estimatedCostRange: [5000, 12000], priority: 'important', description: 'Display fridge, serving containers' },
  ],
  'tailoring': [
    { name: 'Fabric (Cotton/Silk/Blend)', category: 'Raw Material', estimatedCostRange: [5000, 15000], priority: 'essential', description: 'Bulk fabric rolls for stitching' },
    { name: 'Thread & Buttons', category: 'Raw Material', estimatedCostRange: [1000, 3000], priority: 'essential', description: 'Sewing thread, buttons, zippers, and needles' },
    { name: 'Sewing Machine', category: 'Equipment', estimatedCostRange: [8000, 25000], priority: 'essential', description: 'Manual or electric sewing machine' },
    { name: 'Cutting & Measuring Tools', category: 'Equipment', estimatedCostRange: [1000, 3000], priority: 'important', description: 'Scissors, measuring tape, chalk, and rulers' },
    { name: 'Iron & Finishing', category: 'Equipment', estimatedCostRange: [2000, 5000], priority: 'important', description: 'Iron box and pressing table' },
  ],
  'grocery': [
    { name: 'Rice & Pulses', category: 'Inventory', estimatedCostRange: [10000, 25000], priority: 'essential', description: 'Bulk rice, dal, and pulses' },
    { name: 'Oil & Spices', category: 'Inventory', estimatedCostRange: [5000, 12000], priority: 'essential', description: 'Cooking oil, masala, and spices' },
    { name: 'FMCG Products', category: 'Inventory', estimatedCostRange: [8000, 20000], priority: 'essential', description: 'Soap, shampoo, toothpaste, and daily essentials' },
    { name: 'Shelving & Display', category: 'Equipment', estimatedCostRange: [5000, 15000], priority: 'important', description: 'Racks, shelves, and display units' },
    { name: 'Billing System', category: 'Equipment', estimatedCostRange: [2000, 8000], priority: 'important', description: 'Cash register or billing software' },
  ],
  'mobile': [
    { name: 'Spare Parts & Tools', category: 'Inventory', estimatedCostRange: [10000, 30000], priority: 'essential', description: 'Screen replacements, batteries, and repair tools' },
    { name: 'Testing Equipment', category: 'Equipment', estimatedCostRange: [3000, 8000], priority: 'important', description: 'Multimeter, screwdriver sets, and diagnostic tools' },
    { name: 'Accessories Stock', category: 'Inventory', estimatedCostRange: [5000, 15000], priority: 'important', description: 'Cases, chargers, earphones, and screen guards' },
    { name: 'Workbench Setup', category: 'Equipment', estimatedCostRange: [3000, 8000], priority: 'important', description: 'Work table, anti-static mat, and storage' },
  ],
  'food': [
    { name: 'Raw Ingredients', category: 'Inventory', estimatedCostRange: [5000, 15000], priority: 'essential', description: 'Rice, vegetables, spices, and cooking essentials' },
    { name: 'Cooking Equipment', category: 'Equipment', estimatedCostRange: [10000, 30000], priority: 'essential', description: 'Stove, utensils, pots, and pans' },
    { name: 'Serving & Storage', category: 'Equipment', estimatedCostRange: [3000, 8000], priority: 'important', description: 'Plates, glasses, containers, and storage' },
    { name: 'Packaging', category: 'Packaging', estimatedCostRange: [1000, 3000], priority: 'important', description: 'Takeaway boxes, bags, and tissues' },
  ],
  'fertilizer': [
    { name: 'Fertilizer Stock', category: 'Inventory', estimatedCostRange: [20000, 50000], priority: 'essential', description: 'Urea, DAP, potash, and organic fertilizers' },
    { name: 'Seeds & Pesticides', category: 'Inventory', estimatedCostRange: [10000, 25000], priority: 'essential', description: 'Hybrid seeds, pesticides, and herbicides' },
    { name: 'Storage Racks', category: 'Equipment', estimatedCostRange: [5000, 12000], priority: 'important', description: 'Heavy-duty shelving for chemical storage' },
    { name: 'Weighing Scale', category: 'Equipment', estimatedCostRange: [2000, 5000], priority: 'important', description: 'Digital or manual weighing scale' },
  ],
  'hardware': [
    { name: 'Hardware Stock', category: 'Inventory', estimatedCostRange: [15000, 40000], priority: 'essential', description: 'Nails, screws, pipes, fittings, and tools' },
    { name: 'Paint & Chemicals', category: 'Inventory', estimatedCostRange: [10000, 25000], priority: 'important', description: 'Paints, adhesives, and solvents' },
    { name: 'Display & Storage', category: 'Equipment', estimatedCostRange: [8000, 20000], priority: 'important', description: 'Shelving, bins, and display racks' },
  ],
  'beauty': [
    { name: 'Beauty Products', category: 'Inventory', estimatedCostRange: [8000, 20000], priority: 'essential', description: 'Hair color, face products, and cosmetics' },
    { name: 'Tools & Equipment', category: 'Equipment', estimatedCostRange: [5000, 15000], priority: 'essential', description: 'Hair dryer, styling tools, and chairs' },
    { name: 'Furniture & Setup', category: 'Equipment', estimatedCostRange: [10000, 25000], priority: 'important', description: 'Chairs, mirrors, wash basin, and lighting' },
  ],
  'general': [
    { name: 'Initial Inventory', category: 'Inventory', estimatedCostRange: [10000, 30000], priority: 'essential', description: 'Core products for your store' },
    { name: 'Shelving & Display', category: 'Equipment', estimatedCostRange: [5000, 15000], priority: 'important', description: 'Racks, counters, and display units' },
    { name: 'Billing & POS', category: 'Equipment', estimatedCostRange: [2000, 8000], priority: 'important', description: 'Cash register or billing software' },
  ],
}

// Wholesale/supplier category mapping for Overpass queries
const SUPPLIER_OVERRPASS_TAGS: Record<string, string[]> = {
  'Ingredients': ['wholesale', 'supermarket', 'convenience'],
  'Packaging': ['wholesale', 'paper', 'plastic'],
  'Equipment': ['hardware', 'electronics', 'computer'],
  'Raw Material': ['wholesale', 'textile', 'fabric'],
  'Inventory': ['wholesale', 'supermarket', 'convenience'],
}

/**
 * Get material requirements for a business type
 */
export function getMaterialRequirements(businessType: string): MaterialRequirement[] {
  const key = businessType.toLowerCase()
  
  // Try exact match first
  for (const [k, v] of Object.entries(BUSINESS_MATERIALS)) {
    if (key.includes(k)) return v
  }
  
  // Fallback to general
  return BUSINESS_MATERIALS['general']
}

/**
 * Calculate sourcing plan based on budget
 */
export function calculateSourcingPlan(
  businessType: string,
  totalBudget: number
): SourcingPlan {
  const materials = getMaterialRequirements(businessType)
  
  // Scale material costs proportionally to budget
  const totalMaterialsCost = materials.reduce((sum, m) => sum + m.estimatedCostRange[1], 0)
  const scaleFactor = totalBudget > 0 ? Math.min(1, totalBudget * 0.4 / totalMaterialsCost) : 0.5

  const scaledMaterials = materials.map(m => ({
    ...m,
    estimatedCostRange: [
      Math.round(m.estimatedCostRange[0] * scaleFactor),
      Math.round(m.estimatedCostRange[1] * scaleFactor),
    ] as [number, number],
  }))

  const totalMin = scaledMaterials.reduce((sum, m) => sum + m.estimatedCostRange[0], 0)
  const totalMax = scaledMaterials.reduce((sum, m) => sum + m.estimatedCostRange[1], 0)

  const recommendations: string[] = []
  
  if (totalBudget < totalMax * 0.5) {
    recommendations.push('Your budget may be tight for initial stock. Consider starting with essential items only and scaling up.')
  }
  recommendations.push('Visit local wholesale markets (mandis) for better bulk prices.')
  recommendations.push('Compare prices from at least 2-3 suppliers before purchasing.')
  recommendations.push('Build relationships with suppliers for credit terms and better rates.')

  return {
    materials: scaledMaterials,
    totalEstimatedMin: totalMin,
    totalEstimatedMax: totalMax,
    recommendations,
  }
}

/**
 * Search for nearby wholesale/supplier businesses using Overpass API
 */
export async function findNearbySuppliers(
  lat: number,
  lng: number,
  radiusKm: number = 10,
  categories: string[] = ['wholesale', 'supermarket']
): Promise<SupplierResult[]> {
  const radiusMeters = radiusKm * 1000
  const tags = categories.join('|')
  
  const query = `
[out:json][timeout:15];
(
  node["shop"~"${tags}"](around:${radiusMeters},${lat},${lng});
  way["shop"~"${tags}"](around:${radiusMeters},${lat},${lng});
  node["amenity"~"marketplace|wholesale"](around:${radiusMeters},${lat},${lng});
);
out body;
>;
out skel qt;
`.trim()

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) return []

    const data = await response.json()
    const elements: any[] = data.elements || []

    const suppliers: SupplierResult[] = []
    const seen = new Set<string>()

    for (const el of elements) {
      if (el.type !== 'node' || !el.tags) continue

      const name = el.tags.name || el.tags['name:en'] || el.tags['name:hi'] || null
      if (!name) continue

      const key = `${name.toLowerCase()}_${Math.round(el.lat * 100)}_${Math.round(el.lon * 100)}`
      if (seen.has(key)) continue
      seen.add(key)

      // Calculate distance
      const R = 6371
      const dLat = ((el.lat - lat) * Math.PI) / 180
      const dLng = ((el.lon - lng) * Math.PI) / 180
      const a = Math.sin(dLat / 2) ** 2 +
        Math.cos((lat * Math.PI) / 180) * Math.cos((el.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2
      const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

      suppliers.push({
        name,
        type: categorizeSupplier(el.tags),
        category: el.tags.shop || el.tags.amenity || 'wholesale',
        lat: el.lat,
        lng: el.lon,
        distance: Math.round(distance * 10) / 10,
        phone: el.tags.phone || el.tags['contact:phone'] || undefined,
        source: 'OpenStreetMap',
      })
    }

    return suppliers.sort((a, b) => a.distance - b.distance)
  } catch (err) {
    console.warn('Supplier search failed:', err)
    return []
  }
}

function categorizeSupplier(tags: Record<string, string>): string {
  if (tags.shop === 'wholesale') return 'Wholesale'
  if (tags.shop === 'supermarket') return 'Retail/Wholesale'
  if (tags.amenity === 'marketplace') return 'Market'
  if (tags.shop) return 'Retail'
  return 'Supplier'
}

/**
 * Get supplier categories for a business type
 */
export function getSupplierCategories(businessType: string): string[] {
  const key = businessType.toLowerCase()
  if (key.includes('bakery') || key.includes('sweet')) return ['wholesale', 'supermarket']
  if (key.includes('dairy') || key.includes('milk')) return ['wholesale', 'supermarket']
  if (key.includes('tailor') || key.includes('cloth') || key.includes('fashion')) return ['wholesale', 'textile']
  if (key.includes('grocer') || key.includes('kirana') || key.includes('general')) return ['wholesale', 'supermarket', 'convenience']
  if (key.includes('mobile') || key.includes('phone') || key.includes('electronics')) return ['wholesale', 'electronics']
  if (key.includes('fertilizer') || key.includes('seed') || key.includes('agro')) return ['wholesale', 'garden_centre']
  if (key.includes('hardware') || key.includes('iron')) return ['wholesale', 'hardware']
  return ['wholesale', 'supermarket']
}
