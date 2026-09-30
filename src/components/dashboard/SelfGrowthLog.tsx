import React, { useEffect, useState } from "react";
import { Terminal, X, Minimize2, Maximize2, RotateCcw, AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

export const SelfGrowthLog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [log, setLog] = useState<{ mutations: any[] }>({ mutations: [] });
  const [hasNew, setHasNew] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

  const fetchLog = async () => {
    try {
      const res = await fetch("/api/genesis/growth-log");
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.mutations.length > log.mutations.length) {
          if (!isOpen && !isMinimized) setHasNew(true);
        }
        setLog(json.data);
      }
    } catch (e) {
      console.error("Failed to fetch growth log", e);
    }
  };

  useEffect(() => {
    fetchLog();
    const interval = setInterval(fetchLog, 10000);
    return () => clearInterval(interval);
  }, []);

  if (log.mutations.length === 0) return null;

  const latest = log.mutations[log.mutations.length - 1];

  if (isMinimized) {
    return (
      <div 
        onClick={() => { setIsMinimized(false); setIsOpen(true); setHasNew(false); }}
        style={{
          position: "fixed", bottom: "20px", right: "20px", background: "rgba(11, 15, 23, 0.9)",
          border: "1px solid #00f2fe", borderRadius: "8px", padding: "12px 20px",
          display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", zIndex: 9999,
          boxShadow: hasNew ? "0 0 15px rgba(0, 242, 254, 0.5)" : "0 4px 6px rgba(0,0,0,0.3)",
          color: "#00f2fe", fontFamily: "monospace"
        }}
      >
        <Terminal size={18} />
        <span>Genesis Self-Growth: {latest.what.substring(0, 30)}...</span>
        {hasNew && <span style={{ background: "#ef4444", color: "#fff", padding: "2px 6px", borderRadius: "4px", fontSize: "10px" }}>NEW</span>}
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed", bottom: "20px", right: "20px", width: "500px", maxHeight: isOpen ? "600px" : "60px",
      background: "rgba(11, 15, 23, 0.95)", border: "1px solid #334155", borderRadius: "12px", 
      display: "flex", flexDirection: "column", zIndex: 9999, boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
      overflow: "hidden", transition: "max-height 0.3s ease"
    }}>
      {/* Header */}
      <div 
        style={{ padding: "12px 16px", borderBottom: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: "rgba(255,255,255,0.02)" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#cbd5e1" }}>
          <Terminal size={18} color="#00f2fe" />
          <h3 style={{ margin: 0, fontSize: "0.95rem" }}>Change Intelligence Engine</h3>
        </div>
        <div style={{ display: "flex", gap: "8px", color: "#64748b" }}>
          <button onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}><Minimize2 size={16} /></button>
        </div>
      </div>

      {/* Body */}
      {isOpen && (
        <div style={{ padding: "16px", overflowY: "auto", flex: 1, color: "#cbd5e1", fontSize: "0.85rem" }}>
          {log.mutations.slice().reverse().map((record) => (
            <div key={record.id} style={{ marginBottom: "16px", background: "rgba(0,0,0,0.3)", borderRadius: "8px", border: "1px solid #1e293b" }}>
              <div 
                style={{ padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                onClick={() => setExpandedRecord(expandedRecord === record.id ? null : record.id)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {record.status === "PROPOSED" ? <AlertTriangle size={14} color="#3b82f6" /> : record.status === "APPLIED" ? <CheckCircle size={14} color="#10b981" /> : <RotateCcw size={14} color="#f59e0b" />}
                  <span style={{ fontWeight: "bold", color: "#00f2fe" }}>{record.what}</span>
                </div>
                <div style={{ color: "#64748b", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontSize: "0.75rem" }}>{new Date(record.timestamp).toLocaleString()}</span>
                  {expandedRecord === record.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </div>
              
              {expandedRecord === record.id && (
                <div style={{ padding: "0 12px 12px 12px", borderTop: "1px solid #1e293b", marginTop: "4px", paddingTop: "12px" }}>
                  <div style={{ marginBottom: "12px" }}>
                    <strong style={{ color: "#94a3b8" }}>Why:</strong>
                    <p style={{ margin: "4px 0", color: "#f8fafc" }}>{record.why}</p>
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <strong style={{ color: "#94a3b8" }}>How:</strong>
                    <p style={{ margin: "4px 0", color: "#f8fafc" }}>{record.how}</p>
                  </div>
                  <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <strong style={{ color: "#94a3b8" }}>Result:</strong>
                      <p style={{ margin: "4px 0", color: "#f8fafc" }}>{record.result}</p>
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ color: "#94a3b8" }}>Tests Performed:</strong>
                      <p style={{ margin: "4px 0", color: "#f8fafc" }}>{record.testsPerformed}</p>
                    </div>
                  </div>
                  <div style={{ marginBottom: "16px", padding: "8px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "4px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#ef4444", marginBottom: "4px" }}>
                      <AlertTriangle size={14} />
                      <strong>Risks & Limitations:</strong>
                    </div>
                    <p style={{ margin: 0, color: "#fca5a5" }}>{record.risks}</p>
                  </div>
                  
                  {record.status === "PROPOSED" ? (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button style={{ background: "#10b981", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Approve & Implement</button>
                        <button style={{ background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Reject Proposal</button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0f172a", padding: "8px 12px", borderRadius: "6px", flex: 1 }}>
                        <span style={{ fontFamily: "monospace", color: "#f59e0b", fontSize: "0.8rem" }}>$ {record.rollbackOption}</span>
                        <button 
                          style={{ background: "#ef4444", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px" }}
                          onClick={() => alert("To rollback, run:\n" + record.rollbackOption + "\n\nin your terminal.")}
                        >
                          <RotateCcw size={12} /> Revert
                        </button>
                      </div>
                    )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
