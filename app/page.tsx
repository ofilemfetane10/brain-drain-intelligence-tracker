'use client'
import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, LineChart, Line, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Legend
} from 'recharts'

interface CountryDrainData {
  country: string; iso: string; subregion: string
  physiciansPer100k: number; nursesPer100k: number
  emigrationRatePhysicians: number; emigrationRateNurses: number
  estimatedPhysiciansAbroad: number; topDestinations: string[]
  drainIndex: number; severity: string; trend: string; annualNetLoss: number
}
interface MigrationCorridor {
  origin: string; destination: string; estimatedStock: number
  shareOfOriginTrained: number; primarySpecialties: string[]; yearEstimate: number
}
interface EUReceivingData {
  country: string; foreignTrainedPhysiciansTotal: number
  fromAfricaEstimate: number; fromAfricaPercent: number; topAfricanSources: string[]
}
interface SummaryStats {
  totalPhysiciansAbroad: number; totalNursesAbroad: number
  estimatedAnnualLoss: number; averageDrainIndex: number
  criticalCountries: number; euReceivingTotal: number
  gdpEquivalentLoss: string; yearsToReachWHOThreshold: number
}

export default function BrainDrainDashboard() {
  const [countryData, setCountryData] = useState<CountryDrainData[]>([])
  const [corridors, setCorridors] = useState<MigrationCorridor[]>([])
  const [euData, setEuData] = useState<EUReceivingData[]>([])
  const [stats, setStats] = useState<SummaryStats | null>(null)
  const [selected, setSelected] = useState<CountryDrainData | null>(null)
  const [activeTab, setActiveTab] = useState<'countries'|'corridors'|'eu'>('countries')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(d => {
      setCountryData(d.countryData)
      setCorridors(d.migrationCorridors)
      setEuData(d.euReceivingData)
      setStats(d.summaryStats)
      setSelected(d.countryData[0])
      setLoaded(true)
    })
  }, [])

  const severityColor = (s: string) => {
    if (s === 'critical') return '#e84040'
    if (s === 'severe') return '#f5a623'
    if (s === 'moderate') return '#2d7dd2'
    return '#1ab8a0'
  }

  const trendIcon = (t: string) => t === 'accelerating' ? '↑' : t === 'improving' ? '↓' : '→'
  const trendColor = (t: string) => t === 'accelerating' ? '#e84040' : t === 'improving' ? '#1ab8a0' : '#8fa3b8'

  if (!loaded) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg-void)' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontFamily:'Space Mono', color:'var(--accent-amber)', fontSize:'0.75rem', letterSpacing:'0.2em', marginBottom:'16px' }}>LOADING INTELLIGENCE DATA</div>
        <div style={{ width:'200px', height:'2px', background:'var(--bg-elevated)', borderRadius:'2px', overflow:'hidden' }}>
          <div style={{ height:'100%', background:'var(--accent-amber)', animation:'loadBar 1.5s ease infinite', width:'60%' }}></div>
        </div>
      </div>
    </div>
  )

  const sortedCountries = [...countryData].sort((a,b) => b.drainIndex - a.drainIndex)

  return (
    <div style={{ position:'relative', zIndex:1, minHeight:'100vh' }}>

      {/* Header */}
      <header style={{ borderBottom:'1px solid var(--border-subtle)', padding:'24px 40px', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div className="section-label" style={{ marginBottom:'8px' }}>AU Health Intelligence · 02</div>
          <h1 style={{ fontSize:'1.6rem', fontWeight:800, letterSpacing:'-0.02em', lineHeight:1.1 }}>
            Brain Drain Intelligence Tracker
          </h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'0.85rem', marginTop:'6px', maxWidth:'520px' }}>
            Health workforce emigration flows from African Union member states to European health systems — physician and nurse stock, migration corridors, and systemic deficit analysis.
          </p>
        </div>
        <div style={{ textAlign:'right' }}>
          <div className="section-label">Reference Year</div>
          <div className="number-display" style={{ fontSize:'1.4rem', fontWeight:700 }}>2022</div>
          <div style={{ color:'var(--text-muted)', fontSize:'0.7rem', marginTop:'4px' }}>WHO NHWA · World Bank · OECD</div>
        </div>
      </header>

      {/* KPI Row */}
      {stats && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1px', background:'var(--border-subtle)', borderBottom:'1px solid var(--border-subtle)' }}>
          {[
            { label:'Physicians Abroad', value: stats.totalPhysiciansAbroad.toLocaleString(), unit:'estimated', color:'var(--accent-red)' },
            { label:'Annual Net Loss', value: stats.estimatedAnnualLoss.toLocaleString(), unit:'physicians/year', color:'var(--accent-amber)' },
            { label:'To EU Systems', value: stats.euReceivingTotal.toLocaleString(), unit:'currently working', color:'var(--accent-blue)' },
            { label:'GDP Equivalent Loss', value: stats.gdpEquivalentLoss, unit:'training investment', color:'var(--accent-teal)' },
          ].map((k, i) => (
            <div key={i} style={{ background:'var(--bg-surface)', padding:'20px 28px' }}>
              <div className="section-label" style={{ marginBottom:'8px' }}>{k.label}</div>
              <div style={{ fontFamily:'Space Mono', fontSize:'1.8rem', fontWeight:700, color:k.color, lineHeight:1 }}>{k.value}</div>
              <div style={{ color:'var(--text-muted)', fontSize:'0.7rem', marginTop:'6px' }}>{k.unit}</div>
            </div>
          ))}
        </div>
      )}

      {/* Alert Banner */}
      <div style={{ background:'rgba(232,64,64,0.08)', borderBottom:'1px solid rgba(232,64,64,0.2)', padding:'10px 40px', display:'flex', alignItems:'center', gap:'12px' }}>
        <div className="pulse-red" style={{ width:'8px', height:'8px', borderRadius:'50%', background:'var(--accent-red)', flexShrink:0 }}></div>
        <span style={{ fontFamily:'Space Mono', fontSize:'0.7rem', color:'var(--accent-red)', letterSpacing:'0.08em' }}>
          {stats?.criticalCountries} COUNTRIES AT CRITICAL DRAIN THRESHOLD · WHO minimum of 44.5 health workers per 10,000 population unreachable within current trajectory · Sub-Saharan Africa projected deficit: 6.1M workers by 2030
        </span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'340px 1fr', gap:'0', minHeight:'calc(100vh - 280px)' }}>

        {/* Sidebar — Country List */}
        <div style={{ borderRight:'1px solid var(--border-subtle)', overflowY:'auto', maxHeight:'calc(100vh - 280px)' }}>
          <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border-subtle)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span className="section-label">Countries · {countryData.length}</span>
            <span style={{ fontFamily:'Space Mono', fontSize:'0.65rem', color:'var(--text-muted)' }}>sorted by drain index</span>
          </div>
          {sortedCountries.map((c) => (
            <div
              key={c.iso}
              onClick={() => setSelected(c)}
              style={{
                padding:'14px 20px',
                borderBottom:'1px solid var(--border-subtle)',
                cursor:'pointer',
                background: selected?.iso === c.iso ? 'var(--bg-elevated)' : 'transparent',
                borderLeft: selected?.iso === c.iso ? '3px solid var(--accent-amber)' : '3px solid transparent',
                transition:'all 0.15s ease'
              }}
            >
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'6px' }}>
                <span style={{ fontWeight:600, fontSize:'0.875rem' }}>{c.country}</span>
                <span style={{ fontFamily:'Space Mono', fontSize:'0.75rem', color:severityColor(c.severity), fontWeight:700 }}>{c.drainIndex}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{c.subregion}</span>
                <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
                  <span className="tag" style={{ background:`${severityColor(c.severity)}18`, color:severityColor(c.severity), border:`1px solid ${severityColor(c.severity)}40`, fontSize:'0.6rem', padding:'1px 6px' }}>{c.severity}</span>
                  <span style={{ color:trendColor(c.trend), fontSize:'0.8rem' }}>{trendIcon(c.trend)}</span>
                </div>
              </div>
              <div style={{ marginTop:'8px', height:'2px', background:'var(--bg-void)', borderRadius:'1px' }}>
                <div style={{ height:'100%', width:`${c.drainIndex}%`, background:`linear-gradient(90deg, ${severityColor(c.severity)}, ${severityColor(c.severity)}88)`, borderRadius:'1px', transition:'width 0.6s ease' }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Panel */}
        <div style={{ padding:'28px 32px', overflowY:'auto' }}>

          {/* Tabs */}
          <div style={{ display:'flex', gap:'0', borderBottom:'1px solid var(--border-subtle)', marginBottom:'28px' }}>
            {(['countries','corridors','eu'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding:'10px 20px',
                  background:'transparent',
                  border:'none',
                  borderBottom: activeTab === tab ? '2px solid var(--accent-amber)' : '2px solid transparent',
                  color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontFamily:'Space Mono',
                  fontSize:'0.7rem',
                  letterSpacing:'0.1em',
                  textTransform:'uppercase',
                  cursor:'pointer',
                  transition:'all 0.15s ease'
                }}
              >
                {tab === 'countries' ? 'Country Analysis' : tab === 'corridors' ? 'Migration Corridors' : 'EU Reception'}
              </button>
            ))}
          </div>

          {/* Country Analysis Tab */}
          {activeTab === 'countries' && selected && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px' }}>
                <div>
                  <h2 style={{ fontSize:'1.4rem', fontWeight:800, marginBottom:'4px' }}>{selected.country}</h2>
                  <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                    <span className="tag" style={{ background:`${severityColor(selected.severity)}18`, color:severityColor(selected.severity), border:`1px solid ${severityColor(selected.severity)}40` }}>{selected.severity} drain</span>
                    <span style={{ color:trendColor(selected.trend), fontFamily:'Space Mono', fontSize:'0.75rem' }}>{trendIcon(selected.trend)} {selected.trend}</span>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div className="section-label">Drain Index</div>
                  <div style={{ fontFamily:'Space Mono', fontSize:'2.5rem', fontWeight:700, color:severityColor(selected.severity), lineHeight:1 }}>{selected.drainIndex}</div>
                  <div style={{ color:'var(--text-muted)', fontSize:'0.65rem' }}>/100 composite</div>
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px', marginBottom:'24px' }}>
                {[
                  { label:'Physicians / 100k', value: selected.physiciansPer100k, unit:'', benchmark:'WHO min: 44.5', color:'var(--accent-red)' },
                  { label:'Emigration Rate', value:`${selected.emigrationRatePhysicians}%`, unit:'of trained physicians', benchmark:'', color:'var(--accent-amber)' },
                  { label:'Annual Net Loss', value: selected.annualNetLoss.toLocaleString(), unit:'physicians/year', benchmark:'', color:'var(--accent-blue)' },
                ].map((s,i) => (
                  <div key={i} className="card" style={{ padding:'16px' }}>
                    <div className="section-label" style={{ marginBottom:'6px' }}>{s.label}</div>
                    <div style={{ fontFamily:'Space Mono', fontSize:'1.5rem', fontWeight:700, color:s.color }}>{s.value}</div>
                    <div style={{ color:'var(--text-muted)', fontSize:'0.65rem', marginTop:'4px' }}>{s.unit || s.benchmark}</div>
                  </div>
                ))}
              </div>

              {/* Workforce vs WHO Threshold Chart */}
              <div className="card" style={{ padding:'20px', marginBottom:'20px' }}>
                <div className="section-label" style={{ marginBottom:'16px' }}>Health Worker Density vs WHO Universal Health Coverage Threshold</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { name: 'Physicians', actual: selected.physiciansPer100k, threshold: 44.5 },
                    { name: 'Nurses', actual: selected.nursesPer100k, threshold: 44.5 },
                  ]} margin={{ top:0, right:0, left:-20, bottom:0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                    <XAxis dataKey="name" tick={{ fill:'var(--text-secondary)', fontSize:11, fontFamily:'Space Mono' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill:'var(--text-muted)', fontSize:10, fontFamily:'Space Mono' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background:'var(--bg-card)', border:'1px solid var(--border-mid)', borderRadius:'2px', fontFamily:'Space Mono', fontSize:'11px', color:'var(--text-primary)' }} />
                    <Bar dataKey="actual" fill="var(--accent-amber)" name="Actual" radius={[2,2,0,0]} />
                    <Bar dataKey="threshold" fill="rgba(232,64,64,0.3)" name="WHO Threshold" radius={[2,2,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top Destinations */}
              <div className="card" style={{ padding:'20px' }}>
                <div className="section-label" style={{ marginBottom:'16px' }}>Primary Emigration Destinations</div>
                <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                  {selected.topDestinations.map((dest, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                      <div style={{ fontFamily:'Space Mono', fontSize:'0.65rem', color:'var(--text-muted)', width:'16px' }}>0{i+1}</div>
                      <div style={{ flex:1, height:'2px', background:'var(--bg-void)', borderRadius:'1px', position:'relative', overflow:'hidden' }}>
                        <div className="flow-line" style={{ height:'100%', width:`${90 - i*15}%`, background:`linear-gradient(90deg, var(--accent-amber), var(--accent-blue))`, borderRadius:'1px' }}></div>
                      </div>
                      <div style={{ fontSize:'0.8rem', fontWeight:500, minWidth:'140px' }}>{dest}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Migration Corridors Tab */}
          {activeTab === 'corridors' && (
            <div>
              <div style={{ marginBottom:'24px' }}>
                <h2 style={{ fontSize:'1.1rem', fontWeight:700, marginBottom:'4px' }}>Africa → EU Migration Corridors</h2>
                <p style={{ color:'var(--text-secondary)', fontSize:'0.8rem' }}>Estimated stock of African-trained physicians currently working in EU/EEA health systems by origin-destination pair</p>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
                {[...corridors].sort((a,b) => b.estimatedStock - a.estimatedStock).map((c,i) => (
                  <div key={i} className="card" style={{ padding:'16px 20px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                        <span style={{ fontWeight:700, color:'var(--accent-red)' }}>{c.origin}</span>
                        <span style={{ color:'var(--text-muted)', fontSize:'0.75rem' }}>→</span>
                        <span style={{ fontWeight:700, color:'var(--accent-blue)' }}>{c.destination}</span>
                      </div>
                      <div style={{ display:'flex', gap:'16px', alignItems:'center' }}>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontFamily:'Space Mono', fontSize:'1rem', fontWeight:700, color:'var(--accent-amber)' }}>{c.estimatedStock.toLocaleString()}</div>
                          <div style={{ color:'var(--text-muted)', fontSize:'0.65rem' }}>physicians abroad</div>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontFamily:'Space Mono', fontSize:'1rem', fontWeight:700, color:'var(--accent-red)' }}>{c.shareOfOriginTrained}%</div>
                          <div style={{ color:'var(--text-muted)', fontSize:'0.65rem' }}>of origin-trained</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ height:'3px', background:'var(--bg-void)', borderRadius:'2px', marginBottom:'10px' }}>
                      <div style={{ height:'100%', width:`${(c.estimatedStock / 9200) * 100}%`, background:`linear-gradient(90deg, var(--accent-red), var(--accent-amber))`, borderRadius:'2px', transition:'width 0.8s ease' }}></div>
                    </div>
                    <div style={{ display:'flex', gap:'6px' }}>
                      {c.primarySpecialties.map((s,j) => (
                        <span key={j} style={{ fontFamily:'Space Mono', fontSize:'0.6rem', padding:'2px 6px', background:'var(--bg-void)', color:'var(--text-muted)', borderRadius:'2px', border:'1px solid var(--border-subtle)' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EU Reception Tab */}
          {activeTab === 'eu' && (
            <div>
              <div style={{ marginBottom:'24px' }}>
                <h2 style={{ fontSize:'1.1rem', fontWeight:700, marginBottom:'4px' }}>EU Health Systems — African Workforce Reception</h2>
                <p style={{ color:'var(--text-secondary)', fontSize:'0.8rem' }}>Foreign-trained physician stock in EU member states with African origin estimates — OECD Health Statistics 2023</p>
              </div>
              <div className="card" style={{ padding:'20px', marginBottom:'20px' }}>
                <div className="section-label" style={{ marginBottom:'16px' }}>African-origin physicians by EU receiving country</div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={euData} margin={{ top:0, right:20, left:-10, bottom:20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                    <XAxis dataKey="country" tick={{ fill:'var(--text-secondary)', fontSize:10, fontFamily:'Space Mono' }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" />
                    <YAxis tick={{ fill:'var(--text-muted)', fontSize:10, fontFamily:'Space Mono' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background:'var(--bg-card)', border:'1px solid var(--border-mid)', borderRadius:'2px', fontFamily:'Space Mono', fontSize:'11px', color:'var(--text-primary)' }} />
                    <Bar dataKey="fromAfricaEstimate" fill="var(--accent-blue)" name="From Africa" radius={[2,2,0,0]} />
                    <Bar dataKey="foreignTrainedPhysiciansTotal" fill="rgba(45,125,210,0.2)" name="Total Foreign-trained" radius={[2,2,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
                {[...euData].sort((a,b) => b.fromAfricaEstimate - a.fromAfricaEstimate).map((e,i) => (
                  <div key={i} className="card" style={{ padding:'16px 20px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
                      <span style={{ fontWeight:700 }}>{e.country}</span>
                      <div style={{ display:'flex', gap:'16px' }}>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontFamily:'Space Mono', fontSize:'0.95rem', fontWeight:700, color:'var(--accent-blue)' }}>{e.fromAfricaEstimate.toLocaleString()}</div>
                          <div style={{ color:'var(--text-muted)', fontSize:'0.6rem' }}>from Africa</div>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontFamily:'Space Mono', fontSize:'0.95rem', fontWeight:700, color:'var(--accent-amber)' }}>{e.fromAfricaPercent}%</div>
                          <div style={{ color:'var(--text-muted)', fontSize:'0.6rem' }}>of foreign-trained</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                      {e.topAfricanSources.map((s,j) => (
                        <span key={j} style={{ fontFamily:'Space Mono', fontSize:'0.6rem', padding:'2px 6px', background:'rgba(45,125,210,0.1)', color:'var(--accent-blue)', borderRadius:'2px', border:'1px solid rgba(45,125,210,0.2)' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop:'1px solid var(--border-subtle)', padding:'16px 40px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', gap:'20px' }}>
          {['WHO NHWA 2022','World Bank HNP 2023','OECD Health Statistics 2023','Africa CDC Workforce Report 2022'].map((s,i) => (
            <span key={i} style={{ fontFamily:'Space Mono', fontSize:'0.6rem', color:'var(--text-muted)' }}>{s}</span>
          ))}
        </div>
        <span style={{ fontFamily:'Space Mono', fontSize:'0.6rem', color:'var(--text-muted)' }}>AU Health Intelligence · Ofile Mfetane</span>
      </footer>
    </div>
  )
}
