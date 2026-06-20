"use client";

import { useState, useEffect } from "react";
import { Car, Zap, ShoppingBag, Utensils, CheckCircle2, Droplets, ShowerHead, Info } from "lucide-react";
import { useCarbon, ActivityCategory, WaterLog } from "@/context/CarbonContext";
import clsx from "clsx";

const carbonCategories = [
  { name: "Transportation", icon: Car },
  { name: "Energy", icon: Zap },
  { name: "Diet", icon: Utensils },
  { name: "Shopping", icon: ShoppingBag },
];

const waterTypes = ["Bucket Bath", "Shower", "RO Reject Water", "Other"] as const;

export default function LogActivity() {
  const { activities, waterLogs, addActivity, addWaterLog, isMounted, profile } = useCarbon();
  const [mounted, setMounted] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  
  const [activeTab, setActiveTab] = useState<"carbon" | "water">("carbon");

  // Carbon State
  const [category, setCategory] = useState<ActivityCategory>("Transportation");
  const [details, setDetails] = useState("");
  const [duration, setDuration] = useState("");
  const [unit, setUnit] = useState("miles");

  // Water State
  const [waterType, setWaterType] = useState<WaterLog["type"]>("Bucket Bath");
  const [liters, setLiters] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCarbonLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details || !duration) return;

    const numericValue = parseFloat(duration);
    let impact = 0;
    if (category === "Transportation") impact = numericValue * 0.4;
    else if (category === "Energy") impact = numericValue * 0.5;
    else if (category === "Diet") impact = numericValue * 2.0;
    else if (category === "Shopping") impact = numericValue * 0.1;

    addActivity({ title: details, category, impact: Number(impact.toFixed(1)) });
    setDetails(""); setDuration("");
    showSuccess();
  };

  const handleWaterLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liters) return;

    addWaterLog({ type: waterType, liters: parseFloat(liters) });
    setLiters("");
    showSuccess();
  };

  const showSuccess = () => {
    setIsLogged(true);
    setTimeout(() => setIsLogged(false), 3000);
  };

  if (!mounted || !isMounted) return null;

  // Summaries
  const todayStr = new Date().toLocaleDateString();
  const todaysActivities = activities.filter(a => new Date(a.date).toLocaleDateString() === todayStr);
  const totalTodayImpact = todaysActivities.reduce((sum, act) => sum + act.impact, 0);
  const targetPerDay = (profile.monthlyGoal * 1000) / 30; 

  const todaysWater = waterLogs.filter(w => new Date(w.date).toLocaleDateString() === todayStr);
  const totalWaterToday = todaysWater.reduce((sum, w) => sum + w.liters, 0);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Log Activity</h1>
        <p className="text-sm md:text-base text-gray-400">Track your daily actions to see their impact on your carbon footprint.</p>
      </header>

      {/* Tabs */}
      <div className="flex bg-[rgba(255,255,255,0.05)] w-max rounded-xl p-1 border border-[rgba(255,255,255,0.1)]">
        <button 
          onClick={() => setActiveTab("carbon")}
          className={clsx("px-6 py-2 rounded-lg text-sm font-semibold transition-all", activeTab === "carbon" ? "bg-[var(--primary)] text-black box-glow" : "text-gray-400 hover:text-white")}
        >
          Carbon Footprint
        </button>
        <button 
          onClick={() => setActiveTab("water")}
          className={clsx("px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2", activeTab === "water" ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "text-gray-400 hover:text-white")}
        >
          <Droplets className="w-4 h-4" /> Water Footprint
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Log Form */}
        <div className="glass rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className={clsx("absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[120px] opacity-10 pointer-events-none transition-colors", activeTab === "water" ? "bg-blue-500" : "bg-[var(--primary)]")}></div>
          
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6">New Entry</h2>
          
          {activeTab === "carbon" ? (
            <form onSubmit={handleCarbonLog} className="space-y-6 relative z-10">
              <div aria-live="polite" className="sr-only">{isLogged ? "Carbon activity logged successfully!" : ""}</div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {carbonCategories.map((cat) => (
                    <label key={cat.name} className="cursor-pointer">
                      <input 
                        type="radio" name="category" className="peer sr-only" 
                        checked={category === cat.name} onChange={() => setCategory(cat.name as ActivityCategory)}
                      />
                      <div className="flex items-center gap-2 p-3 rounded-xl border border-[rgba(255,255,255,0.1)] text-gray-400 peer-checked:border-[var(--primary)] peer-checked:text-[var(--primary)] peer-checked:bg-[rgba(57,255,20,0.05)] transition-all">
                        <cat.icon className="w-5 h-5" />
                        <span className="font-semibold text-sm">{cat.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="details-input" className="block text-sm font-medium text-gray-300 mb-2">Activity Details</label>
                <input 
                  id="details-input"
                  type="text" value={details} onChange={e => setDetails(e.target.value)} placeholder="e.g., Drove to work" 
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl p-4 text-white focus:outline-none focus:border-[var(--primary)] transition-colors" required
                />
              </div>

              <div>
                <label htmlFor="duration-input" className="block text-sm font-medium text-gray-300 mb-2">Value</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    id="duration-input"
                    type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="15" 
                    className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl p-4 text-white focus:outline-none focus:border-[var(--primary)] transition-colors" required min="0" step="0.1"
                  />
                  <select 
                    aria-label="Unit of value"
                    value={unit} onChange={e => setUnit(e.target.value)}
                    className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl p-4 text-white focus:outline-none focus:border-[var(--primary)]"
                  >
                    <option value="miles">Miles</option>
                    <option value="km">Km</option>
                    <option value="hours">Hours</option>
                    <option value="usd">USD ($)</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full py-4 rounded-xl bg-[var(--primary)] text-black font-bold text-lg hover:bg-white hover:text-black transition-all duration-300 box-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                {isLogged ? <><CheckCircle2 className="w-6 h-6" /> Activity Logged!</> : "Calculate & Log Impact"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleWaterLog} className="space-y-6 relative z-10">
              <div aria-live="polite" className="sr-only">{isLogged ? "Water usage logged successfully!" : ""}</div>
              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3 mb-6">
                <Info className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                <p className="text-sm text-blue-200">Water scarcity is a major issue in Indian cities. An average bucket bath uses 15-20L, while a 5-min shower uses 40-50L. RO purifiers reject up to 3 liters for every 1 liter purified.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Usage Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {waterTypes.map((type) => (
                    <label key={type} className="cursor-pointer">
                      <input 
                        type="radio" name="waterType" className="peer sr-only" 
                        checked={waterType === type} onChange={() => setWaterType(type as WaterLog["type"])}
                      />
                      <div className="flex items-center gap-2 p-3 rounded-xl border border-[rgba(255,255,255,0.1)] text-gray-400 peer-checked:border-blue-500 peer-checked:text-blue-400 peer-checked:bg-blue-500/10 transition-all">
                        {type === "Shower" ? <ShowerHead className="w-5 h-5" /> : <Droplets className="w-5 h-5" />}
                        <span className="font-semibold text-sm">{type}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="liters-input" className="block text-sm font-medium text-gray-300 mb-2">Amount (Liters)</label>
                <input 
                  id="liters-input"
                  type="number" value={liters} onChange={e => setLiters(e.target.value)} placeholder="e.g., 20" 
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition-colors" required min="0" max="1000" step="1"
                />
              </div>

              <button type="submit" className="w-full py-4 rounded-xl bg-blue-500 text-white font-bold text-lg hover:bg-blue-400 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                {isLogged ? <><CheckCircle2 className="w-6 h-6" /> Water Logged!</> : "Log Water Usage"}
              </button>
            </form>
          )}
        </div>

        {/* Recent Logs & Summary */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-lg md:text-xl font-bold text-white mb-4">Today's Summary</h2>
            
            {/* Carbon Summary */}
            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-xs md:text-sm text-gray-400 mb-1">Total Carbon Today</p>
                  <p className="text-3xl md:text-4xl font-bold text-[var(--primary)] text-glow">{totalTodayImpact.toFixed(1)} <span className="text-base md:text-lg text-gray-400 font-normal">kg CO₂e</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs md:text-sm text-gray-400 mb-1">Daily Target</p>
                  <p className="text-lg md:text-xl font-semibold text-white">{targetPerDay.toFixed(1)} kg</p>
                </div>
              </div>
              <div className="w-full bg-[rgba(255,255,255,0.1)] rounded-full h-2">
                <div className="bg-[var(--primary)] h-2 rounded-full box-glow" style={{ width: `${Math.min((totalTodayImpact / targetPerDay) * 100, 100)}%` }}></div>
              </div>
            </div>

            {/* Water Summary */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-xs md:text-sm text-gray-400 mb-1">Total Water Today</p>
                  <p className="text-3xl md:text-4xl font-bold text-blue-400" style={{ textShadow: "0 0 10px rgba(59,130,246,0.5)" }}>{totalWaterToday.toFixed(0)} <span className="text-base md:text-lg text-gray-400 font-normal">Liters</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs md:text-sm text-gray-400 mb-1">Daily Limit</p>
                  <p className="text-lg md:text-xl font-semibold text-white">{profile.dailyWaterTarget} L</p>
                </div>
              </div>
              <div className="w-full bg-[rgba(255,255,255,0.1)] rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min((totalWaterToday / profile.dailyWaterTarget) * 100, 100)}%`, boxShadow: "0 0 10px rgba(59,130,246,0.5)" }}></div>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 flex flex-col max-h-[400px]">
            <h2 className="text-lg font-semibold text-gray-300 mb-4">{activeTab === "carbon" ? "Today's Carbon Logs" : "Today's Water Logs"}</h2>
            <div className="space-y-3 overflow-y-auto pr-2 flex-1">
              {activeTab === "carbon" ? (
                todaysActivities.length === 0 ? <p className="text-gray-400 text-sm">No carbon logged today.</p> :
                todaysActivities.map((log) => {
                  const catData = carbonCategories.find(c => c.name === log.category);
                  const Icon = catData ? catData.icon : CheckCircle2;
                  return (
                    <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
                          <Icon className="w-5 h-5 text-gray-400" />
                        </div>
                        <div><h3 className="font-medium text-white text-sm">{log.title}</h3><p className="text-xs text-gray-400">{log.category}</p></div>
                      </div>
                      <span className="font-semibold text-sm text-[var(--primary)]">+{log.impact} kg</span>
                    </div>
                  );
                })
              ) : (
                todaysWater.length === 0 ? <p className="text-gray-400 text-sm">No water logged today.</p> :
                todaysWater.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Droplets className="w-5 h-5 text-blue-400" />
                      </div>
                      <div><h3 className="font-medium text-white text-sm">{log.type}</h3></div>
                    </div>
                    <span className="font-semibold text-sm text-blue-400">+{log.liters} L</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
