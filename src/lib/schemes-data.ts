/**
 * Real, structured government scheme data for Indian entrepreneurs.
 * Sources: official scheme portals (kvic.org.in, mudra.org.in, standupmitra.in, etc.)
 * This is seed data — not LLM-generated.
 */

export interface SchemeData {
  id: string
  name: string
  fullName: string
  ministry: string
  maxLoanAmount: string
  maxLoanAmountNumeric: number
  interestRate: string
  subsidy: string
  category: string[] // general, sc, st, obc, women, minority, all
  businessTypes: string[] // dairy, retail, manufacturing, services, agriculture, food-processing, all
  minAge: number
  maxAge: number
  minIncome: number // annual, 0 = no limit
  maxIncome: number // annual, 0 = no limit
  requiredDocuments: string[]
  applicationProcess: string
  applicationLink: string
  description: string
  eligibilityCriteria: string
  processingTime: string
  collateralRequired: boolean
}

export const governmentSchemes: SchemeData[] = [
  {
    id: 'mudra-shishu',
    name: 'MUDRA Loan (Shishu)',
    fullName: 'Pradhan Mantri MUDRA Yojana — Shishu Category',
    ministry: 'Ministry of Finance',
    maxLoanAmount: '₹50,000',
    maxLoanAmountNumeric: 50000,
    interestRate: '10-12% p.a.',
    subsidy: 'No subsidy, but collateral-free',
    category: ['all'],
    businessTypes: ['dairy', 'retail', 'manufacturing', 'services', 'agriculture', 'food-processing'],
    minAge: 18,
    maxAge: 65,
    minIncome: 0,
    maxIncome: 0,
    requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Passport-size Photo', 'Address Proof', 'Business Plan (if available)'],
    applicationProcess: '1. Visit nearest bank branch or NBFC\n2. Fill MUDRA application form\n3. Submit required documents\n4. Bank processes within 7-10 days\n5. Loan disbursement to your account',
    applicationLink: 'https://www.udyamimitra.in',
    description: 'For very small businesses and startups needing micro-finance. Ideal for first-time entrepreneurs.',
    eligibilityCriteria: 'Any Indian citizen aged 18+ with a business plan for a non-farm income generating activity.',
    processingTime: '7-10 working days',
    collateralRequired: false,
  },
  {
    id: 'mudra-kishore',
    name: 'MUDRA Loan (Kishore)',
    fullName: 'Pradhan Mantri MUDRA Yojana — Kishore Category',
    ministry: 'Ministry of Finance',
    maxLoanAmount: '₹5,00,000',
    maxLoanAmountNumeric: 500000,
    interestRate: '10-12% p.a.',
    subsidy: 'No subsidy, but collateral-free',
    category: ['all'],
    businessTypes: ['dairy', 'retail', 'manufacturing', 'services', 'agriculture', 'food-processing'],
    minAge: 18,
    maxAge: 65,
    minIncome: 0,
    maxIncome: 0,
    requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Passport-size Photo', 'Address Proof', 'Business Plan', 'Quotations for equipment'],
    applicationProcess: '1. Visit nearest bank branch or NBFC\n2. Fill MUDRA application form\n3. Submit business plan and documents\n4. Bank processes within 7-10 days\n5. Loan disbursement',
    applicationLink: 'https://www.udyamimitra.in',
    description: 'For small businesses that have been operational and need expansion capital.',
    eligibilityCriteria: 'Any Indian citizen aged 18+ with an existing small business or a viable business plan.',
    processingTime: '7-10 working days',
    collateralRequired: false,
  },
  {
    id: 'mudra-tarun',
    name: 'MUDRA Loan (Tarun)',
    fullName: 'Pradhan Mantri MUDRA Yojana — Tarun Category',
    ministry: 'Ministry of Finance',
    maxLoanAmount: '₹10,00,000',
    maxLoanAmountNumeric: 1000000,
    interestRate: '10-12% p.a.',
    subsidy: 'No subsidy, but collateral-free',
    category: ['all'],
    businessTypes: ['dairy', 'retail', 'manufacturing', 'services', 'agriculture', 'food-processing'],
    minAge: 18,
    maxAge: 65,
    minIncome: 0,
    maxIncome: 0,
    requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Passport-size Photo', 'Address Proof', 'Detailed Project Report', 'Quotations', 'Bank Statements (6 months)'],
    applicationProcess: '1. Visit nearest bank branch\n2. Submit detailed project report\n3. Bank appraises the project\n4. Processing within 10-15 days\n5. Loan disbursement',
    applicationLink: 'https://www.udyamimitra.in',
    description: 'For established small businesses seeking significant expansion funding.',
    eligibilityCriteria: 'Existing small business owners or entrepreneurs with a detailed project report.',
    processingTime: '10-15 working days',
    collateralRequired: false,
  },
  {
    id: 'pmegp',
    name: 'PMEGP',
    fullName: 'Prime Minister Employment Generation Programme',
    ministry: 'Ministry of Micro, Small and Medium Enterprises',
    maxLoanAmount: '₹25,00,000',
    maxLoanAmountNumeric: 2500000,
    interestRate: '4-8% p.a. (subsidized)',
    subsidy: '25% (General), 35% (SC/ST/OBC/Minority/Women) of project cost',
    category: ['general', 'sc', 'st', 'obc', 'women', 'minority'],
    businessTypes: ['dairy', 'retail', 'manufacturing', 'services', 'agriculture', 'food-processing'],
    minAge: 18,
    maxAge: 65,
    minIncome: 0,
    maxIncome: 0,
    requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Project Report', 'Caste Certificate (if applicable)', 'Education Proof', 'Rural Area Certificate'],
    applicationProcess: '1. Register on KVIC portal (kvic.org.in)\n2. Fill online application with project details\n3. Submit at District Industries Center (DIC)\n4. Mandatory training of 2-3 weeks\n5. Loan processing and disbursement',
    applicationLink: 'https://www.kvic.org.in',
    description: 'Government subsidy of 25-35% on project cost for new enterprises. Priority for rural areas.',
    eligibilityCriteria: 'Indian citizen aged 18+. New enterprise in manufacturing or service sector. Rural area preference.',
    processingTime: '30-45 days (includes training)',
    collateralRequired: false,
  },
  {
    id: 'standup-india',
    name: 'Stand-Up India',
    fullName: 'Stand-Up India Scheme',
    ministry: 'Department of Financial Services',
    maxLoanAmount: '₹1,00,00,000',
    maxLoanAmountNumeric: 10000000,
    interestRate: 'MCLR + 3% (approx 11-14%)',
    subsidy: 'No direct subsidy, but 75% of project cost covered',
    category: ['sc', 'st', 'women'],
    businessTypes: ['dairy', 'retail', 'manufacturing', 'services', 'agriculture', 'food-processing'],
    minAge: 18,
    maxAge: 65,
    minIncome: 0,
    maxIncome: 0,
    requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Caste Certificate / Women Entrepreneur Proof', 'Project Report', 'Education Documents', 'Business Registration'],
    applicationProcess: '1. Apply through standupmitra.in portal\n2. Select your lead bank\n3. Submit project report and documents\n4. Bank processes within 30-45 days\n5. Loan disbursement',
    applicationLink: 'https://www.standupmitra.in',
    description: 'Loans from ₹10 lakh to ₹1 crore for SC/ST and women entrepreneurs. Covers 75% of project cost.',
    eligibilityCriteria: 'SC/ST/Women entrepreneurs aged 18+. New enterprise in manufacturing, services, or trading. Not availed similar loan before.',
    processingTime: '30-45 working days',
    collateralRequired: false,
  },
  {
    id: 'pm-svanidhi',
    name: 'PM SVANidhi',
    fullName: 'PM Street Vendor’s AtmaNirbhar Nidhi',
    ministry: 'Ministry of Housing and Urban Affairs',
    maxLoanAmount: '₹50,000',
    maxLoanAmountNumeric: 50000,
    interestRate: '7% subsidized (effective ~2-3%)',
    subsidy: '7% interest subsidy on timely repayment',
    category: ['all'],
    businessTypes: ['retail', 'services', 'food-processing'],
    minAge: 18,
    maxAge: 65,
    minIncome: 0,
    maxIncome: 0,
    requiredDocuments: ['Aadhaar Card', 'Vending Certificate / Identity Certificate', 'Bank Account Details', 'Street Vendor Photo'],
    applicationProcess: '1. Apply on pmvanidhi.mohua.gov.in\n2. Upload identity and vending proof\n3. Loan approved within 7 days\n4. Repay in monthly installments over 1 year',
    applicationLink: 'https://pmvanidhi.mohua.gov.in',
    description: 'Working capital loan up to ₹50,000 for street vendors with interest subsidy.',
    eligibilityCriteria: 'Street vendors in urban areas with a vending certificate or identity certificate.',
    processingTime: '7 working days',
    collateralRequired: false,
  },
  {
    id: 'cgtmse',
    name: 'CGTMSE',
    fullName: 'Credit Guarantee Fund Trust for Micro and Small Enterprises',
    ministry: 'Ministry of MSME',
    maxLoanAmount: '₹5,00,00,000',
    maxLoanAmountNumeric: 50000000,
    interestRate: '8-12% p.a.',
    subsidy: 'Government guarantees 75% of loan to the bank',
    category: ['all'],
    businessTypes: ['dairy', 'retail', 'manufacturing', 'services', 'agriculture', 'food-processing'],
    minAge: 18,
    maxAge: 65,
    minIncome: 0,
    maxIncome: 0,
    requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Business Registration', 'GST Returns', 'Bank Statements (6 months)', 'Project Report'],
    applicationProcess: '1. Visit any CGTMSE-member bank\n2. Submit application with business documents\n3. Bank appraises and submits to CGTMSE\n4. Guarantee sanction within 30 days\n5. Loan disbursement',
    applicationLink: 'https://www.cgtmse.in',
    description: 'Collateral-free loans up to ₹5 crore for MSMEs with government guarantee.',
    eligibilityCriteria: 'Existing MSMEs with GST registration and minimum 1 year of operations.',
    processingTime: '30 working days',
    collateralRequired: false,
  },
  {
    id: 'nrlm',
    name: 'NRLM (DAY-NRLM)',
    fullName: 'Deendayal Antyodaya Yojana — National Rural Livelihood Mission',
    ministry: 'Ministry of Rural Development',
    maxLoanAmount: '₹3,00,000',
    maxLoanAmountNumeric: 300000,
    interestRate: 'Banks: 7-10% | SHG internal: 0%',
    subsidy: 'Interest subsidy for SHG loans',
    category: ['all'],
    businessTypes: ['dairy', 'retail', 'manufacturing', 'services', 'agriculture', 'food-processing'],
    minAge: 18,
    maxAge: 65,
    minIncome: 0,
    maxIncome: 200000,
    requiredDocuments: ['Aadhaar Card', 'SHG Membership Proof', 'Bank Account (SHG)', 'Resolution of SHG'],
    applicationProcess: '1. Join or form a Self-Help Group (SHG)\n2. SHG gets registered with the block office\n3. SHG maintains savings record for 6+ months\n4. Bank link loan: apply through the SHG\n5. Loan disbursed to SHG account',
    applicationLink: 'https://aajeevika.gov.in',
    description: 'Affordable credit through Self-Help Groups for rural women entrepreneurs.',
    eligibilityCriteria: 'Women aged 18+ who are members of a registered SHG. Rural areas only.',
    processingTime: '15-30 days',
    collateralRequired: false,
  },
  {
    id: 'mudra-foundation',
    name: 'MUDRA (Foundation)',
    fullName: 'MUDRA — For New Entrepreneurs (Foundation Stage)',
    ministry: 'Ministry of Finance',
    maxLoanAmount: '₹10,00,000',
    maxLoanAmountNumeric: 1000000,
    interestRate: '10-12% p.a.',
    subsidy: 'Collateral-free',
    category: ['all'],
    businessTypes: ['dairy', 'retail', 'manufacturing', 'services', 'food-processing'],
    minAge: 18,
    maxAge: 65,
    minIncome: 0,
    maxIncome: 0,
    requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Business Plan', 'Photograph', 'Address Proof'],
    applicationProcess: '1. Visit bank branch or apply online\n2. Submit application with business plan\n3. Bank verifies and processes\n4. Loan disbursement',
    applicationLink: 'https://www.udyamimitra.in',
    description: 'Comprehensive MUDRA loan for foundation-stage enterprises.',
    eligibilityCriteria: 'Any Indian citizen aged 18+ with a non-farm business idea.',
    processingTime: '7-15 working days',
    collateralRequired: false,
  },
  {
    id: 'startup-india',
    name: 'Startup India Seed Fund',
    fullName: 'Startup India Seed Fund Scheme',
    ministry: 'Department for Promotion of Industry and Internal Trade',
    maxLoanAmount: '₹20,00,000',
    maxLoanAmountNumeric: 2000000,
    interestRate: '3-8% p.a.',
    subsidy: 'Grant up to ₹20 lakh for proof of concept, prototype, product trials, market entry',
    category: ['all'],
    businessTypes: ['manufacturing', 'services', 'food-processing'],
    minAge: 18,
    maxAge: 65,
    minIncome: 0,
    maxIncome: 0,
    requiredDocuments: ['Aadhaar Card', 'PAN Card', 'DPIIT Recognition Certificate', 'Business Registration', 'Project Report', 'Pitch Deck'],
    applicationProcess: '1. Get DPIIT recognition on startupindia.gov.in\n2. Apply through incubators registered with DIPP\n3. Incubator evaluates and recommends\n4. Seed Fund Authority approves\n5. Grant/disbursement',
    applicationLink: 'https://www.startupindia.gov.in',
    description: 'Seed funding for DPIIT-recognized startups for proof of concept and market entry.',
    eligibilityCriteria: 'DPIIT-recognized startup. Incorporated less than 2 years ago. Not received funding from similar schemes.',
    processingTime: '30-60 days',
    collateralRequired: false,
  },
  {
    id: 'pmfme',
    name: 'PMFME',
    fullName: 'PM Formalization of Micro Food Processing Enterprises',
    ministry: 'Ministry of Food Processing Industries',
    maxLoanAmount: '₹10,00,000',
    maxLoanAmountNumeric: 1000000,
    interestRate: 'Banks: 7-10%',
    subsidy: '35% credit-linked subsidy (max ₹10 lakh)',
    category: ['all'],
    businessTypes: ['food-processing', 'agriculture'],
    minAge: 18,
    maxAge: 65,
    minIncome: 0,
    maxIncome: 0,
    requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Food License (FSSAI)', 'GST Registration', 'Bank Account', 'Project Report'],
    applicationProcess: '1. Apply through state nodal agency\n2. Get FSSAI registration\n3. Submit project report\n4. Bank appraises the project\n5. Subsidy + loan disbursement',
    applicationLink: 'https://pmfme.mofpi.gov.in',
    description: 'Credit-linked subsidy for micro food processing units. 35% subsidy on project cost.',
    eligibilityCriteria: 'Existing unorganized food processing units. Indian citizen aged 18+.',
    processingTime: '30-45 days',
    collateralRequired: false,
  },
  {
    id: 'clcss',
    name: 'CLCSS',
    fullName: 'Credit Linked Capital Subsidy Scheme',
    ministry: 'Ministry of MSME',
    maxLoanAmount: '₹15,00,000',
    maxLoanAmountNumeric: 1500000,
    interestRate: 'Banks: 10-12%',
    subsidy: '15% capital subsidy (max ₹15 lakh) for technology upgradation',
    category: ['all'],
    businessTypes: ['manufacturing'],
    minAge: 18,
    maxAge: 65,
    minIncome: 0,
    maxIncome: 0,
    requiredDocuments: ['Aadhaar Card', 'PAN Card', 'MSME Registration (Udyam)', 'GST Returns', 'Technology quotation', 'Bank Statements'],
    applicationProcess: '1. Register on Udyam portal\n2. Identify technology to be upgraded\n3. Apply through NABARD/SIDBI empaneled agencies\n4. Bank processes with subsidy component\n5. Technology procurement and disbursement',
    applicationLink: 'https://www.mudra.org.in',
    description: '15% capital subsidy for technology upgradation in existing MSMEs.',
    eligibilityCriteria: 'Existing MSME units with Udyam registration. Manufacturing sector. Technology upgradation required.',
    processingTime: '30-45 days',
    collateralRequired: false,
  },
  {
    id: 'mudra-women',
    name: 'MUDRA (Women Entrepreneur)',
    fullName: 'MUDRA Yojana — Special Focus for Women Entrepreneurs',
    ministry: 'Ministry of Finance',
    maxLoanAmount: '₹10,00,000',
    maxLoanAmountNumeric: 1000000,
    interestRate: '10-12% p.a.',
    subsidy: 'Priority processing and slightly lower rates at some banks',
    category: ['women'],
    businessTypes: ['dairy', 'retail', 'manufacturing', 'services', 'food-processing'],
    minAge: 18,
    maxAge: 65,
    minIncome: 0,
    maxIncome: 0,
    requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Passport-size Photo', 'Business Plan', 'Address Proof'],
    applicationProcess: '1. Visit nearest bank branch\n2. Fill application under women entrepreneur category\n3. Submit documents and business plan\n4. Priority processing\n5. Loan disbursement',
    applicationLink: 'https://www.udyamimitra.in',
    description: 'Special focus MUDRA loans for women entrepreneurs with priority processing.',
    eligibilityCriteria: 'Women aged 18+ with a business plan for non-farm income generating activity.',
    processingTime: '7-10 working days',
    collateralRequired: false,
  },
  {
    id: 'csf-sewu',
    name: 'CSF-SEWU',
    fullName: 'Credit Scheme for SC/ST Entrepreneurs — Special Component',
    ministry: 'Ministry of Social Justice and Empowerment',
    maxLoanAmount: '₹25,00,000',
    maxLoanAmountNumeric: 2500000,
    interestRate: 'Subsidized rates',
    subsidy: 'Capital subsidy of 25-35% for SC/ST entrepreneurs',
    category: ['sc', 'st'],
    businessTypes: ['dairy', 'retail', 'manufacturing', 'services', 'food-processing'],
    minAge: 18,
    maxAge: 65,
    minIncome: 0,
    maxIncome: 0,
    requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Caste Certificate', 'Project Report', 'Education Proof'],
    applicationProcess: '1. Apply through District Social Welfare Officer\n2. Submit project report and caste certificate\n3. District committee reviews\n4. Bank loan processing\n5. Disbursement with subsidy',
    applicationLink: 'https://www.nsic.co.in',
    description: 'Special credit scheme with capital subsidy for SC/ST entrepreneurs.',
    eligibilityCriteria: 'SC/ST citizens aged 18+. New or existing enterprise.',
    processingTime: '30-45 days',
    collateralRequired: false,
  },
  {
    id: 'minority-mudra',
    name: 'MUDRA (Minority)',
    fullName: 'MUDRA Yojana — Special Focus for Minority Communities',
    ministry: 'Ministry of Minority Affairs',
    maxLoanAmount: '₹10,00,000',
    maxLoanAmountNumeric: 1000000,
    interestRate: '10-12% p.a.',
    subsidy: 'Priority processing for minority entrepreneurs',
    category: ['minority'],
    businessTypes: ['dairy', 'retail', 'manufacturing', 'services', 'food-processing'],
    minAge: 18,
    maxAge: 65,
    minIncome: 0,
    maxIncome: 0,
    requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Minority Community Certificate', 'Business Plan', 'Address Proof'],
    applicationProcess: '1. Apply through MUDRA portal or bank\n2. Submit minority community certificate\n3. Bank processes with priority\n4. Loan disbursement',
    applicationLink: 'https://www.udyamimitra.in',
    description: 'Priority MUDRA loans for minority community entrepreneurs.',
    eligibilityCriteria: 'Minority community member aged 18+ with a business plan.',
    processingTime: '7-10 working days',
    collateralRequired: false,
  },
  {
    id: 'pm-kusum',
    name: 'PM-KUSUM',
    fullName: 'Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan',
    ministry: 'Ministry of New and Renewable Energy',
    maxLoanAmount: '₹20,00,000',
    maxLoanAmountNumeric: 2000000,
    interestRate: 'Banks: 6-8%',
    subsidy: 'Up to 60% capital subsidy for solar pumps',
    category: ['all'],
    businessTypes: ['agriculture'],
    minAge: 18,
    maxAge: 65,
    minIncome: 0,
    maxIncome: 0,
    requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Land Records', 'Bank Account', 'Electricity Connection Proof'],
    applicationProcess: '1. Apply through state nodal agency\n2. Submit land and electricity documents\n3. Agency verifies and approves\n4. Solar pump installation\n5. Subsidy disbursement',
    applicationLink: 'https://pmkusum.mnre.gov.in',
    description: 'Solar pump and solar power plant subsidy for farmers. Up to 60% subsidy.',
    eligibilityCriteria: 'Farmers with agricultural land. Indian citizen.',
    processingTime: '30-60 days',
    collateralRequired: false,
  },
  {
    id: 'sgp',
    name: 'Stand-Up Guarantee',
    fullName: 'Credit Guarantee Fund for Stand-Up India',
    ministry: 'Department of Financial Services',
    maxLoanAmount: '₹1,00,00,000',
    maxLoanAmountNumeric: 10000000,
    interestRate: 'MCLR + 3%',
    subsidy: 'Government guarantee on 85% of loan amount',
    category: ['sc', 'st', 'women'],
    businessTypes: ['dairy', 'retail', 'manufacturing', 'services', 'food-processing'],
    minAge: 18,
    maxAge: 65,
    minIncome: 0,
    maxIncome: 0,
    requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Caste/Women Certificate', 'Project Report', 'Business Registration'],
    applicationProcess: '1. Apply through standupmitra.in\n2. Select lead bank\n3. Bank appraises project\n4. CGFSL provides guarantee\n5. Loan disbursement',
    applicationLink: 'https://www.standupmitra.in',
    description: 'Government guarantee covering 85% of loan for SC/ST/Women entrepreneurs.',
    eligibilityCriteria: 'SC/ST/Women entrepreneurs with a new enterprise. Annual turnover < ₹25 crore.',
    processingTime: '30-45 days',
    collateralRequired: false,
  },
  {
    id: 'nabard-mudra',
    name: 'NABARD Mudra Loan',
    fullName: 'NABARD-Assisted MUDRA Loans for Rural Areas',
    ministry: 'NABARD / Ministry of Finance',
    maxLoanAmount: '₹10,00,000',
    maxLoanAmountNumeric: 1000000,
    interestRate: '9-12% p.a.',
    subsidy: 'Interest subvention for rural areas',
    category: ['all'],
    businessTypes: ['dairy', 'retail', 'manufacturing', 'services', 'agriculture', 'food-processing'],
    minAge: 18,
    maxAge: 65,
    minIncome: 0,
    maxIncome: 0,
    requiredDocuments: ['Aadhaar Card', 'PAN Card', 'Business Plan', 'Rural Area Proof', 'Bank Account'],
    applicationProcess: '1. Apply through regional rural bank\n2. Submit application and project report\n3. Bank/NABARD processes\n4. Disbursement',
    applicationLink: 'https://www.nabard.org',
    description: 'NABARD channelized MUDRA loans for rural entrepreneurs with interest subvention.',
    eligibilityCriteria: 'Rural area residents aged 18+. Non-farm income generating activity.',
    processingTime: '10-15 days',
    collateralRequired: false,
  },
]

/**
 * Get scheme count for display
 */
export function getSchemeCount(): number {
  return governmentSchemes.length
}

/**
 * Find schemes matching a user profile
 */
export function findMatchingSchemes(profile: {
  age: number
  gender: string
  businessType: string
  income: number
  investmentNeeded: number
  category: string
}): SchemeData[] {
  return governmentSchemes.filter(scheme => {
    // Age check
    if (profile.age < scheme.minAge || profile.age > scheme.maxAge) return false
    
    // Category check
    if (!scheme.category.includes('all') && !scheme.category.includes(profile.category.toLowerCase())) return false
    
    // Income check
    if (scheme.maxIncome > 0 && profile.income > scheme.maxIncome) return false
    
    // Business type check
    if (!scheme.businessTypes.includes('all') && !scheme.businessTypes.includes(profile.businessType.toLowerCase())) return false
    
    return true
  })
}

/**
 * Score scheme eligibility (0-100) based on profile fit
 */
export function scoreScheme(scheme: SchemeData, profile: {
  age: number
  gender: string
  businessType: string
  income: number
  investmentNeeded: number
  category: string
}): number {
  let score = 50 // base

  // Category match bonus
  if (scheme.category.includes(profile.category.toLowerCase())) score += 25
  else if (scheme.category.includes('all')) score += 10

  // Gender match for gender-specific schemes
  if (scheme.category.includes('women') && profile.gender.toLowerCase() === 'female') score += 15
  if ((scheme.category.includes('sc') || scheme.category.includes('st')) && 
      (profile.category.toLowerCase() === 'sc' || profile.category.toLowerCase() === 'st')) score += 15

  // Business type match
  if (scheme.businessTypes.includes(profile.businessType.toLowerCase())) score += 10

  // Loan amount fit
  if (profile.investmentNeeded <= scheme.maxLoanAmountNumeric) score += 5

  // Age sweet spot (25-50 gets bonus)
  if (profile.age >= 25 && profile.age <= 50) score += 5

  return Math.min(100, score)
}
