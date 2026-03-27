"use client";

import { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  Bell, Settings, HelpCircle, ChevronDown, Download,
  Maximize2, SlidersHorizontal, RefreshCw,
} from "lucide-react";
import {
  REGIONS, FISCAL_YEARS, kpis, emissionsTrend, energyMix,
  emissionsByRegion, logisticsModes, netZeroProgress, plantData,
  type Region, type FY, type PlantRow,
} from "./data";

// ── SAP Colour Tokens ─────────────────────────────────────────────────────────
const C = {
  brand:    "#1B62A5",
  brandLt:  "#EAF2FB",
  positive: "#107E3E",
  posLt:    "#F1FAF4",
  critical: "#E9730C",
  negative: "#BB0000",
  accent:   "#0070F2",
  base0:    "#FFFFFF",
  base1:    "#F5F6FA",
  base2:    "#EDEFF2",
  text1:    "#32363A",
  text2:    "#6A6D70",
  border:   "#D9D9D9",
};

// ── Page tabs ─────────────────────────────────────────────────────────────────
const TABS = [
  { id: "overview",      label: "📊 Executive Overview" },
  { id: "architecture",  label: "🏗️ Architecture" },
  { id: "stories",       label: "📖 C-Suite Stories" },
  { id: "energy",        label: "⚡ Energy Consumption" },
  { id: "emissions",     label: "🌍 Emissions by Region" },
  { id: "logistics",     label: "🚛 Logistics & Distribution" },
  { id: "retail",        label: "📦 Retail Operations" },
  { id: "targets",       label: "🎯 ESG Targets" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function statusColor(s: PlantRow["status"]) {
  if (s === "On Track") return C.positive;
  if (s === "At Risk")  return C.critical;
  return C.negative;
}

function deltaLabel(d: number, isGoodWhenPositive = false) {
  const arrow = d > 0 ? "↑" : "↓";
  const color  = isGoodWhenPositive
    ? (d > 0 ? C.positive : C.negative)
    : (d < 0 ? C.positive : C.negative);
  return { arrow, color, text: `${arrow} ${Math.abs(d).toFixed(1)}% vs prior FY` };
}

// ── Custom Recharts Tooltip ───────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { color: string; dataKey: string; name: string; value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p style={{ fontWeight: 700, marginBottom: 4, color: C.text1 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color, margin: "2px 0" }}>
          {p.name}: <strong>{p.value.toLocaleString()} t</strong>
        </p>
      ))}
    </div>
  );
}

// ── Shell Bar ─────────────────────────────────────────────────────────────────
function ShellBar() {
  return (
    <header style={{ background: C.brand, height: 44, display: "flex", alignItems: "center", padding: "0 16px", gap: 12, boxShadow: "0 2px 6px rgba(0,0,0,0.22)", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ background: "white", color: C.brand, fontWeight: 900, fontSize: 13, padding: "3px 8px", borderRadius: 2, letterSpacing: 1 }}>SAP</div>
      <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.3)" }} />
      <span style={{ color: "white", fontSize: 14, fontWeight: 600 }}>Analytics Cloud — Sustainability &amp; Energy Analytics</span>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
        <Bell size={16} color="rgba(255,255,255,0.85)" style={{ cursor: "pointer" }} />
        <Settings size={16} color="rgba(255,255,255,0.85)" style={{ cursor: "pointer" }} />
        <HelpCircle size={16} color="rgba(255,255,255,0.85)" style={{ cursor: "pointer" }} />
        <div style={{ background: "rgba(255,255,255,0.22)", color: "white", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>SC</div>
      </div>
    </header>
  );
}

// ── Page Tabs ─────────────────────────────────────────────────────────────────
function PageTabs({ active, onChange }: { active: string; onChange: (id: string) => void }) {
  return (
    <div style={{ background: C.base0, borderBottom: `1px solid ${C.border}`, display: "flex", padding: "0 16px", overflowX: "auto" }}>
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            padding: "10px 18px",
            fontSize: 12,
            color: active === t.id ? C.brand : C.text2,
            borderBottom: active === t.id ? `2px solid ${C.brand}` : "2px solid transparent",
            fontWeight: active === t.id ? 700 : 400,
            background: "none",
            border: "none",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── Filter Bar ────────────────────────────────────────────────────────────────
function FilterBar({ fy, region, onFYChange, onRegionChange }: {
  fy: FY; region: Region; onFYChange: (v: FY) => void; onRegionChange: (v: Region) => void;
}) {
  const chipStyle: React.CSSProperties = {
    border: `1px solid ${C.brand}`, color: C.brand, padding: "3px 28px 3px 10px",
    borderRadius: 12, fontSize: 11, background: C.brandLt, cursor: "pointer", appearance: "none" as const,
  };
  return (
    <div style={{ background: C.base0, borderBottom: `1px solid ${C.border}`, padding: "8px 16px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <span style={{ fontSize: 11, color: C.text2, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Filters:</span>

      <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
        <select value={fy} onChange={(e) => onFYChange(e.target.value as FY)} style={chipStyle}>
          {FISCAL_YEARS.map((f) => <option key={f}>{f}</option>)}
        </select>
        <ChevronDown size={11} color={C.brand} style={{ position: "absolute", right: 8, pointerEvents: "none" }} />
      </div>

      <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
        <select value={region} onChange={(e) => onRegionChange(e.target.value as Region)} style={chipStyle}>
          {REGIONS.map((r) => <option key={r}>{r}</option>)}
        </select>
        <ChevronDown size={11} color={C.brand} style={{ position: "absolute", right: 8, pointerEvents: "none" }} />
      </div>

      {["Sales Org: Global", "Plant: All"].map((label) => (
        <div key={label} style={{ border: `1px solid ${C.border}`, color: C.text2, padding: "3px 10px", borderRadius: 12, fontSize: 11, background: C.base1, display: "flex", alignItems: "center", gap: 4 }}>
          {label} <ChevronDown size={10} />
        </div>
      ))}

      <div style={{ width: 1, height: 18, background: C.border, margin: "0 4px" }} />

      <div style={{ border: `1px solid ${C.positive}`, color: C.positive, padding: "3px 10px", borderRadius: 12, fontSize: 11, background: C.posLt, display: "flex", alignItems: "center", gap: 4 }}>
        vs. Prior FY <ChevronDown size={10} />
      </div>

      <button style={{ marginLeft: "auto", border: `1px solid ${C.border}`, background: C.base0, color: C.text1, padding: "3px 12px", borderRadius: 4, fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
        <SlidersHorizontal size={11} /> Adapt Filters
      </button>
    </div>
  );
}

// ── KPI Tile ──────────────────────────────────────────────────────────────────
function KpiTile({ label, value, unit, delta, accentColor, isGoodWhenPositive = false }: {
  label: string; value: string; unit: string; delta: number; accentColor: string; isGoodWhenPositive?: boolean;
}) {
  const d = deltaLabel(delta, isGoodWhenPositive);
  return (
    <div style={{ background: C.base0, border: `1px solid ${C.border}`, borderRadius: 4, padding: "14px 16px", borderTop: `3px solid ${accentColor}`, flex: 1, minWidth: 155 }}>
      <div style={{ fontSize: 10, color: C.text2, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 300, color: C.text1, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: C.text2, marginTop: 3 }}>{unit}</div>
      <div style={{ fontSize: 11, marginTop: 7, color: d.color, fontWeight: 600 }}>{d.text}</div>
    </div>
  );
}

// ── Chart Card wrapper ────────────────────────────────────────────────────────
function ChartCard({ title, subtitle, children, style = {} }: { title: string; subtitle: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: C.base0, border: `1px solid ${C.border}`, borderRadius: 4, overflow: "hidden", ...style }}>
      <div style={{ padding: "12px 16px 8px", borderBottom: `1px solid #f0f0f0`, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text1 }}>{title}</div>
          <div style={{ fontSize: 11, color: C.text2, marginTop: 2 }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0, marginLeft: 12 }}>
          <button style={{ border: `1px solid ${C.border}`, background: C.base0, padding: "2px 8px", borderRadius: 3, fontSize: 10, color: C.text2, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <Maximize2 size={9} /> Expand
          </button>
          <button style={{ border: `1px solid ${C.border}`, background: C.base0, padding: "2px 8px", borderRadius: 3, fontSize: 10, color: C.text2, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <Download size={9} /> Export
          </button>
        </div>
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}

// ── Charts ────────────────────────────────────────────────────────────────────
function EmissionsTrendChart() {
  return (
    <ChartCard title="CO₂ Emissions Trend — FY2024 vs FY2023" subtitle="Monthly · Scope 1+2 · All sales regions · tCO₂e" style={{ flex: 2, minWidth: 0 }}>
      <ResponsiveContainer width="100%" height={210}>
        <LineChart data={emissionsTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: C.text2 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: C.text2 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`} />
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11, color: C.text2 }} />
          <Line type="monotone" dataKey="fy24" name="FY2024" stroke={C.brand} strokeWidth={2.5} dot={{ r: 3, fill: C.brand }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="fy23" name="FY2023" stroke={C.border} strokeWidth={1.8} strokeDasharray="5 3" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function EnergyMixChart() {
  return (
    <ChartCard title="Energy Mix" subtitle="Source breakdown · FY2024" style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ position: "relative", width: 180, height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={energyMix} cx="50%" cy="50%" innerRadius={55} outerRadius={82} dataKey="value" startAngle={90} endAngle={-270}>
                {energyMix.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v ?? ""}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.brand }}>68.4%</div>
            <div style={{ fontSize: 10, color: C.text2 }}>Renewable</div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 12px", marginTop: 8 }}>
          {energyMix.map((e) => (
            <div key={e.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.text2 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: e.color }} />
              {e.name} {e.value}%
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

function EmissionsByRegionChart() {
  return (
    <ChartCard title="Emissions by Sales Region" subtitle="tCO₂e · FY2024 vs Target" style={{ flex: 1, minWidth: 0 }}>
      <ResponsiveContainer width="100%" height={190}>
        <BarChart data={emissionsByRegion} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="region" tick={{ fontSize: 10, fill: C.text2 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: C.text2 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
          <Tooltip formatter={(v) => [`${Number(v).toLocaleString()} t`, ""]} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="co2" name="Actual" radius={[2, 2, 0, 0]}>
            {emissionsByRegion.map((e, i) => <Cell key={i} fill={e.color} />)}
          </Bar>
          <Bar dataKey="target" name="Target" fill={C.border} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function LogisticsChart() {
  return (
    <ChartCard title="Logistics Emissions by Transport Mode" subtitle="Distribution & last-mile · SD integration · FY2024" style={{ flex: 1, minWidth: 0 }}>
      <ResponsiveContainer width="100%" height={190}>
        <BarChart data={logisticsModes} layout="vertical" margin={{ top: 0, right: 60, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: C.text2 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
          <YAxis type="category" dataKey="mode" tick={{ fontSize: 11, fill: C.text2 }} axisLine={false} tickLine={false} width={36} />
          <Tooltip formatter={(v) => [`${Number(v).toLocaleString()} t`, "CO₂"]} />
          <Bar dataKey="co2" name="tCO₂e" radius={[0, 2, 2, 0]} label={{ position: "right", fontSize: 10, fill: C.text2, formatter: (v: unknown) => `${(Number(v) / 1000).toFixed(1)}K` }}>
            {logisticsModes.map((m, i) => <Cell key={i} fill={m.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function NetZeroCard() {
  return (
    <ChartCard title="Net Zero Progress" subtitle="Target: 2030 · SAP Climate 21 Programme" style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {netZeroProgress.map((s) => (
          <div key={s.scope}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: C.text2 }}>{s.scope} Reduction</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: s.color }}>{s.pct}%</span>
            </div>
            <div style={{ background: C.base2, borderRadius: 4, height: 8 }}>
              <div style={{ background: s.color, width: `${s.pct}%`, height: 8, borderRadius: 4 }} />
            </div>
          </div>
        ))}
        <div style={{ background: C.brandLt, border: "1px solid #C8D8F0", borderRadius: 4, padding: "10px 14px", textAlign: "center", marginTop: 4 }}>
          <div style={{ fontSize: 10, color: C.text2 }}>Overall ESG Progress to 2030</div>
          <div style={{ fontSize: 24, fontWeight: 300, color: C.brand, lineHeight: 1.2, marginTop: 4 }}>56.3%</div>
          <div style={{ fontSize: 10, color: C.text2 }}>of Net Zero target achieved</div>
        </div>
      </div>
    </ChartCard>
  );
}

// ── Plant Data Table ──────────────────────────────────────────────────────────
function PlantTable({ region }: { region: Region }) {
  const rows = useMemo(
    () => region === "All Regions" ? plantData : plantData.filter((r) => r.region === region),
    [region],
  );

  return (
    <div style={{ background: C.base0, border: `1px solid ${C.border}`, borderRadius: 4, overflow: "hidden", marginTop: 12 }}>
      <div style={{ padding: "12px 16px 8px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text1 }}>Plant-Level Emissions &amp; Energy Report</div>
          <div style={{ fontSize: 11, color: C.text2, marginTop: 2 }}>SAP SD Integration · Distribution Centers · BTP Data Pipeline · FY2024</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["Excel", "PDF", "Settings"].map((a) => (
            <button key={a} style={{ border: `1px solid ${C.border}`, background: C.base0, padding: "2px 8px", borderRadius: 3, fontSize: 10, color: C.text2, cursor: "pointer" }}>{a}</button>
          ))}
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.base1 }}>
              {["Plant / DC", "Sales Org", "Region", "CO₂ (tCO₂e)", "Energy (MWh)", "Renewables %", "vs. Target", "Status"].map((h) => (
                <th key={h} style={{ borderBottom: `2px solid ${C.border}`, padding: "8px 12px", textAlign: "left", fontWeight: 700, color: C.text1, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.3px", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const sc = statusColor(row.status);
              const dc = row.deltaVsTarget < 0 ? C.positive : C.negative;
              return (
                <tr
                  key={row.plant}
                  style={{ borderBottom: `1px solid #f0f0f0`, cursor: "pointer" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "#f5f9ff"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = ""; }}
                >
                  <td style={{ padding: "8px 12px" }}>
                    <div style={{ fontWeight: 600 }}>{row.plant}</div>
                    <div style={{ fontSize: 10, color: C.text2 }}>{row.city}</div>
                  </td>
                  <td style={{ padding: "8px 12px" }}>{row.salesOrg}</td>
                  <td style={{ padding: "8px 12px" }}>{row.region}</td>
                  <td style={{ padding: "8px 12px" }}>{row.co2.toLocaleString()}</td>
                  <td style={{ padding: "8px 12px" }}>{row.energyMwh.toLocaleString()}</td>
                  <td style={{ padding: "8px 12px", fontWeight: 600, color: row.renewablePct >= 70 ? C.positive : row.renewablePct >= 50 ? C.critical : C.negative }}>{row.renewablePct}%</td>
                  <td style={{ padding: "8px 12px", color: dc, fontWeight: 600 }}>
                    {row.deltaVsTarget > 0 ? "↑" : "↓"} {Math.abs(row.deltaVsTarget).toFixed(1)}%
                  </td>
                  <td style={{ padding: "8px 12px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: sc, display: "inline-block" }} />
                      <span style={{ color: sc, fontWeight: 600 }}>{row.status}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div style={{ padding: 32, textAlign: "center", color: C.text2, fontSize: 13 }}>
            No distribution centers found for the selected region.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Architecture Tab ──────────────────────────────────────────────────────────
const ARCH_LAYERS = [
  {
    id: "sources",
    label: "Data Sources",
    color: "#0070F2",
    nodes: [
      { icon: "🏭", title: "SAP S/4HANA", sub: "SD Module", desc: "Sales orders, deliveries, goods movements, transport routes — live transactional data from the SD process chain." },
      { icon: "⚡", title: "IoT / Energy Meters", sub: "Plant Sensors", desc: "Real-time kWh readings from distribution centre smart meters, HVAC, and fleet telemetry via SAP IoT." },
      { icon: "🌍", title: "External ESG Data", sub: "GHG Protocol · CDP", desc: "Scope 3 supplier data from CDP, Ecovadis scorecards, and GHG Protocol emission factors ingested via API." },
    ],
  },
  {
    id: "btp",
    label: "SAP Business Technology Platform",
    color: "#1B62A5",
    badge: "SAP Business Data Cloud",
    badgeColor: "#1B62A5",
    nodes: [
      { icon: "🔗", title: "SAP Integration Suite", sub: "Data Ingestion", desc: "API-M and CPI flows harmonise data from S/4HANA, IoT, and external sources into a canonical ESG data model." },
      { icon: "🧠", title: "SAP HANA Cloud", sub: "In-Memory Compute", desc: "Columnar in-memory engine executes real-time aggregations across billions of sensor and transactional rows." },
      { icon: "🗂️", title: "SAP Datasphere", sub: "Semantic Layer", desc: "Business-layer dimension and measure definitions ensure consistent KPI calculations across all SAC stories." },
    ],
  },
  {
    id: "sac",
    label: "SAP Analytics Cloud",
    color: "#107E3E",
    badge: "SAP SAC Data Analyst  ·  SAP AI Positioning",
    badgeColor: "#107E3E",
    nodes: [
      { icon: "📐", title: "Analytic Models", sub: "Data Models", desc: "Live models built on Datasphere views — measures, dimensions, hierarchies and currency translations pre-defined." },
      { icon: "📖", title: "Stories Engine", sub: "Pages · Widgets · Filters", desc: "Drag-and-drop story pages with KPI tiles, charts, tables, geo maps and input controls linked to live data." },
      { icon: "🤖", title: "Predictive & AI", sub: "Smart Predict · Augmented Analytics", desc: "Auto-forecasts, Smart Insights and Natural Language Query let non-technical executives explore data conversationally." },
    ],
  },
  {
    id: "output",
    label: "Business Output",
    color: "#E9730C",
    nodes: [
      { icon: "📊", title: "Executive Dashboards", sub: "This Application", desc: "Published SAC stories embedded or shared as links — auto-refresh on schedule, role-based access control." },
      { icon: "📋", title: "ESG / CSRD Reports", sub: "Regulatory Compliance", desc: "CSRD-aligned sustainability disclosures generated from SAC stories with audit-trail annotations." },
      { icon: "✅", title: "C-Suite Decisions", sub: "Board · CFO · COO · CSO", desc: "Data-driven decisions on capex, energy contracts, supplier audits and net-zero milestones." },
    ],
  },
];

function ArchitectureTab() {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const nodeW = 140, nodeH = 76, colGap = 80, rowGap = 16;
  const cols = ARCH_LAYERS.length;
  const maxNodes = Math.max(...ARCH_LAYERS.map((l) => l.nodes.length));
  const svgW = cols * nodeW + (cols - 1) * colGap + 80;
  const svgH = maxNodes * nodeH + (maxNodes - 1) * rowGap + 120;
  const colX = (i: number) => 40 + i * (nodeW + colGap);
  const nodeY = (j: number) => 60 + j * (nodeH + rowGap);
  const nodeCX = (i: number) => colX(i) + nodeW / 2;
  const nodeCY = (j: number) => nodeY(j) + nodeH / 2;

  return (
    <div style={{ padding: "8px 0" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: C.text1 }}>SAP Analytics Cloud — System Architecture</div>
        <div style={{ fontSize: 12, color: C.text2, marginTop: 4 }}>
          End-to-end data pipeline: transactional sources → BTP semantic layer → SAC stories → executive decisions.
          Hover any node to see details.
        </div>
      </div>

      {/* Cert Badges */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        {[
          { label: "SAP Business Data Cloud", color: C.brand },
          { label: "SAP SAC Data Analyst", color: C.positive },
          { label: "SAP AI Positioning", color: C.positive },
        ].map((b) => (
          <span key={b.label} style={{ background: b.color, color: "white", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 12, letterSpacing: "0.3px" }}>
            🎓 {b.label}
          </span>
        ))}
      </div>

      {/* SVG Diagram */}
      <div style={{ background: C.base0, border: `1px solid ${C.border}`, borderRadius: 6, overflowX: "auto", padding: 16, position: "relative" }}>
        <svg width={svgW} height={svgH} style={{ display: "block", minWidth: svgW }}>
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill={C.brand} opacity="0.6" />
            </marker>
          </defs>

          {/* Layer column headers */}
          {ARCH_LAYERS.map((layer, i) => (
            <g key={layer.id}>
              <rect x={colX(i)} y={4} width={nodeW} height={22} rx={4} fill={layer.color} opacity={0.12} />
              <text x={colX(i) + nodeW / 2} y={19} textAnchor="middle" fontSize={10} fontWeight={700} fill={layer.color}>
                {layer.label.toUpperCase()}
              </text>
            </g>
          ))}

          {/* Arrows between columns */}
          {ARCH_LAYERS.slice(0, -1).map((layer, i) =>
            layer.nodes.map((_, j) =>
              ARCH_LAYERS[i + 1].nodes.map((__, k) => {
                if (j !== k) return null; // only connect same-row nodes
                return (
                  <line
                    key={`${i}-${j}-${k}`}
                    x1={colX(i) + nodeW}
                    y1={nodeCY(j)}
                    x2={colX(i + 1)}
                    y2={nodeCY(k)}
                    stroke={C.brand}
                    strokeWidth={1.5}
                    strokeOpacity={0.35}
                    markerEnd="url(#arrow)"
                  />
                );
              })
            )
          )}

          {/* Nodes */}
          {ARCH_LAYERS.map((layer, i) =>
            layer.nodes.map((node, j) => (
              <g
                key={`${i}-${j}`}
                style={{ cursor: "pointer" }}
                onMouseEnter={(e) => {
                  const rect = (e.currentTarget as SVGGElement).getBoundingClientRect();
                  setTooltip({ text: node.desc, x: rect.left + rect.width / 2, y: rect.top });
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                <rect x={colX(i)} y={nodeY(j)} width={nodeW} height={nodeH} rx={5} fill="white" stroke={C.border} strokeWidth={1} />
                <rect x={colX(i)} y={nodeY(j)} width={nodeW} height={3} rx={2} fill={layer.color} />
                <text x={colX(i) + 10} y={nodeY(j) + 20} fontSize={17}>{node.icon}</text>
                <text x={colX(i) + 34} y={nodeY(j) + 22} fontSize={11} fontWeight={700} fill={C.text1}>{node.title}</text>
                <text x={colX(i) + 10} y={nodeY(j) + 38} fontSize={9} fill={C.text2}>{node.sub}</text>
                <foreignObject x={colX(i) + 8} y={nodeY(j) + 44} width={nodeW - 16} height={28}>
                  <div style={{ fontSize: 9, color: C.text2, lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {node.desc.split(".")[0]}.
                  </div>
                </foreignObject>
              </g>
            ))
          )}

          {/* Badge labels under BTP and SAC columns */}
          {ARCH_LAYERS.map((layer, i) =>
            layer.badge ? (
              <g key={`badge-${i}`}>
                <rect x={colX(i) + 4} y={svgH - 38} width={nodeW - 8} height={20} rx={10} fill={layer.badgeColor} opacity={0.12} />
                <text x={colX(i) + nodeW / 2} y={svgH - 24} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={layer.badgeColor}>
                  🎓 {layer.badge}
                </text>
              </g>
            ) : null
          )}
        </svg>

        {/* Tooltip portal */}
        {tooltip && (
          <div style={{
            position: "fixed", left: tooltip.x, top: tooltip.y - 8,
            transform: "translate(-50%, -100%)",
            background: C.text1, color: "white", fontSize: 11, padding: "8px 12px",
            borderRadius: 5, maxWidth: 260, zIndex: 999, lineHeight: 1.5,
            boxShadow: "0 4px 16px rgba(0,0,0,0.25)", pointerEvents: "none",
          }}>
            {tooltip.text}
            <div style={{ position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: `6px solid ${C.text1}` }} />
          </div>
        )}
      </div>

      {/* Layer Legend */}
      <div style={{ display: "flex", gap: 24, marginTop: 14, flexWrap: "wrap" }}>
        {ARCH_LAYERS.map((l) => (
          <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, color: C.text2 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Stories Tab ───────────────────────────────────────────────────────────────
const STORY_FLOW = [
  { icon: "📊", title: "Story Page Published", sub: "Daily auto-refresh from SAP BTP live data connection", color: C.brand },
  { icon: "🔍", title: "Smart Insight Generated", sub: "SAC AI surfaces top variance automatically (e.g. LATAM ↑5.4%)", color: "#0070F2" },
  { icon: "📌", title: "Analyst Annotates", sub: "Comment pinned to chart: 'Grid outage caused spike — vendor notified'", color: "#6A6D70" },
  { icon: "📤", title: "Scheduled Broadcast", sub: "Story exported to PDF + MS Teams alert every Monday 07:00", color: C.critical },
  { icon: "👔", title: "C-Suite Reviews", sub: "COO, CFO, CSO each receive role-filtered story page link", color: C.brand },
  { icon: "✅", title: "Decision Made", sub: "Board approves LATAM renewable capex · Pauses coal supplier contracts", color: C.positive },
];

const STORY_PRACTICES = [
  { ok: true,  text: "One story page per audience (COO · CFO · CSO)" },
  { ok: true,  text: "Top-left KPIs answer 'so what?' in under 5 seconds" },
  { ok: true,  text: "Every chart drills through to plant-level detail" },
  { ok: true,  text: "Smart Insights widget on every page for AI-generated commentary" },
  { ok: true,  text: "Scheduled broadcast to MS Teams / email (Monday 07:00)" },
  { ok: true,  text: "CSRD compliance annotations embedded in story comments" },
  { ok: false, text: "Avoid static screenshots — always use live data models" },
  { ok: false, text: "Never mix audiences on one page — filter bar won't save you" },
];

function StoriesTab() {
  return (
    <div style={{ padding: "8px 0" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: C.text1 }}>How SAC Stories Drive C-Suite Decisions</div>
        <div style={{ fontSize: 12, color: C.text2, marginTop: 4 }}>
          A Story is SAC's publishing format — an interactive, multi-page report built on live analytic models. Each page targets one audience and tells one story.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr", gap: 16, alignItems: "start" }}>

        {/* Column 1: Story Anatomy annotated mockup */}
        <div style={{ background: C.base0, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
          <div style={{ background: C.base1, borderBottom: `1px solid ${C.border}`, padding: "10px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text1 }}>📐 Story Anatomy</div>
            <div style={{ fontSize: 10, color: C.text2, marginTop: 2 }}>What each element does inside a SAC Story</div>
          </div>
          <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 0 }}>

            {/* Mini shell */}
            <div style={{ background: C.brand, borderRadius: "4px 4px 0 0", padding: "6px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: "white", fontSize: 10, fontWeight: 700 }}>SAP · Sustainability Story Q4</span>
              <span style={{ background: "rgba(255,255,255,0.2)", color: "white", fontSize: 9, padding: "1px 6px", borderRadius: 8 }}>Published</span>
            </div>
            <CalloutRow label="① Story Title & Published Version" color={C.brand} />

            {/* Mini tabs */}
            <div style={{ background: "#f0f0f0", display: "flex", gap: 0, borderBottom: `1px solid ${C.border}` }}>
              {["Overview", "Energy", "Logistics"].map((t, i) => (
                <div key={t} style={{ padding: "4px 10px", fontSize: 9, color: i === 0 ? C.brand : C.text2, borderBottom: i === 0 ? `2px solid ${C.brand}` : "2px solid transparent", fontWeight: i === 0 ? 700 : 400 }}>{t}</div>
              ))}
            </div>
            <CalloutRow label="② Story Pages (one per audience)" color="#0070F2" />

            {/* Mini filter */}
            <div style={{ background: C.base1, padding: "4px 8px", display: "flex", gap: 6, borderBottom: `1px solid ${C.border}` }}>
              {["FY 2024 ▾", "EMEA ▾", "All Plants ▾"].map((f) => (
                <div key={f} style={{ border: `1px solid ${C.brand}`, color: C.brand, fontSize: 9, padding: "1px 6px", borderRadius: 8, background: C.brandLt }}>{f}</div>
              ))}
            </div>
            <CalloutRow label="③ Story Filters (drive all widgets)" color={C.critical} />

            {/* Mini KPI row */}
            <div style={{ display: "flex", gap: 4, padding: "6px 8px", borderBottom: `1px solid ${C.border}` }}>
              {[["42.8K", "CO₂ tCO₂e", C.brand], ["68.4%", "Renewable", C.positive], ["78/100", "ESG Score", "#0070F2"]].map(([v, l, col]) => (
                <div key={l} style={{ flex: 1, background: C.base1, borderRadius: 3, padding: "5px 6px", borderTop: `2px solid ${col}` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: col }}>{v}</div>
                  <div style={{ fontSize: 8, color: C.text2 }}>{l}</div>
                </div>
              ))}
            </div>
            <CalloutRow label="④ Smart KPI Widgets (variance + sparkline)" color={C.positive} />

            {/* Mini chart placeholder */}
            <div style={{ margin: "6px 8px", background: C.base1, borderRadius: 3, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 9, color: C.text2 }}>📈 Chart Widget — linked to Analytic Model</span>
            </div>
            <CalloutRow label="⑤ Chart Widget (drill-through to plant level)" color={C.text2} />
          </div>
        </div>

        {/* Column 2: Story → Decision Flow */}
        <div style={{ background: C.base0, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
          <div style={{ background: C.base1, borderBottom: `1px solid ${C.border}`, padding: "10px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text1 }}>🔄 Story → Decision Flow</div>
            <div style={{ fontSize: 10, color: C.text2, marginTop: 2 }}>How insight becomes board-level action</div>
          </div>
          <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 0 }}>
            {STORY_FLOW.map((step, i) => (
              <div key={i}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: step.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                    {step.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.text1 }}>{step.title}</div>
                    <div style={{ fontSize: 10, color: C.text2, marginTop: 2, lineHeight: 1.4 }}>{step.sub}</div>
                  </div>
                </div>
                {i < STORY_FLOW.length - 1 && (
                  <div style={{ display: "flex", gap: 10, marginTop: 0 }}>
                    <div style={{ width: 32, display: "flex", justifyContent: "center" }}>
                      <div style={{ width: 2, height: 20, background: C.border }} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Best Practices */}
        <div style={{ background: C.base0, border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
          <div style={{ background: C.base1, borderBottom: `1px solid ${C.border}`, padding: "10px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text1 }}>✅ Story Design Principles</div>
            <div style={{ fontSize: 10, color: C.text2, marginTop: 2 }}>SAP SAC Data Analyst best practices for executive stories</div>
          </div>
          <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {STORY_PRACTICES.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: p.ok ? C.positive : "#ffeaea", color: p.ok ? "white" : C.negative, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0, fontWeight: 700, marginTop: 1 }}>
                  {p.ok ? "✓" : "✗"}
                </div>
                <div style={{ fontSize: 11, color: C.text1, lineHeight: 1.5 }}>{p.text}</div>
              </div>
            ))}

            {/* Cert callout */}
            <div style={{ marginTop: 6, background: C.brandLt, border: `1px solid #C8D8F0`, borderRadius: 5, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.brand, marginBottom: 6 }}>🎓 Applied Certifications</div>
              {[
                ["SAP SAC Data Analyst", "Story design, analytic models, KPI tiles, Smart Insights"],
                ["SAP AI Positioning", "Augmented analytics, NLQ, Smart Predict forecasting"],
                ["SAP Business Data Cloud", "Datasphere semantic layer, BTP pipeline, live connections"],
              ].map(([cert, detail]) => (
                <div key={cert} style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.brand }}>{cert}</div>
                  <div style={{ fontSize: 10, color: C.text2 }}>{detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Helper: callout annotation row used in Story Anatomy
function CalloutRow({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", background: `${color}0d`, borderLeft: `3px solid ${color}`, marginBottom: 2 }}>
      <span style={{ fontSize: 9, color, fontWeight: 600 }}>{label}</span>
    </div>
  );
}

// ── Coming Soon placeholder ───────────────────────────────────────────────────
function ComingSoon({ tab }: { tab: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 340, gap: 12, color: C.text2 }}>
      <div style={{ fontSize: 48 }}>📐</div>
      <div style={{ fontSize: 20, fontWeight: 300, color: C.text1 }}>{tab}</div>
      <div style={{ fontSize: 13 }}>Story page — drill-through from Executive Overview</div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [region, setRegion] = useState<Region>("All Regions");
  const [fy, setFY] = useState<FY>("FY 2024");

  const kpi = kpis[region];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <ShellBar />
      <PageTabs active={activeTab} onChange={setActiveTab} />
      <FilterBar fy={fy} region={region} onFYChange={setFY} onRegionChange={setRegion} />

      <main style={{ flex: 1, padding: 16, maxWidth: 1400, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        {activeTab === "overview" && (
          <>
            {/* KPI Row */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
              <KpiTile {...kpi.co2}       accentColor={C.brand}    delta={kpi.co2.delta}      />
              <KpiTile {...kpi.renewable} accentColor={C.positive} delta={kpi.renewable.delta} isGoodWhenPositive />
              <KpiTile {...kpi.intensity} accentColor={C.critical} delta={kpi.intensity.delta} />
              <KpiTile {...kpi.esg}       accentColor={C.accent}   delta={kpi.esg.delta}       isGoodWhenPositive />
              <KpiTile {...kpi.scope3}    accentColor={C.negative} delta={kpi.scope3.delta}    />
            </div>

            {/* Trend + Donut */}
            <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
              <EmissionsTrendChart />
              <EnergyMixChart />
            </div>

            {/* Region + Logistics + Net Zero */}
            <div style={{ display: "flex", gap: 12, marginBottom: 0, flexWrap: "wrap" }}>
              <EmissionsByRegionChart />
              <LogisticsChart />
              <NetZeroCard />
            </div>

            <PlantTable region={region} />
          </>
        )}

        {activeTab === "architecture" && <ArchitectureTab />}
        {activeTab === "stories"      && <StoriesTab />}
        {activeTab === "energy"       && <ComingSoon tab="⚡ Energy Consumption" />}
        {activeTab === "emissions"    && <ComingSoon tab="🌍 Emissions by Region" />}
        {activeTab === "logistics"    && <ComingSoon tab="🚛 Logistics & Distribution" />}
        {activeTab === "retail"       && <ComingSoon tab="📦 Retail Operations" />}
        {activeTab === "targets"      && <ComingSoon tab="🎯 ESG Targets" />}
      </main>

      <footer style={{ background: C.base0, borderTop: `1px solid ${C.border}`, padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 10, color: C.text2, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ background: C.brandLt, color: C.brand, border: "1px solid #C8D8F0", padding: "2px 8px", borderRadius: 3, fontWeight: 700 }}>SAP SAC 2024.Q4</span>
          <span>Last refreshed: 27 Mar 2026, 09:14 UTC</span>
          <span>·</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <RefreshCw size={10} /> Data Source: S/4HANA · SAP BTP · SAP Business Data Cloud
          </span>
        </div>
        <span>© 2024 SAP SE · Sidd Chauhan · Sustainability Analytics Story</span>
      </footer>
    </div>
  );
}
