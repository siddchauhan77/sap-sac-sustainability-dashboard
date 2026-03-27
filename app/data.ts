// ── Demo data for SAP SAC Sustainability & Energy Dashboard ──────────────────
// SD (Sales & Distribution) + Energy/Retail focus

export const REGIONS = ["All Regions", "EMEA", "APAC", "AMER", "LATAM", "MEA"] as const;
export const FISCAL_YEARS = ["FY 2024", "FY 2023", "FY 2022"] as const;
export type Region = typeof REGIONS[number];
export type FY = typeof FISCAL_YEARS[number];

// ── KPI Tiles ─────────────────────────────────────────────────────────────────
export const kpis = {
  "All Regions": {
    co2: { value: "42,847", unit: "tCO₂e", delta: -12.3, label: "Total CO₂ Emissions" },
    renewable: { value: "68.4%", unit: "of energy mix", delta: +8.1, label: "Renewable Energy" },
    intensity: { value: "1.24", unit: "kWh / order", delta: -5.7, label: "Energy Intensity" },
    esg: { value: "78 / 100", unit: "SAP Sustainability Index", delta: +6, label: "ESG Score" },
    scope3: { value: "31,240", unit: "tCO₂e supply chain", delta: +2.1, label: "Scope 3 Emissions" },
  },
  EMEA: {
    co2: { value: "14,200", unit: "tCO₂e", delta: -14.2, label: "Total CO₂ Emissions" },
    renewable: { value: "82.1%", unit: "of energy mix", delta: +11.3, label: "Renewable Energy" },
    intensity: { value: "0.98", unit: "kWh / order", delta: -8.2, label: "Energy Intensity" },
    esg: { value: "85 / 100", unit: "SAP Sustainability Index", delta: +9, label: "ESG Score" },
    scope3: { value: "9,840", unit: "tCO₂e supply chain", delta: -1.4, label: "Scope 3 Emissions" },
  },
  APAC: {
    co2: { value: "11,820", unit: "tCO₂e", delta: +2.1, label: "Total CO₂ Emissions" },
    renewable: { value: "54.3%", unit: "of energy mix", delta: +4.2, label: "Renewable Energy" },
    intensity: { value: "1.56", unit: "kWh / order", delta: +1.8, label: "Energy Intensity" },
    esg: { value: "66 / 100", unit: "SAP Sustainability Index", delta: +2, label: "ESG Score" },
    scope3: { value: "8,120", unit: "tCO₂e supply chain", delta: +5.3, label: "Scope 3 Emissions" },
  },
  AMER: {
    co2: { value: "9,390", unit: "tCO₂e", delta: -8.6, label: "Total CO₂ Emissions" },
    renewable: { value: "71.0%", unit: "of energy mix", delta: +6.8, label: "Renewable Energy" },
    intensity: { value: "1.18", unit: "kWh / order", delta: -4.1, label: "Energy Intensity" },
    esg: { value: "80 / 100", unit: "SAP Sustainability Index", delta: +7, label: "ESG Score" },
    scope3: { value: "6,480", unit: "tCO₂e supply chain", delta: +0.9, label: "Scope 3 Emissions" },
  },
  LATAM: {
    co2: { value: "12,082", unit: "tCO₂e", delta: +5.4, label: "Total CO₂ Emissions" },
    renewable: { value: "38.0%", unit: "of energy mix", delta: +2.1, label: "Renewable Energy" },
    intensity: { value: "1.72", unit: "kWh / order", delta: +3.2, label: "Energy Intensity" },
    esg: { value: "58 / 100", unit: "SAP Sustainability Index", delta: -1, label: "ESG Score" },
    scope3: { value: "9,200", unit: "tCO₂e supply chain", delta: +6.7, label: "Scope 3 Emissions" },
  },
  MEA: {
    co2: { value: "5,312", unit: "tCO₂e", delta: -18.9, label: "Total CO₂ Emissions" },
    renewable: { value: "91.2%", unit: "of energy mix", delta: +15.4, label: "Renewable Energy" },
    intensity: { value: "0.82", unit: "kWh / order", delta: -11.2, label: "Energy Intensity" },
    esg: { value: "92 / 100", unit: "SAP Sustainability Index", delta: +14, label: "ESG Score" },
    scope3: { value: "3,600", unit: "tCO₂e supply chain", delta: -8.2, label: "Scope 3 Emissions" },
  },
} as const;

// ── Emissions Trend (monthly, tCO₂e ÷ 1000 for chart scale) ─────────────────
export const emissionsTrend = [
  { month: "Jan", fy24: 3820, fy23: 4310 },
  { month: "Feb", fy24: 3650, fy23: 4180 },
  { month: "Mar", fy24: 3910, fy23: 4400 },
  { month: "Apr", fy24: 3440, fy23: 3980 },
  { month: "May", fy24: 3720, fy23: 4150 },
  { month: "Jun", fy24: 4020, fy23: 4480 },
  { month: "Jul", fy24: 4180, fy23: 4620 },
  { month: "Aug", fy24: 3960, fy23: 4380 },
  { month: "Sep", fy24: 3580, fy23: 4110 },
  { month: "Oct", fy24: 3320, fy23: 3890 },
  { month: "Nov", fy24: 3140, fy23: 3720 },
  { month: "Dec", fy24: 3105, fy23: 3680 },
];

// ── Energy Mix Donut ──────────────────────────────────────────────────────────
export const energyMix = [
  { name: "Solar",       value: 28, color: "#107E3E" },
  { name: "Wind",        value: 24, color: "#1B62A5" },
  { name: "Hydro",       value: 16, color: "#0070F2" },
  { name: "Natural Gas", value: 20, color: "#E9730C" },
  { name: "Coal",        value: 12, color: "#BB0000" },
];

// ── Emissions by Sales Region ─────────────────────────────────────────────────
export const emissionsByRegion = [
  { region: "EMEA",  co2: 14200, target: 14000, color: "#1B62A5" },
  { region: "APAC",  co2: 11820, target: 10500, color: "#E9730C" },
  { region: "AMER",  co2: 9390,  target: 10000, color: "#1B62A5" },
  { region: "LATAM", co2: 12082, target: 11000, color: "#BB0000" },
  { region: "MEA",   co2: 5312,  target: 6500,  color: "#107E3E" },
];

// ── Logistics by Transport Mode ───────────────────────────────────────────────
export const logisticsModes = [
  { mode: "Road",    co2: 18420, color: "#E9730C" },
  { mode: "Sea",     co2: 12800, color: "#0070F2" },
  { mode: "Rail",    co2: 9100,  color: "#1B62A5" },
  { mode: "Air",     co2: 2527,  color: "#BB0000" },
];

// ── Net Zero Progress ─────────────────────────────────────────────────────────
export const netZeroProgress = [
  { scope: "Scope 1", pct: 74, color: "#107E3E" },
  { scope: "Scope 2", pct: 61, color: "#1B62A5" },
  { scope: "Scope 3", pct: 34, color: "#E9730C" },
];

// ── Plant-Level Table ─────────────────────────────────────────────────────────
export type PlantRow = {
  plant: string;
  city: string;
  salesOrg: string;
  region: Region;
  co2: number;
  energyMwh: number;
  renewablePct: number;
  deltaVsTarget: number;
  status: "On Track" | "At Risk" | "Behind";
};

export const plantData: PlantRow[] = [
  { plant: "DC-EMEA-001", city: "Frankfurt, DE",  salesOrg: "1000", region: "EMEA",  co2: 8420,  energyMwh: 24100, renewablePct: 82, deltaVsTarget: -14.2, status: "On Track" },
  { plant: "DC-EMEA-007", city: "London, UK",     salesOrg: "1010", region: "EMEA",  co2: 5780,  energyMwh: 16400, renewablePct: 79, deltaVsTarget: -9.8,  status: "On Track" },
  { plant: "DC-APAC-003", city: "Singapore, SG",  salesOrg: "3000", region: "APAC",  co2: 11820, energyMwh: 33400, renewablePct: 54, deltaVsTarget: +2.1,  status: "At Risk"  },
  { plant: "DC-APAC-011", city: "Sydney, AU",     salesOrg: "3020", region: "APAC",  co2: 6340,  energyMwh: 18900, renewablePct: 61, deltaVsTarget: -3.2,  status: "On Track" },
  { plant: "DC-AMER-007", city: "Chicago, US",    salesOrg: "2000", region: "AMER",  co2: 9390,  energyMwh: 28700, renewablePct: 71, deltaVsTarget: -8.6,  status: "On Track" },
  { plant: "DC-LATAM-002", city: "São Paulo, BR", salesOrg: "4000", region: "LATAM", co2: 12082, energyMwh: 36200, renewablePct: 38, deltaVsTarget: +5.4,  status: "Behind"   },
  { plant: "DC-LATAM-008", city: "Bogotá, CO",    salesOrg: "4010", region: "LATAM", co2: 7840,  energyMwh: 22100, renewablePct: 44, deltaVsTarget: +3.1,  status: "At Risk"  },
  { plant: "DC-MEA-001",  city: "Dubai, UAE",     salesOrg: "5000", region: "MEA",   co2: 5312,  energyMwh: 16800, renewablePct: 91, deltaVsTarget: -18.9, status: "On Track" },
];

// ── ENERGY CONSUMPTION TAB ───────────────────────────────────────────────────
export const energyMonthly = [
  { month: "Jan", solar: 1820, wind: 1540, hydro: 980, gas: 1420, coal: 820 },
  { month: "Feb", solar: 1650, wind: 1380, hydro: 910, gas: 1310, coal: 740 },
  { month: "Mar", solar: 2100, wind: 1620, hydro: 1050, gas: 1280, coal: 680 },
  { month: "Apr", solar: 2380, wind: 1740, hydro: 1100, gas: 1190, coal: 610 },
  { month: "May", solar: 2760, wind: 1890, hydro: 1020, gas: 1240, coal: 590 },
  { month: "Jun", solar: 3120, wind: 1720, hydro: 890,  gas: 1380, coal: 670 },
  { month: "Jul", solar: 3340, wind: 1580, hydro: 820,  gas: 1450, coal: 710 },
  { month: "Aug", solar: 3180, wind: 1640, hydro: 850,  gas: 1390, coal: 680 },
  { month: "Sep", solar: 2640, wind: 1810, hydro: 980,  gas: 1260, coal: 620 },
  { month: "Oct", solar: 2100, wind: 1980, hydro: 1120, gas: 1180, coal: 590 },
  { month: "Nov", solar: 1580, wind: 2140, hydro: 1180, gas: 1340, coal: 650 },
  { month: "Dec", solar: 1420, wind: 2280, hydro: 1240, gas: 1410, coal: 720 },
];

export const energyByCategory = [
  { category: "HVAC",          mwh: 42800, pct: 38 },
  { category: "Lighting",      mwh: 19600, pct: 17 },
  { category: "Refrigeration", mwh: 16900, pct: 15 },
  { category: "Conveyors",     mwh: 14200, pct: 13 },
  { category: "IT / Servers",  mwh: 11300, pct: 10 },
  { category: "Other",         mwh:  7800, pct:  7 },
];

export const energyPlantTable = [
  { plant: "DC-EMEA-001", city: "Frankfurt, DE", mwh: 24100, costEur: 192800, intensity: 0.98, renewPct: 82, trend: -8.2 },
  { plant: "DC-EMEA-007", city: "London, UK",    mwh: 16400, costEur: 147600, intensity: 1.12, renewPct: 79, trend: -5.4 },
  { plant: "DC-APAC-003", city: "Singapore, SG", mwh: 33400, costEur: 284900, intensity: 1.56, renewPct: 54, trend: +3.1 },
  { plant: "DC-APAC-011", city: "Sydney, AU",    mwh: 18900, costEur: 160650, intensity: 1.34, renewPct: 61, trend: -2.8 },
  { plant: "DC-AMER-007", city: "Chicago, US",   mwh: 28700, costEur: 229600, intensity: 1.18, renewPct: 71, trend: -6.7 },
  { plant: "DC-LATAM-002", city: "São Paulo, BR",mwh: 36200, costEur: 289600, intensity: 1.72, renewPct: 38, trend: +4.9 },
  { plant: "DC-MEA-001",  city: "Dubai, UAE",    mwh: 16800, costEur: 100800, intensity: 0.82, renewPct: 91, trend: -12.1 },
];

// ── EMISSIONS BY REGION TAB ──────────────────────────────────────────────────
export const scopeByRegion = [
  { region: "EMEA",  scope1: 3200, scope2: 4800, scope3: 6200 },
  { region: "APAC",  scope1: 4100, scope2: 5900, scope3: 9840 },
  { region: "AMER",  scope1: 2800, scope2: 3900, scope3: 5480 },
  { region: "LATAM", scope1: 4600, scope2: 5200, scope3: 9200 },
  { region: "MEA",   scope1: 980,  scope2: 1820, scope3: 3600 },
];

export const emissionsYoY = [
  { region: "EMEA",  fy22: 17200, fy23: 16560, fy24: 14200 },
  { region: "APAC",  fy22: 11400, fy23: 11580, fy24: 11820 },
  { region: "AMER",  fy22: 11200, fy23: 10280, fy24: 9390  },
  { region: "LATAM", fy22: 10800, fy23: 11470, fy24: 12082 },
  { region: "MEA",   fy22: 7200,  fy23: 6550,  fy24: 5312  },
];

// ── LOGISTICS & DISTRIBUTION TAB ─────────────────────────────────────────────
export const logisticsRoutes = [
  { route: "Frankfurt → London",    mode: "Road", distKm: 930,  co2: 2840, deliveries: 1240, onTime: 94 },
  { route: "Shanghai → Singapore",  mode: "Sea",  distKm: 4200, co2: 3120, deliveries: 890,  onTime: 88 },
  { route: "Chicago → São Paulo",   mode: "Air",  distKm: 9400, co2: 1820, deliveries: 210,  onTime: 97 },
  { route: "Dubai → Frankfurt",     mode: "Sea",  distKm: 6800, co2: 2640, deliveries: 560,  onTime: 91 },
  { route: "Sydney → Singapore",    mode: "Sea",  distKm: 6300, co2: 2380, deliveries: 480,  onTime: 86 },
  { route: "São Paulo → Bogotá",    mode: "Road", distKm: 4500, co2: 3640, deliveries: 920,  onTime: 79 },
  { route: "London → Dubai",        mode: "Air",  distKm: 5500, co2: 707,  deliveries: 150,  onTime: 98 },
  { route: "Chicago → Frankfurt",   mode: "Air",  distKm: 7800, co2: 1240, deliveries: 180,  onTime: 96 },
];

export const fleetKpis = {
  totalVehicles: 2840,
  electricPct: 18,
  avgLoadFactor: 74,
  co2PerTonKm: 0.062,
  electricDelta: +6,
  loadDelta: +3,
  co2Delta: -8.4,
};

export const logisticsMonthly = [
  { month: "Jan", road: 1620, sea: 1080, rail: 760, air: 210 },
  { month: "Feb", road: 1480, sea: 1020, rail: 710, air: 195 },
  { month: "Mar", road: 1720, sea: 1140, rail: 790, air: 230 },
  { month: "Apr", road: 1560, sea: 1060, rail: 740, air: 215 },
  { month: "May", road: 1640, sea: 1100, rail: 770, air: 220 },
  { month: "Jun", road: 1800, sea: 1220, rail: 820, air: 240 },
  { month: "Jul", road: 1880, sea: 1280, rail: 850, air: 255 },
  { month: "Aug", road: 1760, sea: 1180, rail: 800, air: 235 },
  { month: "Sep", road: 1580, sea: 1060, rail: 740, air: 210 },
  { month: "Oct", road: 1420, sea: 980,  rail: 690, air: 195 },
  { month: "Nov", road: 1340, sea: 920,  rail: 660, air: 185 },
  { month: "Dec", road: 1320, sea: 900,  rail: 640, air: 182 },
];

// ── RETAIL OPERATIONS TAB ────────────────────────────────────────────────────
export const storeData = [
  { store: "Store-EMEA-FR-01", city: "Paris, FR",      region: "EMEA",  sqm: 4200, mwh: 1840, co2: 312, wasteKg: 2840, packagingScore: 88, status: "On Track" as const },
  { store: "Store-EMEA-DE-04", city: "Berlin, DE",     region: "EMEA",  sqm: 3800, mwh: 1620, co2: 274, wasteKg: 2420, packagingScore: 91, status: "On Track" as const },
  { store: "Store-APAC-SG-02", city: "Singapore, SG",  region: "APAC",  sqm: 5100, mwh: 2680, co2: 582, wasteKg: 3840, packagingScore: 62, status: "At Risk"  as const },
  { store: "Store-AMER-US-07", city: "New York, US",   region: "AMER",  sqm: 6200, mwh: 2940, co2: 428, wasteKg: 4120, packagingScore: 74, status: "On Track" as const },
  { store: "Store-LATAM-BR-03",city: "Rio, BR",        region: "LATAM", sqm: 3400, mwh: 1980, co2: 648, wasteKg: 3280, packagingScore: 44, status: "Behind"   as const },
  { store: "Store-MEA-AE-01",  city: "Dubai, UAE",     region: "MEA",   sqm: 4800, mwh: 1540, co2: 198, wasteKg: 1920, packagingScore: 94, status: "On Track" as const },
];

export const storeEnergyBreakdown = [
  { name: "HVAC",          value: 38, color: "#1B62A5" },
  { name: "Lighting",      value: 22, color: "#0070F2" },
  { name: "Refrigeration", value: 18, color: "#107E3E" },
  { name: "IT/POS",        value: 12, color: "#E9730C" },
  { name: "Other",         value: 10, color: "#D9D9D9" },
];

// ── ESG TARGETS TAB ──────────────────────────────────────────────────────────
export const esgTargets = [
  { id: "net-zero",    label: "Net Zero Emissions",           target: 2030, current: 56, unit: "% progress", status: "On Track"  as const, detail: "42,847 tCO₂e remaining vs 2019 baseline of 76,400 t" },
  { id: "renewable",  label: "100% Renewable Energy",        target: 2027, current: 68, unit: "% of mix",    status: "On Track"  as const, detail: "68.4% achieved. Solar + wind contracts signed through 2027." },
  { id: "scope3",     label: "Halve Scope 3 Emissions",      target: 2030, current: 34, unit: "% reduction", status: "At Risk"   as const, detail: "Supplier onboarding to SAP Business Network delayed in LATAM." },
  { id: "waste",      label: "Zero Waste to Landfill",       target: 2026, current: 71, unit: "% diverted",  status: "On Track"  as const, detail: "Circular packaging programme live in EMEA and MEA regions." },
  { id: "water",      label: "30% Water Use Reduction",      target: 2025, current: 18, unit: "% saved",     status: "At Risk"   as const, detail: "APAC recirculation project behind schedule by 6 months." },
  { id: "csrd",       label: "CSRD Full Compliance",         target: 2025, current: 82, unit: "% complete",  status: "On Track"  as const, detail: "Double materiality assessment complete. ESRS E1 data validated." },
  { id: "electric",   label: "Electric Fleet Transition",    target: 2030, current: 18, unit: "% of fleet",  status: "Behind"    as const, detail: "EV charging infrastructure delayed in LATAM and APAC DCs." },
  { id: "suppliers",  label: "Supplier ESG Onboarding",      target: 2026, current: 44, unit: "% enrolled",  status: "Behind"    as const, detail: "Target 80% of tier-1 suppliers in SAP Business Network by 2026." },
];

export const esgMilestones = [
  { year: 2022, event: "Science-Based Targets (SBTi) validated", done: true },
  { year: 2023, event: "SAP Climate 21 programme launched", done: true },
  { year: 2024, event: "CSRD double materiality assessment complete", done: true },
  { year: 2025, event: "100% renewable energy in EMEA & MEA", done: false },
  { year: 2026, event: "Zero waste to landfill — all regions", done: false },
  { year: 2027, event: "100% renewable energy globally", done: false },
  { year: 2030, event: "Net Zero across Scope 1, 2, 3", done: false },
];
