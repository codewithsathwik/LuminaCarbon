"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useCarbon } from "@/context/CarbonContext";
import { useEffect, useState } from "react";

const COLORS = ["#39ff14", "#00f0ff", "#bf00ff", "#ff5e00"];

export default function EmissionsBreakdownChart() {
  const { emissionsBreakdown, isMounted } = useCarbon();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isMounted) {
    return <div className="w-full h-64 mt-4 animate-pulse bg-[rgba(255,255,255,0.05)] rounded-full max-w-[200px] max-h-[200px] mx-auto"></div>;
  }

  return (
    <div className="w-full h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            {COLORS.map((color, index) => (
              <filter id={`glow-${index}`} key={`filter-${index}`}>
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            ))}
          </defs>
          <Pie
            data={emissionsBreakdown}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={90}
            paddingAngle={8}
            dataKey="value"
            stroke="none"
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {emissionsBreakdown.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                style={{ filter: `url(#glow-${index})` }}
                className="hover:opacity-80 transition-opacity duration-300 cursor-pointer"
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.95)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
            itemStyle={{ color: '#fff', fontWeight: 'bold' }}
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '13px', color: '#e2e2e2', paddingTop: '20px' }} 
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
