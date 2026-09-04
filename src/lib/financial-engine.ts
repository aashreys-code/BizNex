/**
 * BizNex Deterministic Financial Engine
 * 
 * All financial calculations are done here in pure deterministic code.
 * The AI should EXPLAIN these calculations, not invent them.
 * 
 * SIH26091 Core Financing Rules:
 * - Beneficiary margin ≈ 10% of project cost
 * - Institutional financing ≈ 90% of project cost
 * - Micro Finance Scheme: Project cost ≤ ₹1.40 lakh, max ₹1.25 lakh, 6.5% p.a., 3yr, 3mo moratorium
 * - Term Loan Scheme: ₹1.40 lakh < Project cost ≤ ₹50 lakh, max ₹45 lakh, 8% p.a., 7yr, 6mo moratorium
 */

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface FinancialProfile {
  availableMargin: number        // How much the entrepreneur can contribute
  projectCost: number            // Total estimated project cost
  businessType: string
  monthlyExpectedRevenue: number
  monthlyOperatingCost: number
  isNewBusiness: boolean
  existingLoans: number
  age: number
  gender: string
  category: string               // General, SC, ST, OBC, Women, Minority
  location: string
  isRural: boolean
}

export interface ProjectCostBreakdown {
  projectCost: number
  beneficiaryMargin: number      // 10% of project cost
  beneficiaryMarginPercent: number
  institutionalFinancing: number // 90% of project cost
  institutionalFinancingPercent: number
}

export interface SchemeRecommendation {
  schemeName: string
  schemeType: 'micro_finance' | 'term_loan' | 'pmegp' | 'mudra_shishu' | 'mudra_kishore' | 'mudra_tarun' | 'standup_india' | 'other'
  maxLoanAmount: number
  interestRate: number           // annual %
  repaymentYears: number
  moratoriumMonths: number
  applicable: boolean
  reason: string
}

export interface EMIResult {
  monthlyEMI: number
  totalInterest: number
  totalRepayment: number
  loanAmount: number
  tenureMonths: number
  interestRate: number
  moratoriumMonths: number
  repaymentSchedule: RepaymentMonth[]
  quarterlySummary: QuarterlySummary[]
}

export interface RepaymentMonth {
  month: number
  emi: number
  principal: number
  interest: number
  balance: number
  isMoratorium: boolean
}

export interface QuarterlySummary {
  quarter: string
  totalPayment: number
  totalPrincipal: number
  totalInterest: number
  closingBalance: number
}

export interface BreakEvenAnalysis {
  monthlyFixedCosts: number
  monthlyVariableCosts: number
  expectedSellingPrice: number
  expectedMonthlySales: number
  expectedRevenue: number
  expectedProfit: number
  contributionMargin: number
  breakEvenSalesVolume: number
  estimatedBreakEvenMonth: number
  breakEvenRevenue: number
}

export interface CashFlowProjection {
  month: number
  revenue: number
  operatingCost: number
  loanRepayment: number
  netCashFlow: number
  cumulativeCashFlow: number
}

export interface BusinessViabilityScore {
  totalScore: number
  breakdown: {
    marketOpportunity: number    // 0-100
    financialFeasibility: number // 0-100
    competitionFit: number       // 0-100
    fundingFit: number           // 0-100
    riskLevel: number            // 0-100 (lower risk = higher score)
    preparedness: number         // 0-100
  }
  grade: 'Strong' | 'Good' | 'Moderate' | 'Developing' | 'At Risk'
  recommendation: string
}

// ─────────────────────────────────────────────
// 1. PROJECT COST CALCULATION
// ─────────────────────────────────────────────

/**
 * Calculate project cost based on available margin.
 * Core SIH rule: Beneficiary margin ≈ 10%, Institutional financing ≈ 90%
 */
export function calculateProjectCost(availableMargin: number): ProjectCostBreakdown {
  const projectCost = Math.round(availableMargin / 0.10)
  const beneficiaryMargin = availableMargin
  const institutionalFinancing = Math.round(projectCost * 0.90)

  return {
    projectCost,
    beneficiaryMargin,
    beneficiaryMarginPercent: 10,
    institutionalFinancing,
    institutionalFinancingPercent: 90,
  }
}

// ─────────────────────────────────────────────
// 2. SCHEME RECOMMENDATION ENGINE
// ─────────────────────────────────────────────

/**
 * Determine which SIH schemes are applicable based on project cost and profile.
 * Uses deterministic business rules, not AI.
 */
export function recommendSchemes(profile: FinancialProfile): SchemeRecommendation[] {
  const projectCost = profile.projectCost
  const schemes: SchemeRecommendation[] = []

  // Micro Finance Scheme: Project cost ≤ ₹1.40 lakh
  if (projectCost <= 140000) {
    schemes.push({
      schemeName: 'Micro Finance Scheme',
      schemeType: 'micro_finance',
      maxLoanAmount: 125000,
      interestRate: 6.5,
      repaymentYears: 3,
      moratoriumMonths: 3,
      applicable: true,
      reason: `Project cost ₹${projectCost.toLocaleString('en-IN')} ≤ ₹1.40 lakh — eligible for Micro Finance with 6.5% p.a. and 3-month moratorium.`,
    })
  }

  // Term Loan Scheme: ₹1.40 lakh < Project cost ≤ ₹50 lakh
  if (projectCost > 140000 && projectCost <= 5000000) {
    schemes.push({
      schemeName: 'Term Loan Scheme',
      schemeType: 'term_loan',
      maxLoanAmount: 4500000,
      interestRate: 8,
      repaymentYears: 7,
      moratoriumMonths: 6,
      applicable: true,
      reason: `Project cost ₹${projectCost.toLocaleString('en-IN')} is between ₹1.40 lakh and ₹50 lakh — eligible for Term Loan at 8% p.a. with 6-month moratorium.`,
    })
  }

  // MUDRA Shishu: up to ₹50,000
  if (projectCost <= 50000) {
    schemes.push({
      schemeName: 'MUDRA Loan (Shishu)',
      schemeType: 'mudra_shishu',
      maxLoanAmount: 50000,
      interestRate: 10,
      repaymentYears: 3,
      moratoriumMonths: 0,
      applicable: true,
      reason: 'Small-scale project eligible for MUDRA Shishu — collateral-free up to ₹50,000.',
    })
  }

  // MUDRA Kishore: ₹50,001 to ₹5,00,000
  if (projectCost > 50000 && projectCost <= 500000) {
    schemes.push({
      schemeName: 'MUDRA Loan (Kishore)',
      schemeType: 'mudra_kishore',
      maxLoanAmount: 500000,
      interestRate: 10,
      repaymentYears: 5,
      moratoriumMonths: 0,
      applicable: true,
      reason: 'Mid-range project eligible for MUDRA Kishore — collateral-free up to ₹5 lakh.',
    })
  }

  // MUDRA Tarun: ₹5,00,001 to ₹10,00,000
  if (projectCost > 500000 && projectCost <= 1000000) {
    schemes.push({
      schemeName: 'MUDRA Loan (Tarun)',
      schemeType: 'mudra_tarun',
      maxLoanAmount: 1000000,
      interestRate: 10,
      repaymentYears: 7,
      moratoriumMonths: 0,
      applicable: true,
      reason: 'Established business eligible for MUDRA Tarun — up to ₹10 lakh.',
    })
  }

  // PMEGP: New businesses, up to ₹25 lakh project cost
  if (profile.isNewBusiness && projectCost <= 2500000) {
    const subsidyPercent = (profile.category.toLowerCase() === 'sc' || 
                            profile.category.toLowerCase() === 'st' || 
                            profile.category.toLowerCase() === 'obc' ||
                            profile.category.toLowerCase() === 'women' ||
                            profile.category.toLowerCase() === 'minority') ? 35 : 25
    schemes.push({
      schemeName: 'PMEGP',
      schemeType: 'pmegp',
      maxLoanAmount: 2500000,
      interestRate: 6,
      repaymentYears: 7,
      moratoriumMonths: 6,
      applicable: true,
      reason: `New enterprise eligible for PMEGP with ${subsidyPercent}% government subsidy on project cost.`,
    })
  }

  // Stand-Up India: SC/ST/Women, ₹10 lakh to ₹1 crore
  if ((profile.category.toLowerCase() === 'sc' || 
       profile.category.toLowerCase() === 'st' || 
       profile.gender.toLowerCase() === 'female') &&
      projectCost >= 100000 && projectCost <= 10000000) {
    schemes.push({
      schemeName: 'Stand-Up India',
      schemeType: 'standup_india',
      maxLoanAmount: 10000000,
      interestRate: 11,
      repaymentYears: 7,
      moratoriumMonths: 6,
      applicable: true,
      reason: 'Eligible as SC/ST/Women entrepreneur — loans from ₹10 lakh to ₹1 crore.',
    })
  }

  return schemes
}

// ─────────────────────────────────────────────
// 3. EMI CALCULATION (Deterministic)
// ─────────────────────────────────────────────

/**
 * Calculate EMI using the standard formula:
 * EMI = P × r × (1+r)^n / ((1+r)^n - 1)
 */
export function calculateEMI(
  loanAmount: number,
  annualInterestRate: number,
  tenureYears: number,
  moratoriumMonths: number = 0
): EMIResult {
  const monthlyRate = annualInterestRate / 100 / 12
  const totalTenureMonths = tenureYears * 12
  
  // During moratorium, only interest is paid (or no payment)
  // After moratorium, full EMI starts
  const repaymentMonths = totalTenureMonths - moratoriumMonths

  let monthlyEMI = 0
  if (monthlyRate > 0 && repaymentMonths > 0) {
    monthlyEMI = Math.round(
      loanAmount * monthlyRate * Math.pow(1 + monthlyRate, repaymentMonths) /
      (Math.pow(1 + monthlyRate, repaymentMonths) - 1)
    )
  } else if (repaymentMonths > 0) {
    monthlyEMI = Math.round(loanAmount / repaymentMonths)
  }

  // Generate repayment schedule
  const schedule: RepaymentMonth[] = []
  let balance = loanAmount
  let totalInterest = 0
  let totalPayment = 0

  for (let m = 1; m <= totalTenureMonths; m++) {
    const isMoratorium = m <= moratoriumMonths
    const interestPayment = Math.round(balance * monthlyRate)
    
    let emiPayment: number
    let principalPayment: number

    if (isMoratorium) {
      // During moratorium: pay only interest (or nothing)
      emiPayment = interestPayment
      principalPayment = 0
    } else {
      emiPayment = monthlyEMI
      principalPayment = Math.min(emiPayment - interestPayment, balance)
      if (balance - principalPayment < 0) {
        principalPayment = balance
        emiPayment = principalPayment + interestPayment
      }
    }

    balance = Math.max(0, balance - principalPayment)
    totalInterest += interestPayment
    totalPayment += emiPayment

    schedule.push({
      month: m,
      emi: emiPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.round(balance),
      isMoratorium,
    })
  }

  // Quarterly summary
  const quarterly: QuarterlySummary[] = []
  for (let q = 0; q < schedule.length; q += 3) {
    const quarterMonths = schedule.slice(q, q + 3)
    quarterly.push({
      quarter: `Q${Math.floor(q / 3) + 1}`,
      totalPayment: quarterMonths.reduce((s, m) => s + m.emi, 0),
      totalPrincipal: quarterMonths.reduce((s, m) => s + m.principal, 0),
      totalInterest: quarterMonths.reduce((s, m) => s + m.interest, 0),
      closingBalance: quarterMonths[quarterMonths.length - 1]?.balance || 0,
    })
  }

  return {
    monthlyEMI,
    totalInterest: Math.round(totalInterest),
    totalRepayment: Math.round(totalPayment),
    loanAmount,
    tenureMonths: totalTenureMonths,
    interestRate: annualInterestRate,
    moratoriumMonths,
    repaymentSchedule: schedule,
    quarterlySummary: quarterly,
  }
}

// ─────────────────────────────────────────────
// 4. BREAK-EVEN ANALYSIS
// ─────────────────────────────────────────────

export function calculateBreakEven(profile: FinancialProfile): BreakEvenAnalysis {
  // Estimate costs from available data
  const monthlyFixedCosts = Math.round(profile.monthlyOperatingCost * 0.4) // ~40% fixed
  const monthlyVariableCosts = Math.round(profile.monthlyOperatingCost * 0.6) // ~60% variable
  const expectedRevenue = profile.monthlyExpectedRevenue || Math.round(profile.projectCost * 0.06) // 6% of project cost as baseline
  
  // Estimate average selling price and monthly sales
  const estimatedUnits = Math.max(100, Math.round(expectedRevenue / 100)) // assume ₹100 avg unit price
  const expectedSellingPrice = Math.round(expectedRevenue / estimatedUnits)
  const expectedMonthlySales = estimatedUnits
  
  // Contribution margin per unit
  const variableCostPerUnit = monthlyVariableCosts / expectedMonthlySales
  const contributionMargin = expectedSellingPrice - variableCostPerUnit
  
  // Break-even sales volume = Fixed Costs / Contribution Margin
  const breakEvenSalesVolume = contributionMargin > 0 
    ? Math.ceil(monthlyFixedCosts / contributionMargin) 
    : expectedMonthlySales
  
  // Break-even revenue
  const breakEvenRevenue = breakEvenSalesVolume * expectedSellingPrice
  
  // Estimated break-even month (considering ramp-up)
  // Typical rural business reaches break-even in 6-18 months
  const profitMargin = expectedRevenue > 0 ? (expectedRevenue - profile.monthlyOperatingCost) / expectedRevenue : 0
  const estimatedBreakEvenMonth = profitMargin > 0.3 ? 6 : profitMargin > 0.15 ? 12 : 18
  
  // Monthly profit
  const expectedProfit = expectedRevenue - profile.monthlyOperatingCost

  return {
    monthlyFixedCosts,
    monthlyVariableCosts,
    expectedSellingPrice,
    expectedMonthlySales,
    expectedRevenue,
    expectedProfit,
    contributionMargin: Math.round(contributionMargin),
    breakEvenSalesVolume,
    estimatedBreakEvenMonth,
    breakEvenRevenue,
  }
}

// ─────────────────────────────────────────────
// 5. CASH FLOW PROJECTION
// ─────────────────────────────────────────────

export function projectCashFlow(
  profile: FinancialProfile,
  emiResult: EMIResult,
  months: number = 12
): CashFlowProjection[] {
  const projections: CashFlowProjection[] = []
  let cumulativeCashFlow = -profile.availableMargin // Start with margin investment

  const rampUpFactor = [0.3, 0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.95, 1.0, 1.0, 1.0, 1.0]
  
  for (let m = 1; m <= months; m++) {
    const rampUp = rampUpFactor[Math.min(m - 1, rampUpFactor.length - 1)]
    const revenue = Math.round(profile.monthlyExpectedRevenue * rampUp)
    const operatingCost = Math.round(profile.monthlyOperatingCost * (0.7 + rampUp * 0.3))
    
    // Loan repayment (EMI starts after moratorium)
    const loanMonth = m
    let repayment = 0
    if (loanMonth > emiResult.moratoriumMonths) {
      const scheduleEntry = emiResult.repaymentSchedule[loanMonth - 1]
      repayment = scheduleEntry ? scheduleEntry.emi : 0
    }

    const netCashFlow = revenue - operatingCost - repayment
    cumulativeCashFlow += netCashFlow

    projections.push({
      month: m,
      revenue,
      operatingCost,
      loanRepayment: repayment,
      netCashFlow,
      cumulativeCashFlow,
    })
  }

  return projections
}

// ─────────────────────────────────────────────
// 6. BUSINESS VIABILITY SCORING
// ─────────────────────────────────────────────

export function calculateViabilityScore(
  profile: FinancialProfile,
  competitorCount: number = 0,
  marketDemandScore: number = 5
): BusinessViabilityScore {
  const breakdown = {
    marketOpportunity: 0,
    financialFeasibility: 0,
    competitionFit: 0,
    fundingFit: 0,
    riskLevel: 0,
    preparedness: 0,
  }

  // Market Opportunity (0-100): Based on demand score and revenue potential
  const revenueToInvestmentRatio = profile.projectCost > 0 
    ? (profile.monthlyExpectedRevenue * 12) / profile.projectCost 
    : 0
  breakdown.marketOpportunity = Math.min(100, Math.round(
    marketDemandScore * 8 + // demand score (1-10) * 8 = up to 80
    Math.min(20, revenueToInvestmentRatio * 10) // ROI ratio up to 20
  ))

  // Financial Feasibility (0-100): Margin availability, existing loans
  const marginRatio = profile.projectCost > 0 ? profile.availableMargin / profile.projectCost : 0
  const loanBurden = profile.monthlyExpectedRevenue > 0 
    ? profile.existingLoans / (profile.monthlyExpectedRevenue * 12) 
    : 1
  breakdown.financialFeasibility = Math.min(100, Math.round(
    marginRatio * 300 + // up to 30 points for 10% margin
    Math.max(0, 40 - loanBurden * 40) + // penalty for existing loans
    Math.min(30, profile.monthlyExpectedRevenue > 0 ? 30 : 0)
  ))

  // Competition Fit (0-100): Less competition = higher score
  breakdown.competitionFit = Math.min(100, Math.round(
    competitorCount <= 2 ? 90 :
    competitorCount <= 4 ? 75 :
    competitorCount <= 6 ? 60 :
    competitorCount <= 10 ? 45 : 30
  ))

  // Funding Fit (0-100): How well the project fits available schemes
  const applicableSchemes = recommendSchemes(profile)
  const hasGoodScheme = applicableSchemes.some(s => 
    s.interestRate <= 8 && s.applicable
  )
  breakdown.fundingFit = Math.min(100, Math.round(
    (applicableSchemes.length > 0 ? 50 : 0) +
    (hasGoodScheme ? 30 : 10) +
    (profile.isNewBusiness ? 20 : 15) // new businesses get PMEGP subsidy
  ))

  // Risk Level (0-100, higher = lower risk)
  const profitMargin = profile.monthlyExpectedRevenue > 0
    ? (profile.monthlyExpectedRevenue - profile.monthlyOperatingCost) / profile.monthlyExpectedRevenue
    : 0
  breakdown.riskLevel = Math.min(100, Math.round(
    (profitMargin > 0.3 ? 40 : profitMargin > 0.15 ? 25 : 10) +
    (profile.existingLoans === 0 ? 20 : profile.existingLoans < profile.monthlyExpectedRevenue * 6 ? 15 : 5) +
    (profile.monthlyExpectedRevenue > profile.monthlyOperatingCost * 1.5 ? 30 : 
     profile.monthlyExpectedRevenue > profile.monthlyOperatingCost ? 20 : 10) +
    (profile.isRural ? 10 : 5)
  ))

  // Preparedness (0-100)
  breakdown.preparedness = Math.min(100, Math.round(
    (profile.businessType ? 20 : 0) +
    (profile.projectCost > 0 ? 20 : 0) +
    (profile.monthlyExpectedRevenue > 0 ? 20 : 0) +
    (profile.availableMargin > 0 ? 20 : 0) +
    (profile.isNewBusiness ? 10 : 15) +
    (profile.location ? 10 : 0)
  ))

  // Total weighted score
  const totalScore = Math.round(
    breakdown.marketOpportunity * 0.25 +
    breakdown.financialFeasibility * 0.25 +
    breakdown.competitionFit * 0.10 +
    breakdown.fundingFit * 0.15 +
    breakdown.riskLevel * 0.15 +
    breakdown.preparedness * 0.10
  )

  // Grade
  let grade: BusinessViabilityScore['grade']
  if (totalScore >= 75) grade = 'Strong'
  else if (totalScore >= 60) grade = 'Good'
  else if (totalScore >= 45) grade = 'Moderate'
  else if (totalScore >= 30) grade = 'Developing'
  else grade = 'At Risk'

  // Recommendation
  let recommendation = ''
  if (breakdown.financialFeasibility < 40) {
    recommendation = 'Your available margin is below the recommended 10% of project cost. Consider reducing the project scope or exploring PMEGP subsidy to bridge the gap.'
  } else if (breakdown.marketOpportunity < 40) {
    recommendation = 'Market demand appears limited for this business in your area. Consider diversifying your product range or targeting adjacent customer segments.'
  } else if (breakdown.riskLevel < 40) {
    recommendation = 'Current projections show tight margins. Consider reducing operating costs or increasing prices to improve profitability before taking a loan.'
  } else if (breakdown.competitionFit < 50) {
    recommendation = 'High competitor density in your area. Focus on differentiation — offer delivery, extended hours, or specialize in an underserved product category.'
  } else {
    recommendation = 'Your business shows strong viability. Proceed with the recommended funding structure and focus on execution.'
  }

  return {
    totalScore: Math.min(100, Math.max(0, totalScore)),
    breakdown,
    grade,
    recommendation,
  }
}

// ─────────────────────────────────────────────
// 7. FUNDING STRATEGY
// ─────────────────────────────────────────────

export interface FundingStrategy {
  projectCost: number
  ownContribution: number
  potentialInstitutionalFinance: number
  recommendedScheme: SchemeRecommendation | null
  emi: EMIResult | null
  canAffordEMI: boolean
  emiToIncomeRatio: number
  summary: string
}

export function calculateFundingStrategy(profile: FinancialProfile): FundingStrategy {
  const projectBreakdown = calculateProjectCost(profile.availableMargin)
  const schemes = recommendSchemes(profile)
  
  // Sort by interest rate (lowest first) and pick best
  const bestScheme = schemes
    .filter(s => s.applicable)
    .sort((a, b) => a.interestRate - b.interestRate)[0] || null

  let emi: EMIResult | null = null
  let canAffordEMI = false
  let emiToIncomeRatio = 0

  if (bestScheme) {
    const loanAmount = Math.min(
      projectBreakdown.institutionalFinancing,
      bestScheme.maxLoanAmount
    )
    emi = calculateEMI(
      loanAmount,
      bestScheme.interestRate,
      bestScheme.repaymentYears,
      bestScheme.moratoriumMonths
    )
    
    if (profile.monthlyExpectedRevenue > 0) {
      emiToIncomeRatio = emi.monthlyEMI / profile.monthlyExpectedRevenue
      canAffordEMI = emiToIncomeRatio <= 0.4 // EMI should be < 40% of revenue
    }
  }

  const summary = bestScheme
    ? `Project cost ₹${projectBreakdown.projectCost.toLocaleString('en-IN')} with ₹${projectBreakdown.beneficiaryMargin.toLocaleString('en-IN')} (10%) own contribution. Recommended: ${bestScheme.schemeName} at ${bestScheme.interestRate}% p.a. with EMI of ₹${emi?.monthlyEMI.toLocaleString('en-IN') || '—'}/month.`
    : `Project cost ₹${projectBreakdown.projectCost.toLocaleString('en-IN')}. No specific scheme recommendation available — consider visiting your nearest bank branch.`

  return {
    projectCost: projectBreakdown.projectCost,
    ownContribution: projectBreakdown.beneficiaryMargin,
    potentialInstitutionalFinance: projectBreakdown.institutionalFinancing,
    recommendedScheme: bestScheme,
    emi,
    canAffordEMI,
    emiToIncomeRatio,
    summary,
  }
}

// ─────────────────────────────────────────────
// 8. FORMAT HELPERS
// ─────────────────────────────────────────────

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}
