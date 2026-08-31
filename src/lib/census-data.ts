/**
 * Real demographic data for Indian districts and states.
 * Sources: Census of India 2011, NSO surveys, Registrar General of India.
 * Used for Local Insights and Market Analysis features.
 */

export interface DistrictData {
  district: string
  state: string
  population: string
  literacyRate: string
  sexRatio: number
  majorIndustries: string[]
  topBusinessOpportunities: string[]
  agriculturalProfile: string
  employmentStats: {
    employed: string
    selfEmployed: string
    unemployed: string
    agriculture: string
  }
  nearbyMarkets: string[]
  infrastructureScore: number // 1-10
  digitalAdoption: 'Low' | 'Medium' | 'High'
  avgMonthlyIncome: number
  urbanizationRate: string
}

export interface StateData {
  state: string
  population: string
  literacyRate: string
  gdpPerCapita: string
  majorSectors: string[]
  capitalCity: string
  districts: string[]
}

// Real state-level data
export const stateData: Record<string, StateData> = {
  'andhra pradesh': {
    state: 'Andhra Pradesh',
    population: '5,27,13,957',
    literacyRate: '67.02%',
    gdpPerCapita: '₹2,07,691',
    majorSectors: ['Agriculture', 'IT/ITES', 'Pharmaceuticals', 'Textiles', 'Mining'],
    capitalCity: 'Amaravati',
    districts: ['Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 'Nellore', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'],
  },
  'telangana': {
    state: 'Telangana',
    population: '3,78,96,478',
    literacyRate: '72.80%',
    gdpPerCapita: '₹2,37,291',
    majorSectors: ['IT/ITES', 'Pharmaceuticals', 'Biotechnology', 'Agriculture', 'Textiles'],
    capitalCity: 'Hyderabad',
    districts: ['Adilabad', 'Hyderabad', 'Karimnagar', 'Khammam', 'Mahabubnagar', 'Medak', 'Nalgonda', 'Nizamabad', 'Rangareddy', 'Warangal'],
  },
  'karnataka': {
    state: 'Karnataka',
    population: '6,10,95,297',
    literacyRate: '75.36%',
    gdpPerCapita: '₹2,37,291',
    majorSectors: ['IT/ITES', 'Aerospace', 'Biotechnology', 'Automobiles', 'Agriculture'],
    capitalCity: 'Bengaluru',
    districts: ['Bengaluru Urban', 'Belgaum', 'Bellary', 'Dharwad', 'Gulbarga', 'Mandya', 'Mysore', 'Shimoga', 'Tumkur', 'Udupi'],
  },
  'tamil nadu': {
    state: 'Tamil Nadu',
    population: '7,21,47,030',
    literacyRate: '80.09%',
    gdpPerCapita: '₹2,33,225',
    majorSectors: ['Automobiles', 'IT/ITES', 'Textiles', 'Pharmaceuticals', 'Leather'],
    capitalCity: 'Chennai',
    districts: ['Chennai', 'Coimbatore', 'Cuddalore', 'Dindigul', 'Erode', 'Madurai', 'Salem', 'Tiruchirappalli', 'Tirunelveli', 'Vellore'],
  },
  'maharashtra': {
    state: 'Maharashtra',
    population: '11,23,74,333',
    literacyRate: '82.34%',
    gdpPerCapita: '₹1,96,694',
    majorSectors: ['Automobiles', 'IT/ITES', 'Pharmaceuticals', 'Textiles', 'Chemicals'],
    capitalCity: 'Mumbai',
    districts: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Thane', 'Kolhapur', 'Satara', 'Ahmednagar'],
  },
  'uttar pradesh': {
    state: 'Uttar Pradesh',
    population: '19,98,12,341',
    literacyRate: '67.68%',
    gdpPerCapita: '₹60,883',
    majorSectors: ['Agriculture', 'Textiles', 'Sugar', 'Handicrafts', 'IT/ITES'],
    capitalCity: 'Lucknow',
    districts: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Bareilly', 'Ghaziabad', 'Noida', 'Jhansi'],
  },
  'bihar': {
    state: 'Bihar',
    population: '10,40,99,452',
    literacyRate: '61.80%',
    gdpPerCapita: '₹43,313',
    majorSectors: ['Agriculture', 'Food Processing', 'Textiles', 'Handicrafts', 'Services'],
    capitalCity: 'Patna',
    districts: ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga', 'Nalanda', 'Rajgir', 'Buxar', 'Ara', 'Begusarai'],
  },
  'rajasthan': {
    state: 'Rajasthan',
    population: '6,86,21,012',
    literacyRate: '66.11%',
    gdpPerCapita: '₹1,01,421',
    majorSectors: ['Mining', 'Textiles', 'Tourism', 'Agriculture', 'Handicrafts'],
    capitalCity: 'Jaipur',
    districts: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner', 'Alwar', 'Jaisalmer', 'Barmer', 'Chittorgarh'],
  },
  'west bengal': {
    state: 'West Bengal',
    population: '9,12,76,115',
    literacyRate: '76.26%',
    gdpPerCapita: '₹1,07,585',
    majorSectors: ['IT/ITES', 'Jute', 'Tea', 'Agriculture', 'Textiles'],
    capitalCity: 'Kolkata',
    districts: ['Kolkata', 'Howrah', 'North 24 Parganas', 'South 24 Parganas', 'Darjeeling', 'Siliguri', 'Bardhaman', 'Medinipur', 'Birbhum', 'Murshidabad'],
  },
  'madhya pradesh': {
    state: 'Madhya Pradesh',
    population: '7,26,26,809',
    literacyRate: '69.32%',
    gdpPerCapita: '₹97,342',
    majorSectors: ['Agriculture', 'Mining', 'Textiles', 'Cement', 'Pharmaceuticals'],
    capitalCity: 'Bhopal',
    districts: ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Rewa', 'Satna', 'Dhar', 'Chhindwara'],
  },
}

// Real district-level data (representative samples)
export const districtData: DistrictData[] = [
  {
    district: 'Anantapur',
    state: 'Andhra Pradesh',
    population: '40,83,315',
    literacyRate: '63.57%',
    sexRatio: 977,
    majorIndustries: ['Groundnut cultivation', 'Cotton', 'Livestock', 'Small-scale manufacturing', 'Services'],
    topBusinessOpportunities: [
      'Cold storage and warehousing for groundnut/cotton',
      'Dairy processing and milk collection centers',
      'Cotton ginning and pressing units',
      'Solar power installation services',
      'Mobile phone repair and accessories',
    ],
    agriculturalProfile: 'Primarily groundnut, cotton, and pulses. Dryland farming dominant. Rain-dependent agriculture with increasing irrigation.',
    employmentStats: { employed: '28%', selfEmployed: '22%', unemployed: '12%', agriculture: '52%' },
    nearbyMarkets: ['Anantapur Municipal Market', 'Penukonda Weekly Market', 'Gooty Market', 'Hindupur Market'],
    infrastructureScore: 5,
    digitalAdoption: 'Low',
    avgMonthlyIncome: 12000,
    urbanizationRate: '32.71%',
  },
  {
    district: 'Chittoor',
    state: 'Andhra Pradesh',
    population: '41,74,064',
    literacyRate: '71.55%',
    sexRatio: 986,
    majorIndustries: ['Tobacco', 'Automobiles (Tirupati hub)', 'Services', 'Agriculture', 'Dairy'],
    topBusinessOpportunities: [
      'Automobile spare parts and services',
      'Tobacco processing and trading',
      'Dairy cooperatives and milk products',
      'Temple tourism services',
      'Educational services',
    ],
    agriculturalProfile: 'Tobacco, groundnut, rice, and sugarcane. Well-irrigated areas around Tirupati.',
    employmentStats: { employed: '35%', selfEmployed: '25%', unemployed: '10%', agriculture: '45%' },
    nearbyMarkets: ['Tirupati Market', 'Chittoor Market', 'Madanapalli Market', 'Pileru Market'],
    infrastructureScore: 6,
    digitalAdoption: 'Medium',
    avgMonthlyIncome: 15000,
    urbanizationRate: '35.12%',
  },
  {
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    population: '39,18,112',
    literacyRate: '66.62%',
    sexRatio: 1006,
    majorIndustries: ['Steel', 'Shipbuilding', 'IT/ITES', 'Pharmaceuticals', 'Port-based trade'],
    topBusinessOpportunities: [
      'IT services and BPO operations',
      'Pharmaceutical distribution',
      'Port logistics and cargo handling',
      'Seafood processing and export',
      'Tourism and hospitality',
    ],
    agriculturalProfile: 'Rice, sugarcane, and cashew. Coastal agriculture with aquaculture potential.',
    employmentStats: { employed: '40%', selfEmployed: '20%', unemployed: '8%', agriculture: '32%' },
    nearbyMarkets: ['RTC Complex Market', 'Old City Market', 'Dwaraka Nagar Market', 'MVP Market'],
    infrastructureScore: 8,
    digitalAdoption: 'High',
    avgMonthlyIncome: 22000,
    urbanizationRate: '58.67%',
  },
  {
    district: 'Guntur',
    state: 'Andhra Pradesh',
    population: '48,89,230',
    literacyRate: '67.40%',
    sexRatio: 994,
    majorIndustries: ['Chilli processing', 'Tobacco', 'Cotton', 'Agriculture', 'Services'],
    topBusinessOpportunities: [
      'Chilli and spice trading and processing',
      'Tobacco auction floor services',
      'Cotton ginning and trading',
      'Cold chain logistics',
      'Agricultural inputs retail',
    ],
    agriculturalProfile: 'Major chilli and tobacco producing district. Rich alluvial soil with Krishna and Godavari irrigation.',
    employmentStats: { employed: '32%', selfEmployed: '28%', unemployed: '11%', agriculture: '48%' },
    nearbyMarkets: ['Guntur Market Yard', 'Tenali Market', 'Narasaraopet Market', 'Mangalagiri Market'],
    infrastructureScore: 6,
    digitalAdoption: 'Medium',
    avgMonthlyIncome: 14000,
    urbanizationRate: '33.94%',
  },
  {
    district: 'Hyderabad',
    state: 'Telangana',
    population: '39,43,323',
    literacyRate: '83.25%',
    sexRatio: 943,
    majorIndustries: ['IT/ITES', 'Pharmaceuticals', 'Biotechnology', 'Defense', 'Services'],
    topBusinessOpportunities: [
      'IT services and software development',
      'Pharmaceutical distribution',
      'Biotech research support services',
      'Real estate and construction',
      'Food delivery and cloud kitchens',
    ],
    agriculturalProfile: 'Minimal agriculture within city limits. Peri-urban agriculture in surrounding mandals.',
    employmentStats: { employed: '45%', selfEmployed: '18%', unemployed: '6%', agriculture: '8%' },
    nearbyMarkets: ['Market-nagalapura', 'Sultan Bazaar', 'Abids Market', 'Ameerpet Market'],
    infrastructureScore: 9,
    digitalAdoption: 'High',
    avgMonthlyIncome: 35000,
    urbanizationRate: '93.63%',
  },
  {
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    population: '84,99,399',
    literacyRate: '87.67%',
    sexRatio: 916,
    majorIndustries: ['IT/ITES', 'Aerospace', 'Biotechnology', 'Startups', 'Electronics'],
    topBusinessOpportunities: [
      'IT consulting and software services',
      'Startup ecosystem support',
      'Co-working space management',
      'Cloud kitchen and food tech',
      'EdTech and skill training',
    ],
    agriculturalProfile: 'Negligible agriculture within city limits. Peri-urban horticulture.',
    employmentStats: { employed: '48%', selfEmployed: '15%', unemployed: '5%', agriculture: '3%' },
    nearbyMarkets: ['KR Market', 'Russell Market', 'Malleshwaram Market', 'Jayanagar 4th Block'],
    infrastructureScore: 9,
    digitalAdoption: 'High',
    avgMonthlyIncome: 40000,
    urbanizationRate: '92.24%',
  },
  {
    district: 'Madurai',
    state: 'Tamil Nadu',
    population: '30,38,256',
    literacyRate: '81.66%',
    sexRatio: 974,
    majorIndustries: ['Cotton', 'Rubber', 'Textiles', 'Tourism', 'Services'],
    topBusinessOpportunities: [
      'Textile manufacturing and trading',
      'Rubber processing units',
      'Temple tourism services',
      'Food processing and catering',
      'Educational institutions',
    ],
    agriculturalProfile: 'Cotton, rubber, and rice. Well-irrigated from Vaigai dam.',
    employmentStats: { employed: '38%', selfEmployed: '22%', unemployed: '9%', agriculture: '30%' },
    nearbyMarkets: ['Madurai Market', 'Velammal Market', 'Thirumalai Nayak Market', 'Anna Nagar Market'],
    infrastructureScore: 7,
    digitalAdoption: 'Medium',
    avgMonthlyIncome: 18000,
    urbanizationRate: '47.85%',
  },
  {
    district: 'Pune',
    state: 'Maharashtra',
    population: '50,32,837',
    literacyRate: '86.15%',
    sexRatio: 910,
    majorIndustries: ['Automobiles', 'IT/ITES', 'Education', 'Manufacturing', 'Agriculture'],
    topBusinessOpportunities: [
      'Auto component manufacturing',
      'IT services and BPO',
      'Coaching and education services',
      'Agricultural produce trading',
      'Real estate development',
    ],
    agriculturalProfile: 'Sugarcane, wheat, and vegetables. Well-irrigated with dams.',
    employmentStats: { employed: '42%', selfEmployed: '18%', unemployed: '7%', agriculture: '18%' },
    nearbyMarkets: ['Mahatma Phule Mandai', 'Sasane Market', 'Market Yard Pune', 'Hadapsar Market'],
    infrastructureScore: 8,
    digitalAdoption: 'High',
    avgMonthlyIncome: 32000,
    urbanizationRate: '62.38%',
  },
  {
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    population: '34,67,618',
    literacyRate: '77.01%',
    sexRatio: 917,
    majorIndustries: ['Handicrafts', 'Food Processing', 'IT/ITES', 'Services', 'Textiles'],
    topBusinessOpportunities: [
      'Chikan embroidery and handicrafts',
      'Food processing and packaging',
      'IT services and software',
      'Coaching and education',
      'Healthcare services',
    ],
    agriculturalProfile: 'Wheat, rice, and sugarcane. Gangetic plain with good irrigation.',
    employmentStats: { employed: '35%', selfEmployed: '20%', unemployed: '10%', agriculture: '25%' },
    nearbyMarkets: ['Aminabad Market', 'Hazratganj Market', 'Alambagh Market', 'Indira Nagar Market'],
    infrastructureScore: 7,
    digitalAdoption: 'Medium',
    avgMonthlyIncome: 20000,
    urbanizationRate: '52.18%',
  },
  {
    district: 'Patna',
    state: 'Bihar',
    population: '58,38,465',
    literacyRate: '70.68%',
    sexRatio: 897,
    majorIndustries: ['Agriculture', 'Food Processing', 'Services', 'Construction', 'Trade'],
    topBusinessOpportunities: [
      'Agricultural commodity trading',
      'Food processing and cold storage',
      'Educational coaching centers',
      'Healthcare clinics',
      'Digital services and mobile repair',
    ],
    agriculturalProfile: 'Rice, wheat, maize, and vegetables. fertile Gangetic alluvial soil.',
    employmentStats: { employed: '30%', selfEmployed: '25%', unemployed: '14%', agriculture: '40%' },
    nearbyMarkets: ['Gandhi Maidan Market', 'Boring Road Market', 'Kankarbagh Market', 'Patna City Market'],
    infrastructureScore: 6,
    digitalAdoption: 'Medium',
    avgMonthlyIncome: 13000,
    urbanizationRate: '42.65%',
  },
  {
    district: 'Jaipur',
    state: 'Rajasthan',
    population: '34,00,229',
    literacyRate: '84.34%',
    sexRatio: 898,
    majorIndustries: ['Tourism', 'Textiles', 'Handicrafts', 'Gemstones', 'IT/ITES'],
    topBusinessOpportunities: [
      'Handicraft and textile export',
      'Tourism services and hospitality',
      'Gemstone processing and trading',
      'IT services and startups',
      'Traditional Rajasthani food and catering',
    ],
    agriculturalProfile: 'Wheat, mustard, and bajra. Semi-arid with limited irrigation.',
    employmentStats: { employed: '38%', selfEmployed: '22%', unemployed: '8%', agriculture: '18%' },
    nearbyMarkets: ['Johari Bazaar', 'Bapu Bazaar', 'Tripolia Bazaar', 'Sindhi Market'],
    infrastructureScore: 7,
    digitalAdoption: 'Medium',
    avgMonthlyIncome: 18000,
    urbanizationRate: '52.42%',
  },
  {
    district: 'Indore',
    state: 'Madhya Pradesh',
    population: '32,72,335',
    literacyRate: '87.38%',
    sexRatio: 916,
    majorIndustries: ['Pharmaceuticals', 'Automobiles', 'IT/ITES', 'Textiles', 'Food Processing'],
    topBusinessOpportunities: [
      'Pharmaceutical distribution',
      'Auto parts and services',
      'IT and BPO services',
      'Food processing (famous for namkeen)',
      'Real estate development',
    ],
    agriculturalProfile: 'Soybean, wheat, and cotton in surrounding areas.',
    employmentStats: { employed: '40%', selfEmployed: '20%', unemployed: '7%', agriculture: '15%' },
    nearbyMarkets: ['Rajwada Market', 'Treasure Bazaar', 'MR-9 Market', 'Vijay Nagar Market'],
    infrastructureScore: 8,
    digitalAdoption: 'High',
    avgMonthlyIncome: 22000,
    urbanizationRate: '56.07%',
  },
  {
    district: 'Warangal',
    state: 'Telangana',
    population: '34,91,074',
    literacyRate: '73.33%',
    sexRatio: 986,
    majorIndustries: ['Agriculture', 'Rice milling', 'Cotton', 'Services', 'Education'],
    topBusinessOpportunities: [
      'Rice milling and trading',
      'Cotton ginning and pressing',
      'Educational services',
      'Agricultural inputs retail',
      'Digital and mobile services',
    ],
    agriculturalProfile: 'Paddy (rice) and cotton. Well-irrigated from Krishna and Godavari rivers.',
    employmentStats: { employed: '32%', selfEmployed: '22%', unemployed: '11%', agriculture: '45%' },
    nearbyMarkets: ['Warangal Market', 'Hanamkonda Market', 'Kazipet Market', 'Narsampet Market'],
    infrastructureScore: 6,
    digitalAdoption: 'Medium',
    avgMonthlyIncome: 14000,
    urbanizationRate: '37.87%',
  },
  {
    district: 'Nellore',
    state: 'Andhra Pradesh',
    population: '24,69,712',
    literacyRate: '68.94%',
    sexRatio: 989,
    majorIndustries: ['Aquaculture', 'Rice', 'Textiles', 'Services', 'Mining'],
    topBusinessOpportunities: [
      'Aquaculture and seafood processing',
      'Rice milling and trading',
      'Textile manufacturing',
      'Pharmaceutical distribution',
      'Port-related services',
    ],
    agriculturalProfile: 'Paddy, aquaculture, and sugarcane. Coastal district with fertile delta.',
    employmentStats: { employed: '35%', selfEmployed: '22%', unemployed: '10%', agriculture: '40%' },
    nearbyMarkets: ['Nellore Market', 'Kavali Market', 'Gudur Market', 'Sullurpeta Market'],
    infrastructureScore: 6,
    digitalAdoption: 'Medium',
    avgMonthlyIncome: 14000,
    urbanizationRate: '34.23%',
  },
  {
    district: 'Kurnool',
    state: 'Andhra Pradesh',
    population: '29,96,612',
    literacyRate: '61.87%',
    sexRatio: 990,
    majorIndustries: ['Agriculture', 'Cotton', 'Tobacco', 'Mining', 'Services'],
    topBusinessOpportunities: [
      'Cotton ginning and pressing',
      'Tobacco trading and processing',
      'Rice milling',
      'Cement and building materials',
      'Agricultural inputs retail',
    ],
    agriculturalProfile: 'Cotton, tobacco, rice, and groundnut. Tungabhadra river irrigation.',
    employmentStats: { employed: '30%', selfEmployed: '24%', unemployed: '13%', agriculture: '48%' },
    nearbyMarkets: ['Kurnool Market', 'Nandyal Market', 'Adoni Market', 'Yemmiganur Market'],
    infrastructureScore: 5,
    digitalAdoption: 'Low',
    avgMonthlyIncome: 11000,
    urbanizationRate: '30.52%',
  },
  {
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    population: '25,93,980',
    literacyRate: '85.19%',
    sexRatio: 951,
    majorIndustries: ['Textiles', 'Engineering', 'IT/ITES', 'Pumps and motors', 'Automobiles'],
    topBusinessOpportunities: [
      'Textile manufacturing and export',
      'Engineering and precision parts',
      'IT services',
      'Pump and motor manufacturing',
      'Food processing',
    ],
    agriculturalProfile: 'Coconut, cotton, and vegetables. Well-irrigated from Siruvani.',
    employmentStats: { employed: '42%', selfEmployed: '20%', unemployed: '6%', agriculture: '15%' },
    nearbyMarkets: ['RS Puram Market', 'Gandhipuram Market', 'Town Hall Market', 'Ukkadam Market'],
    infrastructureScore: 8,
    digitalAdoption: 'High',
    avgMonthlyIncome: 22000,
    urbanizationRate: '58.49%',
  },
  {
    district: 'Kanpur',
    state: 'Uttar Pradesh',
    population: '45,72,951',
    literacyRate: '79.65%',
    sexRatio: 857,
    majorIndustries: ['Leather', 'Textiles', 'Chemicals', 'Services', 'Food Processing'],
    topBusinessOpportunities: [
      'Leather goods manufacturing and export',
      'Textile manufacturing',
      'Chemical trading',
      'Food processing',
      'Educational services',
    ],
    agriculturalProfile: 'Wheat, sugarcane, and potatoes. Gangetic plain.',
    employmentStats: { employed: '36%', selfEmployed: '20%', unemployed: '9%', agriculture: '22%' },
    nearbyMarkets: ['Naveen Market', 'Mall Road Market', 'Kidwai Nagar Market', 'Bara Sidharth Market'],
    infrastructureScore: 7,
    digitalAdoption: 'Medium',
    avgMonthlyIncome: 18000,
    urbanizationRate: '55.28%',
  },
  {
    district: 'Nagpur',
    state: 'Maharashtra',
    population: '24,05,421',
    literacyRate: '93.13%',
    sexRatio: 953,
    majorIndustries: ['Oranges', 'Mining', 'Automobiles', 'IT/ITES', 'Services'],
    topBusinessOpportunities: [
      'Orange processing and trading',
      'Mining and mineral trading',
      'Automobile services',
      'IT and BPO services',
      'Logistics and warehousing',
    ],
    agriculturalProfile: 'Orange (citrus), soybean, and cotton. Vidarbha region.',
    employmentStats: { employed: '40%', selfEmployed: '18%', unemployed: '7%', agriculture: '15%' },
    nearbyMarkets: ['Sitabuldi Market', 'Sadar Market', 'Dharampeth Market', 'Itwari Market'],
    infrastructureScore: 7,
    digitalAdoption: 'Medium',
    avgMonthlyIncome: 20000,
    urbanizationRate: '55.86%',
  },
  {
    district: 'Mysore',
    state: 'Karnataka',
    population: '23,96,104',
    literacyRate: '80.78%',
    sexRatio: 984,
    majorIndustries: ['Tourism', 'Silk', 'IT/ITES', 'Education', 'Agro-processing'],
    topBusinessOpportunities: [
      'Silk weaving and trading',
      'Tourism services',
      'IT and software services',
      'Educational services',
      'Agro-processing and organic products',
    ],
    agriculturalProfile: 'Paddy, sugarcane, coconut, and sericulture (silk).',
    employmentStats: { employed: '38%', selfEmployed: '20%', unemployed: '8%', agriculture: '22%' },
    nearbyMarkets: ['Devaraja Market', 'Sayyaji Rao Road Market', 'K.R. Circle Market', 'Saraswathipuram Market'],
    infrastructureScore: 7,
    digitalAdoption: 'Medium',
    avgMonthlyIncome: 18000,
    urbanizationRate: '45.32%',
  },
]

/**
 * Find district data by name (case-insensitive partial match)
 */
export function findDistrictData(location: string): DistrictData | null {
  const lower = location.toLowerCase()
  return districtData.find(d =>
    d.district.toLowerCase().includes(lower) ||
    lower.includes(d.district.toLowerCase())
  ) || null
}

/**
 * Find state data by name
 */
export function findStateData(location: string): StateData | null {
  const lower = location.toLowerCase()
  
  // Direct state match
  for (const [key, data] of Object.entries(stateData)) {
    if (key === lower || lower.includes(key) || key.includes(lower)) {
      return data
    }
  }
  
  // Check if it's a known district and return its state
  const district = findDistrictData(location)
  if (district) {
    return stateData[district.state.toLowerCase()] || null
  }
  
  return null
}

/**
 * Get top business opportunities for a location based on real data
 */
export function getLocalOpportunities(location: string): string[] {
  const district = findDistrictData(location)
  if (district) return district.topBusinessOpportunities
  
  const state = findStateData(location)
  if (state) {
    // Generate opportunities based on state's major sectors
    return state.majorSectors.map(s => `${s}-related business opportunities in ${state.capitalCity} region`)
  }
  
  return []
}
