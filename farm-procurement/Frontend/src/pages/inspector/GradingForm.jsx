import { useEffect, useState } from "react";
import { getAllProduce } from "../../services/produceService";
import { gradeInspection } from "../../services/inspectionService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";

const inspectorNav = [
  { icon: "🔬", label: "Dashboard", to: "/inspector/dashboard" },
  { icon: "📋", label: "Grade Produce", to: "/inspector/grade" },
];

const GradingForm = () => {
  const [produce, setProduce] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [grade, setGrade] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("SUBMITTED");

  const fetchProduce = () => {
    setLoading(true);
    getAllProduce()
      .then((data) => setProduce(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProduce(); }, []);

  const filtered = produce.filter((p) =>
    filter === "ALL" ? true : p.status === filter
  );

  const handleGrade = async () => {
    if (!selected) { setError("Please select a produce to grade."); return; }
    if (!grade || grade < 0 || grade > 100) { setError("Grade must be between 0 and 100."); return; }
    setSubmitting(true);
    setError("");
    try {
      await gradeInspection(selected.id, parseInt(grade));
      setSuccess(`✅ ${selected.name} graded ${grade}/100 — ${parseInt(grade) >= 80 ? "APPROVED" : "REJECTED"}!`);
      setSelected(null);
      setGrade("");
      fetchProduce();
      setTimeout(() => setSuccess(""), 4000);
    } catch {
      setError("Failed to submit grade. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout navItems={inspectorNav}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Grade Produce 🔬</h1>
          <p style={styles.subtitle}>Select a produce item and assign a quality grade (0–100).</p>
        </div>
      </div>

      {success && <div style={styles.successBanner}>{success}</div>}
      {error && <div style={styles.errorBanner}>⚠️ {error}</div>}

      <div style={styles.layout}>
        {/* Left: produce list */}
        <div style={styles.listPanel}>
          <div style={styles.filterRow}>
            {["SUBMITTED", "APPROVED", "REJECTED", "ALL"].map((f) => (
              <button
                key={f}
                style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {loading ? <Loader /> : filtered.length === 0 ? (
            <div style={styles.empty}>
              <p>No produce with status <strong>{filter}</strong>.</p>
            </div>
          ) : (
            <div style={styles.produceList}>
              {filtered.map((p) => (
                <div
                  key={p.id}
                  style={{
                    ...styles.produceCard,
                    ...(selected?.id === p.id ? styles.produceCardSelected : {}),
                    ...(p.status !== "SUBMITTED" ? styles.produceCardDimmed : {}),
                  }}
                  onClick={() => {
                    if (p.status === "SUBMITTED") {
                      setSelected(p);
                      setError("");
                    }
                  }}
                >
                  <div style={styles.produceCardTop}>
                    <span style={styles.produceName}>{p.name}</span>
                    <StatusBadge status={p.status} />
                  </div>
                  <div style={styles.produceCardMeta}>
                    <span>🌾 {p.category}</span>
                    <span>⚖️ {p.quantity} kg</span>
                    <span>👤 {p.farmer?.name || "—"}</span>
                  </div>
                  {p.status === "SUBMITTED" && (
                    <div style={styles.selectHint}>
                      {selected?.id === p.id ? "✓ Selected" : "Click to select"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: grading panel */}
        <div style={styles.gradePanel}>
          <h3 style={styles.gradePanelTitle}>Assign Grade</h3>

          {!selected ? (
            <div style={styles.noSelection}>
              <div style={styles.noSelectionIcon}>🔍</div>
              <p style={styles.noSelectionText}>Select a <strong>SUBMITTED</strong> produce from the list to grade it.</p>
            </div>
          ) : (
            <>
              <div style={styles.selectedInfo}>
                <p style={styles.selectedLabel}>Selected Produce</p>
                <p style={styles.selectedName}>{selected.name}</p>
                <div style={styles.selectedMeta}>
                  <span>{selected.category}</span>
                  <span>•</span>
                  <span>{selected.quantity} kg</span>
                  <span>•</span>
                  <span>by {selected.farmer?.name}</span>
                </div>
              </div>

              <div style={styles.gradeInputWrap}>
                <label style={styles.gradeLabel}>Quality Grade (0–100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="e.g. 85"
                  style={styles.gradeInput}
                />
                {grade !== "" && (
                  <div style={{
                    ...styles.gradePreview,
                    background: parseInt(grade) >= 80 ? "#f0fdf4" : "#fef2f2",
                    borderColor: parseInt(grade) >= 80 ? "#bbf7d0" : "#fecaca",
                    color: parseInt(grade) >= 80 ? "#16a34a" : "#dc2626",
                  }}>
                    {parseInt(grade) >= 80
                      ? `✅ Grade ${grade} → APPROVED`
                      : `❌ Grade ${grade} → REJECTED`}
                  </div>
                )}
              </div>

              {/* Grade slider */}
              <div style={styles.sliderWrap}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={grade || 0}
                  onChange={(e) => setGrade(e.target.value)}
                  style={styles.slider}
                />
                <div style={styles.sliderLabels}>
                  <span>0</span>
                  <span style={{ color: "#f59e0b" }}>80 (threshold)</span>
                  <span>100</span>
                </div>
              </div>

              <button
                onClick={handleGrade}
                disabled={submitting || !grade}
                style={{ ...styles.submitBtn, opacity: submitting || !grade ? 0.6 : 1 }}
              >
                {submitting ? "Submitting..." : "Submit Grade →"}
              </button>

              <button
                onClick={() => { setSelected(null); setGrade(""); setError(""); }}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const styles = {
  header: { marginBottom: "28px" },
  title: {
    fontSize: "26px", fontWeight: "700", color: "#1a3a2a",
    margin: "0 0 6px", fontFamily: "'Georgia', serif",
  },
  subtitle: { fontSize: "14px", color: "#6b7280", margin: 0 },
  successBanner: {
    background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a",
    padding: "14px 18px", borderRadius: "10px", marginBottom: "20px",
    fontSize: "14px", fontWeight: "600",
  },
  errorBanner: {
    background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626",
    padding: "14px 18px", borderRadius: "10px", marginBottom: "20px", fontSize: "14px",
  },
  layout: {
    display: "grid", gridTemplateColumns: "1fr 360px", gap: "24px", alignItems: "start",
  },
  listPanel: {
    background: "#fff", borderRadius: "14px", padding: "24px",
    boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
  },
  filterRow: { display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" },
  filterBtn: {
    padding: "6px 14px", borderRadius: "20px", border: "1.5px solid #e5e7eb",
    background: "#fff", color: "#6b7280", fontSize: "12px", fontWeight: "600",
    cursor: "pointer", letterSpacing: "0.3px",
  },
  filterActive: {
    background: "#1e40af", color: "#fff", borderColor: "#1e40af",
  },
  produceList: { display: "flex", flexDirection: "column", gap: "10px" },
  produceCard: {
    border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "14px 16px",
    cursor: "pointer", transition: "all 0.15s",
  },
  produceCardSelected: {
    border: "1.5px solid #1e40af", background: "#eff6ff",
  },
  produceCardDimmed: { opacity: 0.6, cursor: "default" },
  produceCardTop: {
    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px",
  },
  produceName: { fontSize: "15px", fontWeight: "600", color: "#111827" },
  produceCardMeta: {
    display: "flex", gap: "16px", fontSize: "12px", color: "#6b7280",
  },
  selectHint: {
    fontSize: "11px", color: "#1e40af", fontWeight: "600",
    marginTop: "8px", letterSpacing: "0.3px",
  },
  empty: { textAlign: "center", padding: "40px", color: "#9ca3af", fontSize: "14px" },
  gradePanel: {
    background: "#fff", borderRadius: "14px", padding: "28px",
    boxShadow: "0 1px 8px rgba(0,0,0,0.06)", position: "sticky", top: "24px",
  },
  gradePanelTitle: {
    fontSize: "17px", fontWeight: "700", color: "#111827",
    margin: "0 0 24px", fontFamily: "'Georgia', serif",
  },
  noSelection: { textAlign: "center", padding: "32px 16px" },
  noSelectionIcon: { fontSize: "40px", marginBottom: "12px" },
  noSelectionText: { fontSize: "14px", color: "#9ca3af", lineHeight: 1.6 },
  selectedInfo: {
    background: "#f9fafb", borderRadius: "10px", padding: "16px", marginBottom: "20px",
  },
  selectedLabel: { fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px" },
  selectedName: { fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0 0 6px", fontFamily: "'Georgia', serif" },
  selectedMeta: { display: "flex", gap: "8px", fontSize: "12px", color: "#6b7280", flexWrap: "wrap" },
  gradeInputWrap: { marginBottom: "16px" },
  gradeLabel: { fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "8px" },
  gradeInput: {
    width: "100%", padding: "12px 14px", border: "1.5px solid #e5e7eb",
    borderRadius: "8px", fontSize: "20px", fontWeight: "700", color: "#111827",
    outline: "none", background: "#fafafa", boxSizing: "border-box", textAlign: "center",
  },
  gradePreview: {
    marginTop: "10px", padding: "10px 14px", borderRadius: "8px",
    border: "1px solid", fontSize: "13px", fontWeight: "600", textAlign: "center",
  },
  sliderWrap: { marginBottom: "20px" },
  slider: { width: "100%", accentColor: "#1e40af", marginBottom: "6px" },
  sliderLabels: {
    display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9ca3af",
  },
  submitBtn: {
    width: "100%", padding: "14px", background: "linear-gradient(135deg, #1e40af, #3b82f6)",
    color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px",
    fontWeight: "600", cursor: "pointer", marginBottom: "10px",
  },
  cancelBtn: {
    width: "100%", padding: "12px", background: "#fff", color: "#6b7280",
    border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px",
    fontWeight: "600", cursor: "pointer",
  },
};

export default GradingForm;