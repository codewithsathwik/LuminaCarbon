"use client";

import { TrendingDown, TrendingUp, Activity, Zap, Car, Utensils, ShoppingBag } from "lucide-react";
import dynamic from "next/dynamic";

const EcoHabitat = dynamic(() => import("@/components/EcoHabitat"), { 
  ssr: false, 
  loading: () => <div className="w-full h-full min-h-[300px] bg-[#050505] rounded-2xl animate-pulse"></div> 
});
import { useCarbon } from "@/context/CarbonContext";
import Link from "next/link";
import { useEffect, useState } from "react";

const getIconForCategory = (category: string) => {
  switch (category) {
    case "Transportation": return Car;
    case "Energy": return Zap;
    case "Diet": return Utensils;
    case "Shopping": return ShoppingBag;
    default: return Activity;
  }
};

export default function Dashboard() {
  const { activities, waterLogs, profile, footprintScoreTons, isMounted, addActivity } = useCarbon();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleQuickLog = () => {
    addActivity({
      title: "Reduced Standby Power",
      category: "Energy",
      impact: -0.5, // simulate a reduction or offset
    });
  };

  if (!mounted || !isMounted) {
    return <div className="space-y-8 animate-pulse p-8"><div className="h-10 bg-gray-800 rounded w-1/3 mb-4"></div><div className="h-64 bg-gray-800 rounded-2xl w-full"></div></div>;
  }

  const isUnderGoal = footprintScoreTons <= profile.monthlyGoal;
  const progressPercent = Math.min((footprintScoreTons / profile.monthlyGoal) * 100, 100);

  const todayStr = new Date().toLocaleDateString();
  const todaysWater = waterLogs.filter(w => new Date(w.date).toLocaleDateString() === todayStr);
  const totalWaterToday = todaysWater.reduce((sum, w) => sum + w.liters, 0);
  const isWaterUnderGoal = totalWaterToday <= profile.dailyWaterTarget;

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back, {profile.name}! Here's a summary of your environmental impact.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Score Widget */}
        <div className="col-span-1 lg:col-span-2 glass rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden animate-pulse-glow">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
          
          <h2 className="text-sm md:text-lg font-semibold text-gray-300 mb-4 md:mb-6">Current Carbon Footprint</h2>
          <div className="flex items-baseline gap-2 md:gap-4 mb-4">
            <span className={`text-5xl md:text-7xl font-extrabold text-glow ${isUnderGoal ? 'text-[var(--primary)]' : 'text-red-400'}`}>{footprintScoreTons}</span>
            <span className="text-lg md:text-2xl text-gray-400">Tons CO₂e</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs md:text-sm text-[var(--primary)] mb-6 md:mb-8 bg-[rgba(57,255,20,0.1)] w-max px-3 py-1.5 rounded-full border border-[rgba(57,255,20,0.2)]">
            <TrendingDown className="w-4 h-4" />
            <span>On track to reach your goals</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1 text-gray-400">
                <span>You ({footprintScoreTons} Tons)</span>
                <span>Global Average (4.5 Tons)</span>
              </div>
              <div className="w-full bg-[rgba(255,255,255,0.1)] rounded-full h-3">
                <div className={`h-3 rounded-full relative ${footprintScoreTons > 4.5 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min((footprintScoreTons / 9.0) * 100, 100)}%` }}>
                   <div className="absolute top-0 right-0 h-full w-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1 text-gray-400">
                <span>Target ({profile.monthlyGoal.toFixed(1)} Tons)</span>
              </div>
              <div className="w-full bg-[rgba(255,255,255,0.1)] rounded-full h-3">
                <div className="bg-[var(--primary)] h-3 rounded-full box-glow" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Virtual Eco-System */}
        <div className="glass rounded-2xl p-6 flex flex-col h-[380px] md:h-auto">
          <h2 className="text-lg font-semibold text-gray-300 mb-2">Virtual Eco-System</h2>
          <div className="flex-1 w-full rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.05)]">
             <EcoHabitat progressPercent={progressPercent} isHealthy={isUnderGoal} />
          </div>
        </div>
      </div>

      {/* Water Footprint Widget */}
      <div className="glass rounded-2xl p-6 md:p-8 flex flex-col relative overflow-hidden border-l-4 border-blue-500">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h2 className="text-sm md:text-lg font-semibold text-gray-300 mb-2">Today's Water Footprint</h2>
            <div className="flex items-baseline gap-2 md:gap-4 mb-2">
              <span className={`text-4xl md:text-5xl font-extrabold text-glow ${isWaterUnderGoal ? 'text-blue-400' : 'text-red-400'}`} style={{ textShadow: isWaterUnderGoal ? '0 0 10px rgba(59,130,246,0.5)' : undefined }}>{totalWaterToday.toFixed(0)}</span>
              <span className="text-lg text-gray-400">Liters</span>
            </div>
            <p className="text-xs md:text-sm text-gray-400 max-w-sm">Indian urban average limit is 135L per day. Track your usage to prevent water scarcity.</p>
          </div>
          
          <div className="flex-1 max-w-md w-full flex flex-col justify-center">
             <div className="flex justify-between text-sm mb-2 text-gray-300">
               <span>Usage ({totalWaterToday}L)</span>
               <span>Target ({profile.dailyWaterTarget}L)</span>
             </div>
             <div className="w-full bg-[rgba(255,255,255,0.1)] rounded-full h-4 overflow-hidden">
               <div className={`h-4 rounded-full ${isWaterUnderGoal ? 'bg-blue-500' : 'bg-red-500'} transition-all`} style={{ width: `${Math.min((totalWaterToday / profile.dailyWaterTarget) * 100, 100)}%`, boxShadow: "0 0 10px rgba(59,130,246,0.5)" }}></div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Activity */}
        <div className="glass rounded-2xl p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-300">Recent Activity</h2>
            <Link href="/log" className="text-[var(--primary)] text-sm hover:underline">View All / Log More</Link>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto max-h-80 pr-2">
            {activities.length === 0 ? (
              <p className="text-gray-400">No recent activity found. Start logging!</p>
            ) : (
              activities.slice(0, 5).map((activity) => {
                const Icon = getIconForCategory(activity.category);
                const isPositive = activity.impact < 0;
                return (
                  <div key={activity.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[rgba(255,255,255,0.05)] transition-colors border border-transparent hover:border-[rgba(255,255,255,0.1)]">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
                        <Icon className={`w-5 h-5 ${isPositive ? 'text-[var(--primary)]' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-white text-sm">{activity.title}</h3>
                        <p className="text-xs text-gray-400">{new Date(activity.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`font-semibold text-sm ${isPositive ? 'text-[var(--primary)]' : 'text-red-400'}`}>
                      {isPositive ? "" : "+"}{activity.impact} kg CO₂
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sustainability Tip */}
        <div className="glass rounded-2xl p-6 bg-gradient-to-br from-[rgba(57,255,20,0.05)] to-transparent border border-[rgba(57,255,20,0.2)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center box-glow">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <h2 className="text-lg font-semibold text-white">Daily Tip</h2>
          </div>
          <h3 className="text-xl font-bold text-[var(--primary)] mb-2">Reduce Standby Power</h3>
          <p className="text-gray-300 leading-relaxed mb-6">
            Devices in standby mode can account for up to 10% of your household energy use. Unplug electronics or use a smart power strip to easily cut power to multiple devices at once.
          </p>
          <button onClick={handleQuickLog} className="w-full py-3 rounded-xl bg-[var(--primary)] text-black font-bold hover:bg-white hover:text-black transition-all duration-300 box-glow hover:box-glow-hover cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
            I'll do this today (-0.5 kg)
          </button>
        </div>

      </div>
    </div>
  );
}
