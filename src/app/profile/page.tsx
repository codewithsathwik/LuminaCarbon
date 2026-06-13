"use client";

import { useCarbon } from "@/context/CarbonContext";
import { useState, useEffect } from "react";
import { CheckCircle2, User, Target, Droplets } from "lucide-react";

export default function Profile() {
  const { profile, updateProfile, isMounted } = useCarbon();
  const [mounted, setMounted] = useState(false);
  
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [waterTarget, setWaterTarget] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && profile) {
      setName(profile.name || "");
      setGoal((profile.monthlyGoal ?? 2.0).toString());
      setWaterTarget((profile.dailyWaterTarget ?? 135).toString());
    }
  }, [profile, isMounted]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      monthlyGoal: parseFloat(goal) || 2.0,
      dailyWaterTarget: parseInt(waterTarget, 10) || 135
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!mounted || !isMounted) return null;

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-3xl pb-10">
      <header>
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Profile & Targets</h1>
        <p className="text-sm md:text-base text-gray-400">View and edit your personal information and environmental goals.</p>
      </header>

      <div className="glass rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--primary)] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

        <form onSubmit={handleSave} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-[var(--primary)]" />
              Display Name
            </label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl p-4 text-white focus:outline-none focus:border-[var(--primary)] transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-[var(--primary)]" />
                Monthly Carbon Target
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  step="0.1"
                  min="0.1"
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl p-4 text-white focus:outline-none focus:border-[var(--primary)] transition-colors"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Tons CO₂e</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Adjust your target to see changes reflected immediately on your Dashboard progress bars.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                Daily Water Target
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={waterTarget}
                  onChange={e => setWaterTarget(e.target.value)}
                  step="1"
                  min="1"
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">Liters</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Standard urban limit is ~135 Liters per day.</p>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 rounded-xl bg-[var(--primary)] text-black font-bold text-lg hover:bg-white hover:text-black transition-all duration-300 box-glow hover:box-glow-hover flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-6 h-6" />
                Profile Saved!
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
