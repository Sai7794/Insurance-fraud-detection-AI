import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, AlertTriangle, CheckCircle, Search, Filter, Info, ChevronDown } from "lucide-react";

interface Provider {
  id: number;
  provider_name: string;
  location: string;
  policy_type: string;
  claim_approval_rate: number;
  claim_rejection_rate: number;
  complaints_last_year: number;
  legal_cases: number;
  customer_rating: number;
  average_settlement_days: number;
  riskScore: number;
  riskLevel: string;
  explanation: string;
}

export default function App() {
  const [locations, setLocations] = useState<string[]>([]);
  const [policyTypes, setPolicyTypes] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedPolicyType, setSelectedPolicyType] = useState("");
  const [results, setResults] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    fetch("/api/filters")
      .then((res) => res.json())
      .then((data) => {
        setLocations(data.locations);
        setPolicyTypes(data.policyTypes);
      });
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    
    const params = new URLSearchParams();
    if (selectedLocation) params.append("location", selectedLocation);
    if (selectedPolicyType) params.append("policyType", selectedPolicyType);

    try {
      const res = await fetch(`/api/results?${params.toString()}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "High Risk": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "Medium Risk": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "Low Risk": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      default: return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "High Risk": return <AlertTriangle className="w-4 h-4" />;
      case "Medium Risk": return <Info className="w-4 h-4" />;
      case "Low Risk": return <CheckCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-6"
          >
            <Shield className="w-3 h-3" />
            <span>AI-POWERED FRAUD DETECTION ENGINE</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
          >
            INSURANCE FRAUD <br /> DETECTION AI
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Analyze insurance providers using our weighted risk algorithm. 
            Identify potential fraud patterns and settlement anomalies in real-time.
          </motion.p>
        </header>

        {/* Search Form */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <form 
            onSubmit={handleSearch}
            className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-500 uppercase tracking-widest ml-1">Policy Type</label>
                <div className="relative">
                  <select 
                    value={selectedPolicyType}
                    onChange={(e) => setSelectedPolicyType(e.target.value)}
                    className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl px-5 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all cursor-pointer"
                  >
                    <option value="">All Policy Types</option>
                    {policyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-500 uppercase tracking-widest ml-1">Location</label>
                <div className="relative">
                  <select 
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full h-14 bg-black/40 border border-white/10 rounded-2xl px-5 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all cursor-pointer"
                  >
                    <option value="">All Locations</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 text-black font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>RUN RISK ANALYSIS</span>
                </>
              )}
            </button>
          </form>
        </motion.section>

        {/* Results */}
        <AnimatePresence mode="wait">
          {hasSearched && (
            <motion.section 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Filter className="w-5 h-5 text-emerald-500" />
                  Analysis Results
                  <span className="text-sm font-normal text-gray-500 ml-2">({results.length} providers found)</span>
                </h2>
                <div className="text-xs font-mono text-gray-500">SORTED BY LOWEST RISK</div>
              </div>

              <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.02]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-bottom border-white/10 bg-white/[0.03]">
                      <th className="px-6 py-4 text-xs font-mono text-gray-500 uppercase tracking-widest">Provider</th>
                      <th className="px-6 py-4 text-xs font-mono text-gray-500 uppercase tracking-widest">Type / Location</th>
                      <th className="px-6 py-4 text-xs font-mono text-gray-500 uppercase tracking-widest">Risk Score</th>
                      <th className="px-6 py-4 text-xs font-mono text-gray-500 uppercase tracking-widest">Risk Level</th>
                      <th className="px-6 py-4 text-xs font-mono text-gray-500 uppercase tracking-widest">AI Insight</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {results.map((provider, idx) => (
                      <motion.tr 
                        key={provider.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-white/[0.03] transition-colors group"
                      >
                        <td className="px-6 py-6">
                          <div className="font-bold text-lg group-hover:text-emerald-400 transition-colors">{provider.provider_name}</div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="text-sm text-gray-300">{provider.policy_type}</div>
                          <div className="text-xs text-gray-500">{provider.location}</div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center font-mono text-lg">
                              {provider.riskScore}
                            </div>
                            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-1000 ${
                                  provider.riskScore > 60 ? 'bg-red-500' : 
                                  provider.riskScore > 30 ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${provider.riskScore}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${getRiskColor(provider.riskLevel)}`}>
                            {getRiskIcon(provider.riskLevel)}
                            {provider.riskLevel.toUpperCase()}
                          </div>
                        </td>
                        <td className="px-6 py-6 max-w-xs">
                          <p className="text-xs text-gray-400 leading-relaxed italic">
                            "{provider.explanation}"
                          </p>
                        </td>
                      </motion.tr>
                    ))}
                    {results.length === 0 && !loading && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          No providers found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Footer Info */}
        <footer className="mt-24 pt-12 border-t border-white/10 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-12">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Weighted Formula
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Risk = (0.3 × Rejection) + (0.25 × Complaints) + (0.2 × Legal) + (0.15 × Delay) - (0.1 × Rating)
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Risk Thresholds
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Low: 0-30 | Medium: 31-60 | High: 61-100. Scores are normalized based on industry benchmarks.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Data Source
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Synthetic dataset generated for hackathon demonstration. Metrics simulate real-world provider behavior.
              </p>
            </div>
          </div>
          <p className="text-gray-600 text-xs font-mono uppercase tracking-[0.2em]">
            Built for 24h Hackathon • Insurance Fraud Detection AI v1.0
          </p>
        </footer>
      </main>
    </div>
  );
}
