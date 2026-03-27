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
