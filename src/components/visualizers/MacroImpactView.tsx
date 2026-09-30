import React, { useState } from "react";
import type { WorldState } from "../../engine/types";
import { Activity, AlertCircle, Layers } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";

interface MacroImpactViewProps {
  world: WorldState;
}

export const MacroImpactView: React.FC<MacroImpactViewProps> = ({ world }) => {
  const [activeGraphTab, setActiveGraphTab] = useState<"trajectory" | "economic" | "societal" | "policy">("trajectory");

  const chartData = world.history.map(pt => ({
    year: pt.year,
    day: pt.day,
    label: "Yr " + pt.year,
    mastery: pt.avgKnowledgePct,
    stress: pt.avgStress,
    innovation: pt.innovationIndex === "UNKNOWN" ? null : pt.innovationIndex,
    gdp: pt.gdpProxy === "UNKNOWN" ? null : pt.gdpProxy,
    wellbeing: pt.happinessIndex === "UNKNOWN" ? null : pt.happinessIndex,
    mobility: pt.socialMobilityIndex === "UNKNOWN" ? null : pt.socialMobilityIndex
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: "rgba(11, 15, 23, 0.9)", padding: "10px", border: "1px solid #334155", borderRadius: "8px" }}>
          <p className="label" style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color, margin: "2px 0", fontSize: "12px" }}>
              {entry.name}: {entry.value != null ? Number(entry.value).toFixed(1) : "UNVALIDATED"} {entry.name.includes("GDP") ? " (SIMULATED)" : ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="macro-view-container" style={{ background: "rgba(11, 15, 23, 0.7)", borderRadius: "12px", padding: "20px", marginTop: "20px", border: "1px solid var(--border-glass)" }}>
      <div className="macro-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div className="title-group" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Activity className="icon-cyan" size={24} color="#00f2fe" />
          <div>
            <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Macro Economic, Societal & Policy Graphs</h2>
            <p className="subtitle" style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>
              Longitudinal trajectory tracking for economic output, societal wellbeing, and policy alignment.
            </p>
          </div>
        </div>
        
        <div className="graph-tabs" style={{ display: "flex", gap: "10px" }}>
          {["trajectory", "economic", "societal", "policy"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveGraphTab(tab as any)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                background: activeGraphTab === tab ? "rgba(0, 242, 254, 0.1)" : "transparent",
                border: "1px solid " + (activeGraphTab === tab ? "#00f2fe" : "#334155"),
                color: activeGraphTab === tab ? "#00f2fe" : "#94a3b8",
                cursor: "pointer",
                textTransform: "capitalize"
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-container" style={{ width: "100%", height: "400px" }}>
        {chartData.length === 0 ? (
          <div style={{ display: "flex", height: "100%", justifyContent: "center", alignItems: "center", color: "#94a3b8" }}>
            <AlertCircle size={20} style={{ marginRight: "8px" }} />
            <span>UNVALIDATED � NO DATA (Simulation has not generated history yet)</span>
          </div>
        ) : activeGraphTab === "trajectory" ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickMargin={10} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => ""+val} />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => "$"+val} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Line yAxisId="left" type="monotone" dataKey="mastery" name="Knowledge Mastery (%)" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line yAxisId="left" type="monotone" dataKey="stress" name="Student Stress (Index)" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line yAxisId="left" type="stepAfter" dataKey="innovation" name="Innovation (MODEL PROXY)" stroke="#8b5cf6" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line yAxisId="right" type="monotone" dataKey="gdp" name="GDP Proxy (SIMULATED)" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : activeGraphTab === "economic" ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGdp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} tickFormatter={(val) => "$"+val} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Line yAxisId="left" type="stepAfter" dataKey="innovation" name="Innovation (MODEL PROXY)" stroke="#8b5cf6" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Area yAxisId="right" type="monotone" dataKey="gdp" name="GDP Proxy (SIMULATED)" stroke="#10b981" fillOpacity={1} fill="url(#colorGdp)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        ) : activeGraphTab === "societal" ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Line type="monotone" dataKey="stress" name="Student Stress (Index)" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="wellbeing" name="Wellbeing / QoL (MODEL PROXY)" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="mobility" name="Social Mobility (SIMULATED)" stroke="#06b6d4" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ display: "flex", height: "100%", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "#94a3b8" }}>
            <Layers size={32} style={{ marginBottom: "16px", color: "#334155" }} />
            <h3>Policy Graph</h3>
            <p>Policy alignment and adoption tracking is derived from the Genesis Research Engine.</p>
            <div style={{ marginTop: "10px", padding: "10px 20px", background: "rgba(255,255,255,0.05)", borderRadius: "6px" }}>
               Status: UNVALIDATED � Policy impact models are pending backend validation.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
