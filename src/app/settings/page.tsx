"use client";

import { AlertTriangle, Trash2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const [cleared, setCleared] = useState(false);

  const handleClearData = () => {
    if (confirm("Are you sure you want to delete all logged activities and profile settings? This cannot be undone.")) {
      localStorage.removeItem("carbon_activities");
      localStorage.removeItem("carbon_water_logs");
      localStorage.removeItem("carbon_profile");
      setCleared(true);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-3xl">
      <header>
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-sm md:text-base text-gray-400">Manage your application preferences and data.</p>
      </header>

      <div className="glass rounded-2xl p-8 border border-[rgba(255,255,255,0.05)]">
        <h2 className="text-xl font-bold text-white mb-4">Data Management</h2>
        <div className="p-6 rounded-xl bg-[rgba(255,0,0,0.05)] border border-[rgba(255,0,0,0.2)]">
          <div className="flex items-start gap-4 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <h3 className="font-semibold text-white">Danger Zone</h3>
              <p className="text-sm text-gray-400 mt-1">Clearing your data will permanently delete all your logged carbon activities and reset your profile settings. This action cannot be undone.</p>
            </div>
          </div>
          <button 
            onClick={handleClearData}
            disabled={cleared}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 font-medium border border-red-500/30 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cleared ? <CheckCircle2 className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
            {cleared ? "Data Cleared!" : "Clear All Data"}
          </button>
        </div>
      </div>
    </div>
  );
}
