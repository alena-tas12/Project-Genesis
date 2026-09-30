import React from "react";
import { Brain, TrendingUp, Sparkles, ShieldAlert } from "lucide-react";
import type { WorldState } from "../../engine/types";

interface MetricOverviewProps {
  world: WorldState;
}

export const MetricOverview: React.FC<MetricOverviewProps> = ({ world }) => {
  const history = world.history;
  
  // Get latest and previous data points
  const latest = history.length > 0 ? history[history.length - 1] : null;
  const previous = history.length > 1 ? history[history.length - 2] : null;

  // Helpers for formatting
  const getTrend = (current: any, prev: any, reverseGood = false) => {
    if (current == null || prev == null || current === "UNKNOWN" || prev === "UNKNOWN") return { text: "N/A", color: "#94a3b8" };
    const diff = Number(current) - Number(prev);
    if (diff === 0) return { text: "0.0", color: "#94a3b8" };
    
    const isGood = reverseGood ? diff < 0 : diff > 0;
    return { 
      text: (diff > 0 ? "+" : "") + diff.toFixed(1), 
      color: isGood ? "#10b981" : "#ef4444" 
    };
  };

  if (!latest) {
    return (
      <div className="metrics-grid">
        <div className="metric-card" style={{ padding: "20px", color: "#94a3b8" }}>
           UNVALIDATED � NO DATA (Simulation initializing...)
        </div>
      </div>
    );
  }

  const masteryTrend = getTrend(latest.avgKnowledgePct, previous?.avgKnowledgePct);
  const stressTrend = getTrend(latest.avgStress, previous?.avgStress, true); // Lower stress is better
  const gdpTrend = getTrend(latest.gdpProxy, previous?.gdpProxy);
  const innovationTrend = getTrend(latest.innovationIndex, previous?.innovationIndex);

  const formatVal = (v: any) => v === "UNKNOWN" || v == null ? "UNVALIDATED" : Number(v).toFixed(1);

  const cards = [
    {
      title: "Knowledge Mastery",
      value: formatVal(latest.avgKnowledgePct) + "%",
      subtitle: "Measured via Student Graph",
      icon: Brain,
      colorClass: "card-cyan",
      trend: masteryTrend.text + " / yr",
      trendColor: masteryTrend.color,
      badge: null
    },
    {
      title: "Psychological Stress",
      value: formatVal(latest.avgStress) + " / 100",
      subtitle: "Burnout: " + formatVal(latest.avgBurnout),
      icon: ShieldAlert,
      colorClass: Number(latest.avgStress) > 65 ? "card-red" : "card-amber",
      trend: stressTrend.text + " / yr",
      trendColor: stressTrend.color,
      badge: null
    },
    {
      title: "GDP Proxy",
      value: latest.gdpProxy === "UNKNOWN" ? "UNVALIDATED" : "$" + formatVal(latest.gdpProxy),
      subtitle: "Nominal per capita",
      icon: TrendingUp,
      colorClass: "card-emerald",
      trend: gdpTrend.text + " / yr",
      trendColor: gdpTrend.color,
      badge: "SIMULATED"
    },
    {
      title: "System Innovation",
      value: formatVal(latest.innovationIndex),
      subtitle: "Derived from Research Engine",
      icon: Sparkles,
      colorClass: "card-purple",
      trend: innovationTrend.text + " / yr",
      trendColor: innovationTrend.color,
      badge: "MODEL PROXY"
    }
  ];

  return (
    <div className="metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px", marginBottom: "20px" }}>
      {cards.map((card, i) => (
        <div key={i} className={"metric-card " + card.colorClass} style={{ background: "rgba(11, 15, 23, 0.7)", border: "1px solid var(--border-glass)", borderRadius: "12px", padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <card.icon size={18} />
              <h3 style={{ margin: 0, fontSize: "0.9rem", color: "#cbd5e1" }}>{card.title}</h3>
            </div>
            {card.badge && (
              <span style={{ fontSize: "0.65rem", padding: "2px 6px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", color: "#94a3b8" }}>
                {card.badge}
              </span>
            )}
          </div>
          
          <div style={{ marginTop: "12px", display: "flex", alignItems: "baseline", gap: "10px" }}>
            <span style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#fff" }}>{card.value}</span>
            <span style={{ fontSize: "0.8rem", color: card.trendColor, fontWeight: "bold" }}>{card.trend}</span>
          </div>
          
          <div style={{ marginTop: "8px", fontSize: "0.75rem", color: "#64748b" }}>
            {card.subtitle}
          </div>
        </div>
      ))}
    </div>
  );
};
