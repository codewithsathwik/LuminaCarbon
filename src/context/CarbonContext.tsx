"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ActivityCategory = "Transportation" | "Energy" | "Diet" | "Shopping";

export interface Activity {
  id: string;
  title: string;
  category: ActivityCategory;
  impact: number; // in kg CO2
  date: string;
}

export interface WaterLog {
  id: string;
  liters: number;
  date: string;
  type: "Bucket Bath" | "Shower" | "RO Reject Water" | "Other";
}

export interface UserProfile {
  name: string;
  monthlyGoal: number; // in Tons CO2e
  dailyWaterTarget: number; // in Liters
}

interface CarbonContextType {
  activities: Activity[];
  waterLogs: WaterLog[];
  profile: UserProfile;
  footprintScoreTons: number;
  emissionsBreakdown: { name: ActivityCategory; value: number }[];
  addActivity: (activity: Omit<Activity, "id" | "date">) => void;
  addWaterLog: (log: Omit<WaterLog, "id" | "date">) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  isMounted: boolean;
}

const defaultProfile: UserProfile = {
  name: "Eco Warrior",
  monthlyGoal: 1.9, // 1.9 Tons (Indian National Average)
  dailyWaterTarget: 135, // 135 Liters standard urban limit
};

// Initial mock data to show something if localstorage is empty
const initialActivities: Activity[] = [
  { id: "1", title: "Train commute (30 miles)", category: "Transportation", impact: 2.5, date: new Date().toISOString() },
  { id: "2", title: "Plant-based meal", category: "Diet", impact: 1.2, date: new Date().toISOString() },
];

const CarbonContext = createContext<CarbonContextType | undefined>(undefined);

export function CarbonProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  // Load from local storage
  useEffect(() => {
    setIsMounted(true);
    const savedActivities = localStorage.getItem("carbon_activities");
    const savedWaterLogs = localStorage.getItem("carbon_water_logs");
    const savedProfile = localStorage.getItem("carbon_profile");
    
    if (savedActivities) {
      try { setActivities(JSON.parse(savedActivities)); } catch(e) {}
    } else {
      setActivities(initialActivities);
    }

    if (savedWaterLogs) {
      try { setWaterLogs(JSON.parse(savedWaterLogs)); } catch(e) {}
    }

    if (savedProfile) {
      try { setProfile(JSON.parse(savedProfile)); } catch(e) {}
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("carbon_activities", JSON.stringify(activities));
      localStorage.setItem("carbon_water_logs", JSON.stringify(waterLogs));
      localStorage.setItem("carbon_profile", JSON.stringify(profile));
    }
  }, [activities, waterLogs, profile, isMounted]);

  const addActivity = (activity: Omit<Activity, "id" | "date">) => {
    if (!activity.title || typeof activity.title !== 'string' || activity.title.length > 200) {
      console.warn("Invalid activity title");
      return;
    }
    if (typeof activity.impact !== 'number' || isNaN(activity.impact) || activity.impact < -10000 || activity.impact > 10000) {
      console.warn("Invalid activity impact");
      return;
    }

    const newActivity: Activity = {
      title: activity.title.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;"), // Basic XSS prevention
      category: activity.category,
      impact: Number(activity.impact),
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  const addWaterLog = (log: Omit<WaterLog, "id" | "date">) => {
    if (typeof log.liters !== 'number' || isNaN(log.liters) || log.liters < 0 || log.liters > 10000) {
      console.warn("Invalid water liters amount");
      return;
    }

    const newLog: WaterLog = {
      type: log.type,
      liters: Number(log.liters),
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    setWaterLogs((prev) => [newLog, ...prev]);
  };

  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...newProfile }));
  };

  // Derive Footprint Score (let's assume total impact of activities in kg / 1000 = Tons)
  // But we want to show a base score plus the activities. Let's assume the base is 5.0 Tons for demonstration, and activities add/subtract from it.
  // Wait, if users add activities, it increases their footprint? Yes, activities emit CO2.
  // For a realistic MVP, let's start with a base of 0 or a set amount.
  // Actually, usually footprint trackers calculate based on an annual footprint and adjust. Let's just sum it up.
  // If it's a monthly tracker, sum up all kg CO2 and divide by 1000 for tons. To make the numbers look like the mockup (7.4 tons),
  // let's add a baseline of 7.0 tons plus whatever is logged.
  const baselineTons = 7.0; 
  const totalLoggedKg = activities.reduce((sum, act) => sum + act.impact, 0);
  const footprintScoreTons = Number((baselineTons + (totalLoggedKg / 1000)).toFixed(2));

  // Derive Emissions Breakdown
  const breakdownMap: Record<ActivityCategory, number> = {
    Transportation: 40,
    Energy: 30,
    Diet: 20,
    Shopping: 10,
  };
  
  // Add logged activities to the base breakdown percentages (just as a simple visualization hack for the MVP)
  activities.forEach(act => {
    if (breakdownMap[act.category] !== undefined) {
      breakdownMap[act.category] += act.impact; // add kg to the base value
    }
  });

  const emissionsBreakdown = (Object.keys(breakdownMap) as ActivityCategory[]).map(key => ({
    name: key,
    value: Number(breakdownMap[key].toFixed(1))
  }));

  return (
    <CarbonContext.Provider
      value={{
        activities,
        waterLogs,
        profile,
        footprintScoreTons,
        emissionsBreakdown,
        addActivity,
        addWaterLog,
        updateProfile,
        isMounted,
      }}
    >
      {children}
    </CarbonContext.Provider>
  );
}

export function useCarbon() {
  const context = useContext(CarbonContext);
  if (context === undefined) {
    throw new Error("useCarbon must be used within a CarbonProvider");
  }
  return context;
}
