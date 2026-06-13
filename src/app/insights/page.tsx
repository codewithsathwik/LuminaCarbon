"use client";

import { Lightbulb, ArrowRight, TrendingUp, Zap, Bus, Leaf, CheckCircle2, Trash2, HeartHandshake, Recycle, Factory, MapPin, Droplets } from "lucide-react";
import { useCarbon } from "@/context/CarbonContext";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Insights() {
  const { footprintScoreTons, profile, addActivity, isMounted } = useCarbon();
  const [mounted, setMounted] = useState(false);
  const [completedTips, setCompletedTips] = useState<number[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTipAction = (index: number, title: string, impactStr: string) => {
    const match = impactStr.match(/\d+/);
    const value = match ? parseInt(match[0]) : 10;
    
    addActivity({
      title: `Tip Actioned: ${title}`,
      category: "Energy",
      impact: -Math.abs(value),
    });

    setCompletedTips([...completedTips, index]);
  };

  if (!mounted || !isMounted) return null;

  const progressPercent = Math.min((footprintScoreTons / profile.monthlyGoal) * 100, 100);
  const remaining = profile.monthlyGoal - footprintScoreTons;

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <header>
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Awareness & Action Hub</h1>
        <p className="text-sm md:text-base text-gray-400">Personalized actions and deep insights into India's environmental landscape.</p>
      </header>

      {/* Goal Progress */}
      <div className="glass rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between border-l-4 border-[var(--primary)] relative overflow-hidden gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
        <div>
          <h2 className="text-lg md:text-2xl font-bold text-white mb-2">Monthly Carbon Goal</h2>
          <p className="text-xs md:text-base text-gray-400 max-w-md">
            {remaining >= 0 
              ? `You have ${remaining.toFixed(2)} Tons remaining before hitting your monthly limit. Keep it up!` 
              : `You have exceeded your monthly goal by ${Math.abs(remaining).toFixed(2)} Tons. Focus on reduction strategies!`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 md:gap-6 z-10 w-full md:w-auto justify-between md:justify-end">
          <div className="text-right">
            <p className="text-sm text-gray-400 mb-1">Current</p>
            <p className="text-2xl font-bold text-white">{footprintScoreTons.toFixed(2)} <span className="text-sm font-normal">Tons</span></p>
          </div>
          <div className="w-16 h-16 relative flex items-center justify-center">
             <svg className="absolute inset-0 w-full h-full transform -rotate-90">
               <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
               <circle cx="32" cy="32" r="28" fill="none" stroke={remaining >= 0 ? "var(--primary)" : "#f87171"} strokeWidth="4" strokeDasharray="175" strokeDashoffset={175 - (175 * progressPercent) / 100} className="transition-all duration-1000" />
             </svg>
             <span className={`text-sm font-bold relative z-10 ${remaining >= 0 ? "text-[var(--primary)]" : "text-red-400"}`}>{progressPercent.toFixed(0)}%</span>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Target</p>
            <p className="text-2xl font-bold text-white">{profile.monthlyGoal.toFixed(2)} <span className="text-sm font-normal">Tons</span></p>
          </div>
        </div>
      </div>

      {/* Indian Context Tips */}
      <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-6">Actionable Tips (India Focus)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Upgrade to 5-Star BEE Appliances",
            desc: "Replacing old ACs and refrigerators with 5-Star BEE rated units cuts electricity consumption by up to 30%, heavily reducing grid coal reliance.",
            impact: "- 150 kg CO₂ / yr",
            icon: Zap,
            color: "text-yellow-400",
            bg: "bg-[rgba(250,204,21,0.1)]"
          },
          {
            title: "Utilize Metro & Carpooling",
            desc: "Switching from personal 2W/4W to Metro rail networks or using Ola/Uber Share heavily tackles both congestion and urban air pollution.",
            impact: "- 180 kg CO₂ / yr",
            icon: Bus,
            color: "text-blue-400",
            bg: "bg-[rgba(96,165,250,0.1)]"
          },
          {
            title: "Local & Seasonal Diet",
            desc: "India has diverse seasonal produce. Buying imported exotic fruits creates massive aviation carbon footprints. Stick to local Sabzi Mandi buys.",
            impact: "- 90 kg CO₂ / yr",
            icon: Leaf,
            color: "text-[var(--primary)]",
            bg: "bg-[rgba(57,255,20,0.1)]"
          }
        ].map((tip, i) => {
          const isCompleted = completedTips.includes(i);
          return (
            <div key={i} className="glass rounded-2xl p-6 flex flex-col h-full group hover:border-[var(--primary)] transition-all duration-300 relative overflow-hidden">
              {isCompleted && (
                 <div className="absolute inset-0 bg-[rgba(57,255,20,0.05)] z-0 flex items-center justify-center backdrop-blur-[2px]">
                   <div className="bg-[rgba(10,10,10,0.9)] p-4 rounded-xl border border-[var(--primary)] flex flex-col items-center gap-2 box-glow">
                     <CheckCircle2 className="w-8 h-8 text-[var(--primary)]" />
                     <span className="font-bold text-[var(--primary)]">Action Logged!</span>
                   </div>
                 </div>
              )}
              <div className="relative z-10 flex flex-col h-full">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${tip.bg}`}>
                  <tip.icon className={`w-6 h-6 ${tip.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{tip.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-6 flex-1 text-sm">{tip.desc}</p>
                
                <div className="mt-auto pt-6 border-t border-[rgba(255,255,255,0.1)] flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Potential Impact</p>
                    <p className="font-bold text-[var(--primary)] text-glow">{tip.impact}</p>
                  </div>
                  <button 
                    onClick={() => handleTipAction(i, tip.title, tip.impact)}
                    disabled={isCompleted}
                    className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-black transition-all duration-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Waste Segregation & E-Waste Hub */}
      <h2 className="text-xl md:text-2xl font-bold text-white mt-12 mb-6">Waste Management & E-Waste Hub</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6 md:p-8 border-t-4 border-green-500 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full blur-[80px] opacity-10 pointer-events-none"></div>
           <div className="flex justify-between items-start mb-6">
             <h3 className="text-xl font-bold text-white">Urban Waste Segregation</h3>
             <Trash2 className="w-8 h-8 text-green-400" />
           </div>
           <p className="text-gray-400 text-sm mb-6">Indian landfills (like Ghazipur) are overflowing and emitting massive amounts of methane. Proper segregation at source is legally mandated in most municipal corporations (BBMP, BMC, etc.).</p>
           
           <div className="space-y-4">
             <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex gap-4">
               <div className="w-4 h-full bg-green-500 rounded-full"></div>
               <div><p className="font-bold text-green-400">Wet Waste (Green Bin)</p><p className="text-xs text-gray-300">Kitchen waste, food scraps. Used for municipal composting.</p></div>
             </div>
             <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-4">
               <div className="w-4 h-full bg-blue-500 rounded-full"></div>
               <div><p className="font-bold text-blue-400">Dry Waste (Blue Bin)</p><p className="text-xs text-gray-300">Plastic, paper, glass, metal. Must be rinsed and dried before disposal.</p></div>
             </div>
             <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-4">
               <div className="w-4 h-full bg-red-500 rounded-full"></div>
               <div><p className="font-bold text-red-400">Hazardous (Red/Black)</p><p className="text-xs text-gray-300">Diapers, sanitary pads, medical waste, batteries.</p></div>
             </div>
           </div>
        </div>

        <div className="glass rounded-2xl p-6 md:p-8 border-t-4 border-orange-500 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-[80px] opacity-10 pointer-events-none"></div>
           <div className="flex justify-between items-start mb-6">
             <h3 className="text-xl font-bold text-white">E-Waste Disposal</h3>
             <Factory className="w-8 h-8 text-orange-400" />
           </div>
           <p className="text-gray-400 text-sm mb-6">India is the world's 3rd largest e-waste generator. Giving electronics to informal scrap dealers leads to toxic heavy metal leaching into our water tables.</p>
           
           <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl p-5 mb-4">
             <h4 className="font-bold text-white mb-2">Verified Disposal Options:</h4>
             <ul className="text-sm text-gray-400 space-y-2 list-disc pl-4">
               <li>Use <strong className="text-orange-400">Croma e-Care</strong> drop boxes in major cities.</li>
               <li>Schedule a pickup with <strong className="text-orange-400">Cerebra Green</strong> or <strong className="text-orange-400">Saahas Zero Waste</strong>.</li>
               <li>Trade-in old phones directly via Flipkart/Amazon exchange programs rather than local dealers.</li>
             </ul>
           </div>
           
           <button className="w-full py-3 rounded-xl bg-orange-500/20 text-orange-400 font-bold hover:bg-orange-500 hover:text-black transition-all border border-orange-500/50 flex justify-center items-center gap-2">
             <MapPin className="w-4 h-4" /> Locate Drop-off Near Me
           </button>
        </div>
      </div>

      {/* Direct Action & NGO Connect */}
      <h2 className="text-xl md:text-2xl font-bold text-white mt-12 mb-6">Take Direct Action (Initiatives)</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 flex flex-col items-center text-center hover:bg-[rgba(255,255,255,0.05)] transition-all group">
          <div className="w-16 h-16 bg-[#39ff14]/10 rounded-full flex items-center justify-center mb-4 border border-[#39ff14]/30 group-hover:scale-110 transition-transform">
            <HeartHandshake className="w-8 h-8 text-[#39ff14]" />
          </div>
          <h3 className="font-bold text-white mb-2">Cauvery Calling</h3>
          <p className="text-xs text-gray-400 mb-4">Support massive agroforestry to revitalize the Cauvery river basin and support farmers.</p>
          <button className="mt-auto px-4 py-2 bg-[#39ff14] text-black font-bold rounded-lg text-sm hover:bg-white w-full">Offset via Planting</button>
        </div>
        
        <div className="glass rounded-2xl p-6 flex flex-col items-center text-center hover:bg-[rgba(255,255,255,0.05)] transition-all group">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border border-blue-500/30 group-hover:scale-110 transition-transform">
            <Droplets className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="font-bold text-white mb-2">Lake Cleanup Drives</h3>
          <p className="text-xs text-gray-400 mb-4">Join local weekend volunteering groups (like The Ugly Indian or EFI) to restore urban lakes.</p>
          <button className="mt-auto px-4 py-2 border border-blue-500 text-blue-400 font-bold rounded-lg text-sm hover:bg-blue-500 hover:text-white w-full">Find Local Drives</button>
        </div>

        <div className="glass rounded-2xl p-6 flex flex-col items-center text-center hover:bg-[rgba(255,255,255,0.05)] transition-all group">
          <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mb-4 border border-yellow-400/30 group-hover:scale-110 transition-transform">
            <Zap className="w-8 h-8 text-yellow-400" />
          </div>
          <h3 className="font-bold text-white mb-2">PM Surya Ghar</h3>
          <p className="text-xs text-gray-400 mb-4">Explore government subsidies for installing rooftop solar panels to drastically cut fossil fuel use.</p>
          <button className="mt-auto px-4 py-2 border border-yellow-400 text-yellow-400 font-bold rounded-lg text-sm hover:bg-yellow-400 hover:text-black w-full">Calculate Subsidy</button>
        </div>
      </div>

    </div>
  );
}
