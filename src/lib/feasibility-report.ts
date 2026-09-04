/**
 * BizNex Feasibility Report Generator
 * 
 * Generates a comprehensive PDF feasibility report combining:
 * 1. Business profile
 * 2. Hyper-local market analysis
 * 3. Competitor analysis
 * 4. Market gap assessment
 * 5. Financial structuring
 * 6. Scheme recommendations
 * 7. EMI/repayment
 * 8. Cash flow projections
 * 9. Break-even analysis
 * 10. Risk assessment
 * 11. Recommendations
 * 
 * Uses jsPDF for PDF generation.
 */

import jsPDF from 'jspdf'
import {
  calculateProjectCost, calculateEMI, recommendSchemes, calculateBreakEven,
  projectCashFlow, calculateViabilityScore, formatCurrency,
} from './financial-engine'

interface ReportData {
  // Business profile
  businessName: string
  businessType: string
  businessDescription: string
  location: string
  investmentAmount: number
  monthlyIncome: number
  existingLoans: number
  workingCapital: number
  equipmentCost: number
  age: number
  gender: string
  category: string
  isNewBusiness: boolean

  // Market data (optional)
  marketDemandScore?: number
  competitionLevel?: string
  competitorCount?: number

  // Data source labels
  dataSource?: 'live' | 'simulated' | 'census'
}

export function generateFeasibilityReport(data: ReportData): jsPDF {
  const doc = new jsPDF()
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentW = pageW - 2 * margin
  let y = margin

  // ─── HELPER FUNCTIONS ───
  function addPage() {
    doc.addPage()
    y = margin
  }

  function checkPage(needed: number) {
    if (y + needed > pageH - 30) addPage()
  }

  function sectionTitle(title: string) {
    checkPage(20)
    y += 6
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 71, 65) // BizNex accent
    doc.text(title, margin, y)
    y += 3
    doc.setDrawColor(33, 241, 168)
    doc.setLineWidth(0.5)
    doc.line(margin, y, margin + contentW, y)
    y += 6
  }

  function subSection(title: string) {
    checkPage(12)
    y += 3
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(60, 60, 60)
    doc.text(title, margin, y)
    y += 5
  }

  function bodyText(text: string, indent = 0) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    const lines = doc.splitTextToSize(text, contentW - indent)
    lines.forEach((line: string) => {
      checkPage(5)
      doc.text(line, margin + indent, y)
      y += 4
    })
  }

  function bullet(text: string) {
    checkPage(5)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    doc.text('•', margin + 2, y)
    const lines = doc.splitTextToSize(text, contentW - 8)
    lines.forEach((line: string, i: number) => {
      doc.text(line, margin + 8, y)
      y += 4
    })
  }

  function keyValue(key: string, value: string) {
    checkPage(6)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(60, 60, 60)
    doc.text(`${key}:`, margin, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    doc.text(value, margin + 55, y)
    y += 5
  }

  // ═══════════════════════════════════════════
  // COVER PAGE
  // ═══════════════════════════════════════════
  // Header bar
  doc.setFillColor(0, 71, 65)
  doc.rect(0, 0, pageW, 60, 'F')
  
  // Title
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text('BIZNEX', margin, 30)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Hyper-Local Business Feasibility Report', margin, 42)
  
  // Date
  doc.setFontSize(9)
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, margin, 52)
  
  y = 75

  // Business name
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text(data.businessName || 'Business Feasibility Report', margin, y)
  y += 10

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text(`${data.businessType} · ${data.location}`, margin, y)
  y += 8

  // Key summary box
  doc.setFillColor(245, 245, 245)
  doc.roundedRect(margin, y, contentW, 40, 3, 3, 'F')
  doc.setDrawColor(200, 200, 200)
  doc.roundedRect(margin, y, contentW, 40, 3, 3, 'S')
  
  const boxY = y + 8
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(60, 60, 60)
  
  const summaryItems = [
    { label: 'Project Cost', value: formatCurrency(calculateProjectCost(data.investmentAmount).projectCost) },
    { label: 'Your Margin', value: formatCurrency(data.investmentAmount) },
    { label: 'Potential Finance', value: formatCurrency(calculateProjectCost(data.investmentAmount).institutionalFinancing) },
    { label: 'Category', value: data.category },
  ]
  
  const colW = contentW / 4
  summaryItems.forEach((item, i) => {
    const x = margin + i * colW + colW / 2
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(120, 120, 120)
    doc.text(item.label, x, boxY, { align: 'center' })
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 71, 65)
    doc.text(item.value, x, boxY + 10, { align: 'center' })
  })
  
  y += 50

  // Data source note
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(140, 140, 140)
  doc.text('This report combines Census of India data, OpenStreetMap business data, and BizNex financial models.', margin, y)
  y += 4
  doc.text('Generated estimates are clearly labeled. Official scheme details sourced from government portals.', margin, y)
  y += 4
  doc.text(`Report ID: BIZNEX-${Date.now().toString(36).toUpperCase()}`, margin, y)

  // ═══════════════════════════════════════════
  // PAGE 2: BUSINESS PROFILE
  // ═══════════════════════════════════════════
  addPage()
  sectionTitle('1. Business Profile')

  keyValue('Business Name', data.businessName)
  keyValue('Business Type', data.businessType)
  keyValue('Location', data.location)
  keyValue('Age', `${data.age} years`)
  keyValue('Gender', data.gender)
  keyValue('Category', data.category)
  keyValue('New/Existing', data.isNewBusiness ? 'New Business' : 'Existing Business')

  if (data.businessDescription) {
    subSection('Description')
    bodyText(data.businessDescription)
  }

  subSection('Financial Summary')
  keyValue('Total Investment', formatCurrency(data.investmentAmount))
  keyValue('Expected Monthly Income', formatCurrency(data.monthlyIncome))
  keyValue('Existing Loans', formatCurrency(data.existingLoans))
  keyValue('Working Capital', formatCurrency(data.workingCapital))
  keyValue('Equipment Cost', formatCurrency(data.equipmentCost))

  // ═══════════════════════════════════════════
  // PAGE 3: MARKET ANALYSIS
  // ═══════════════════════════════════════════
  addPage()
  sectionTitle('2. Hyper-Local Market Intelligence')

  if (data.marketDemandScore) {
    keyValue('Market Demand Score', `${data.marketDemandScore}/10`)
  }
  if (data.competitionLevel) {
    keyValue('Competition Level', data.competitionLevel)
  }
  if (data.competitorCount !== undefined) {
    keyValue('Competitor Count', `${data.competitorCount} businesses in range`)
  }

  subSection('Data Sources')
  bullet('Population & Demographics: Census of India 2011')
  bullet('Business Locations: OpenStreetMap (Overpass API) — live data when available')
  bullet('Market Estimates: BizNex model estimates based on district-level data')
  bullet('Scheme Details: Official government portals (kvic.org.in, mudra.org.in, standupmitra.in)')

  subSection('Data Credibility')
  bodyText('Real data: Business locations from OpenStreetMap are real-world verified points.')
  bodyText('Estimates: Market demand scores, revenue projections, and competition density are model-generated estimates based on district-level economic indicators.')
  bodyText('Census data: Population, literacy, and employment statistics are from Census of India 2011 and may not reflect current values.')

  // ═══════════════════════════════════════════
  // PAGE 4: FINANCIAL STRUCTURING
  // ═══════════════════════════════════════════
  addPage()
  sectionTitle('3. Financial Structuring')

  const projectCost = calculateProjectCost(data.investmentAmount)
  const finProfile = {
    availableMargin: data.investmentAmount,
    projectCost: projectCost.projectCost,
    businessType: data.businessType,
    monthlyExpectedRevenue: data.monthlyIncome,
    monthlyOperatingCost: Math.round(data.monthlyIncome * 0.65),
    isNewBusiness: data.isNewBusiness,
    existingLoans: data.existingLoans,
    age: data.age,
    gender: data.gender,
    category: data.category,
    location: data.location,
    isRural: true,
  }

  subSection('Project Cost Calculation (SIH Rule)')
  keyValue('Beneficiary Margin (10%)', formatCurrency(projectCost.beneficiaryMargin))
  keyValue('Total Project Cost', formatCurrency(projectCost.projectCost))
  keyValue('Calculation', `${formatCurrency(projectCost.beneficiaryMargin)} ÷ 0.10 = ${formatCurrency(projectCost.projectCost)}`)
  keyValue('Institutional Finance (90%)', formatCurrency(projectCost.institutionalFinancing))

  const schemes = recommendSchemes(finProfile)
  if (schemes.length > 0) {
    subSection('Applicable Government Schemes')
    schemes.forEach(scheme => {
      bullet(`${scheme.schemeName}: ${scheme.interestRate}% p.a., ${scheme.repaymentYears} years repayment, ${scheme.moratoriumMonths} months moratorium`)
    })
  }

  // ═══════════════════════════════════════════
  // PAGE 5: EMI & REPAYMENT
  // ═══════════════════════════════════════════
  addPage()
  sectionTitle('4. Loan Repayment Structure')

  const bestScheme = schemes.sort((a, b) => a.interestRate - b.interestRate)[0]
  if (bestScheme) {
    const loanAmount = Math.min(projectCost.institutionalFinancing, bestScheme.maxLoanAmount)
    const emi = calculateEMI(loanAmount, bestScheme.interestRate, bestScheme.repaymentYears, bestScheme.moratoriumMonths)

    keyValue('Recommended Scheme', bestScheme.schemeName)
    keyValue('Loan Amount', formatCurrency(emi.loanAmount))
    keyValue('Interest Rate', `${emi.interestRate}% p.a.`)
    keyValue('Tenure', `${bestScheme.repaymentYears} years (${emi.tenureMonths} months)`)
    keyValue('Moratorium', `${bestScheme.moratoriumMonths} months`)
    keyValue('Monthly EMI', formatCurrency(emi.monthlyEMI))
    keyValue('Total Interest', formatCurrency(emi.totalInterest))
    keyValue('Total Repayment', formatCurrency(emi.totalRepayment))

    if (bestScheme.moratoriumMonths > 0) {
      subSection('Moratorium Period')
      bodyText(`During the first ${bestScheme.moratoriumMonths} months, you pay only interest on the loan. Full EMI repayment begins after the moratorium period. This gives your business time to ramp up revenue before full repayment starts.`)
    }

    // Quarterly summary
    if (emi.quarterlySummary.length > 0) {
      subSection('Quarterly Repayment Summary')
      emi.quarterlySummary.slice(0, 8).forEach(q => {
        bullet(`${q.quarter}: Payment ${formatCurrency(q.totalPayment)}, Principal ${formatCurrency(q.totalPrincipal)}, Balance ${formatCurrency(q.closingBalance)}`)
      })
    }

    // Cash flow
    const cashFlow = projectCashFlow(finProfile, emi, 12)
    subSection('12-Month Cash Flow Projection')
    cashFlow.forEach(cf => {
      bullet(`Month ${cf.month}: Revenue ${formatCurrency(cf.revenue)}, Costs ${formatCurrency(cf.operatingCost)}, EMI ${formatCurrency(cf.loanRepayment)}, Net ${formatCurrency(cf.netCashFlow)}`)
    })
  }

  // ═══════════════════════════════════════════
  // PAGE 6: BREAK-EVEN & VIABILITY
  // ═══════════════════════════════════════════
  addPage()
  sectionTitle('5. Break-Even & Business Viability')

  const breakEven = calculateBreakEven(finProfile)
  subSection('Break-Even Analysis')
  keyValue('Monthly Fixed Costs', formatCurrency(breakEven.monthlyFixedCosts))
  keyValue('Monthly Variable Costs', formatCurrency(breakEven.monthlyVariableCosts))
  keyValue('Expected Monthly Revenue', formatCurrency(breakEven.expectedRevenue))
  keyValue('Expected Monthly Profit', formatCurrency(breakEven.expectedProfit))
  keyValue('Contribution Margin', formatCurrency(breakEven.contributionMargin))
  keyValue('Break-Even Sales Volume', `${breakEven.breakEvenSalesVolume} units`)
  keyValue('Break-Even Revenue', formatCurrency(breakEven.breakEvenRevenue))
  keyValue('Estimated Break-Even Month', `Month ${breakEven.estimatedBreakEvenMonth}`)
  bodyText('Note: Break-even estimates are based on your input projections. Actual results depend on market conditions, execution, and local demand.')

  const viability = calculateViabilityScore(finProfile, data.competitorCount || 0, data.marketDemandScore || 5)
  subSection('Business Viability Score')
  keyValue('Total Score', `${viability.totalScore}/100`)
  keyValue('Grade', viability.grade)
  keyValue('Market Opportunity', `${viability.breakdown.marketOpportunity}/100`)
  keyValue('Financial Feasibility', `${viability.breakdown.financialFeasibility}/100`)
  keyValue('Funding Fit', `${viability.breakdown.fundingFit}/100`)
  keyValue('Risk Level', `${viability.breakdown.riskLevel}/100`)
  keyValue('Competition', `${viability.breakdown.competitionFit}/100`)
  keyValue('Preparedness', `${viability.breakdown.preparedness}/100`)
  bodyText(`Assessment: ${viability.recommendation}`)

  // ═══════════════════════════════════════════
  // PAGE 7: RISK & RECOMMENDATIONS
  // ═══════════════════════════════════════════
  addPage()
  sectionTitle('6. Risk Assessment & Recommendations')

  subSection('Key Risks')
  if (data.monthlyIncome > 0 && data.monthlyIncome < projectCost.projectCost * 0.04) {
    bullet('Low revenue-to-investment ratio: Expected monthly income is less than 4% of project cost')
  }
  if (data.existingLoans > 0) {
    bullet(`Existing loan burden of ${formatCurrency(data.existingLoans)} may affect repayment capacity`)
  }
  bullet('Market conditions may vary from estimates — monitor actual demand in first 3 months')
  bullet('Supply chain disruptions possible in rural areas — maintain buffer stock')
  bullet('Seasonal demand fluctuations should be planned for')

  subSection('Recommendations')
  bullet(viability.recommendation)
  if (bestScheme) {
    bullet(`Apply for ${bestScheme.schemeName} — ${bestScheme.interestRate}% p.a. with ${bestScheme.moratoriumMonths} months moratorium`)
  }
  bullet('Start with a smaller inventory and scale based on actual demand')
  bullet('Build relationships with 3-5 local suppliers before launch')
  bullet('Create a Google Business profile and WhatsApp Business account for visibility')
  bullet('Track daily sales and expenses from day one')

  // ═══════════════════════════════════════════
  // PAGE 8: DATA SOURCES & DISCLAIMERS
  // ═══════════════════════════════════════════
  addPage()
  sectionTitle('7. Data Sources & Methodology')

  subSection('Real Data Sources')
  bullet('OpenStreetMap (Overpass API): Real business locations and types — verified by community mapping')
  bullet('Nominatim Geocoding: Real coordinates from OpenStreetMap data')
  bullet('Census of India 2011: Population, literacy, employment, and district-level demographics')
  bullet('Government Portals: Scheme details from kvic.org.in, mudra.org.in, standupmitra.in, pmsvanidhi.mohua.gov.in')

  subSection('Model-Generated Estimates')
  bullet('Market Demand Scores: Based on district-level economic indicators and business density')
  bullet('Revenue Forecasts: Based on district average income and business type benchmarks')
  bullet('Competition Density: Derived from OpenStreetMap data when available, estimated otherwise')
  bullet('Break-Even Analysis: Based on your input projections and industry benchmarks')
  bullet('Business Viability Score: Weighted scoring across 6 dimensions based on your profile')

  subSection('Data Credibility Labels')
  bullet('REAL DATA: Business locations from OpenStreetMap are real-world verified')
  bullet('CENSUS DATA: Population and demographics from Census of India 2011')
  bullet('GOVERNMENT DATA: Scheme details from official government portals')
  bullet('ESTIMATE: Revenue projections, demand scores, and viability scores are model-generated')
  bullet('USER INPUT: Financial projections based on your provided data')

  subSection('Disclaimer')
  bodyText('This report is generated by BizNex AI advisory system for informational purposes only. It does not constitute financial advice, loan approval, or government scheme eligibility guarantee. Actual eligibility for government schemes must be verified with the respective government department or bank. Financial projections are estimates based on available data and user inputs — actual results may vary significantly.')
  y += 4
  bodyText('Census data is from 2011 and may not reflect current demographics. Market conditions change over time. Please consult a certified financial advisor for investment decisions.')

  // Footer on all pages
  const totalPages = doc.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)
    doc.setFontSize(7)
    doc.setTextColor(150)
    doc.text(
      `BizNex Feasibility Report · ${data.businessName} · Page ${p} of ${totalPages}`,
      pageW / 2,
      pageH - 10,
      { align: 'center' }
    )
    // Top-right: generated date
    if (p > 1) {
      doc.text(
        `Generated: ${new Date().toLocaleDateString('en-IN')}`,
        pageW - margin,
        10,
        { align: 'right' }
      )
    }
  }

  return doc
}
