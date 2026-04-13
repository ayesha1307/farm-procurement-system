import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { addProduce } from "../../services/produceService";
import DashboardLayout from "../../components/layout/DashboardLayout";

const farmerNav = [
  { icon: "🏡", label: "Dashboard", to: "/farmer/dashboard" },
  { icon: "📤", label: "Submit Produce", to: "/farmer/submit" },
  { icon: "📋", label: "My Produce", to: "/farmer/history" },
];

const CATEGORIES = ["Grain", "Vegetable", "Fruit", "Dairy", "Spice", "Pulse", "Other"];

const SubmitProduce = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", category: "", quantity: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("USER OBJECT:", user);
    console.log("Farmer ID:", user?.id);
    if (!form.name || !form.category || !form.quantity) {
      setError("All fields are required.");
      return;
    }
    if (form.quantity <= 0) {
      setError("Quantity must be greater than 0.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await addProduce({
        name: form.name,
        category: form.category,
        quantity: parseInt(form.quantity),
        farmer: { id: user.id },
      });
      setSuccess(true);
      setTimeout(() => navigate("/farmer/history"), 1800);
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout navItems={farmerNav}>
      <div style={styles.header}>
        <h1 style={styles.title}>Submit Produce</h1>
        <p style={styles.subtitle}>Fill in the details of your harvest to submit for inspection.</p>
      </div>

      <div style={styles.cardWrap}>
        <div style={styles.card}>
          {success ? (
            <div style={styles.successBox}>
              <div style={styles.successIcon}>✅</div>
              <h3 style={styles.successTitle}>Submitted Successfully!</h3>
              <p style={styles.successText}>Your produce has been submitted. Redirecting to history...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Produce Name</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="e.g. Wheat, Tomato, Rice"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onFocus={(e) => (e.target.style.borderColor = "#4a7c59")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Category</label>
                <select
                  style={styles.input}
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  onFocus={(e) => (e.target.style.borderColor = "#4a7c59")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                >
                  <option value="">-- Select category --</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Quantity (kg)</label>
                <input
                  style={styles.input}
                  type="number"
                  placeholder="e.g. 100"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  onFocus={(e) => (e.target.style.borderColor = "#4a7c59")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>

              {/* Preview */}
              {form.name && form.category && form.quantity && (
                <div style={styles.preview}>
                  <p style={styles.previewTitle}>📋 Preview</p>
                  <div style={styles.previewGrid}>
                    <span style={styles.previewKey}>Produce</span>
                    <span style={styles.previewVal}>{form.name}</span>
                    <span style={styles.previewKey}>Category</span>
                    <span style={styles.previewVal}>{form.category}</span>
                    <span style={styles.previewKey}>Quantity</span>
                    <span style={styles.previewVal}>{form.quantity} kg</span>
                    <span style={styles.previewKey}>Farmer</span>
                    <span style={styles.previewVal}>{user?.name}</span>
                    <span style={styles.previewKey}>Status</span>
                    <span style={{ ...styles.previewVal, color: "#ca8a04", fontWeight: "600" }}>SUBMITTED</span>
                  </div>
                </div>
              )}

              {error && <p style={styles.error}>⚠️ {error}</p>}

              <div style={styles.actions}>
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={() => navigate("/farmer/dashboard")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Produce →"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Info panel */}
        <div style={styles.infoPanel}>
          <h3 style={styles.infoTitle}>How it works</h3>
          <div style={styles.steps}>
            {[
              { step: "1", text: "Submit your produce details here" },
              { step: "2", text: "An inspector will grade your produce" },
              { step: "3", text: "Grade ≥ 80 → APPROVED, else REJECTED" },
              { step: "4", text: "Approved produce is available for procurement" },
            ].map((s) => (
              <div key={s.step} style={styles.stepItem}>
                <div style={styles.stepNum}>{s.step}</div>
                <p style={styles.stepText}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const styles = {
  header: { marginBottom: "28px" },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#1a3a2a",
    margin: "0 0 6px",
    fontFamily: "'Georgia', serif",
  },
  subtitle: { fontSize: "14px", color: "#6b7280", margin: 0 },
  cardWrap: { display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "start" },
  card: {
    background: "#fff",
    borderRadius: "14px",
    padding: "36px",
    boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
  },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    letterSpacing: "0.2px",
  },
  input: {
    padding: "12px 14px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    color: "#111827",
    background: "#fafafa",
    fontFamily: "'system-ui', sans-serif",
  },
  preview: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "10px",
    padding: "16px 20px",
  },
  previewTitle: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#16a34a",
    margin: "0 0 10px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: "6px 16px",
  },
  previewKey: { fontSize: "13px", color: "#6b7280" },
  previewVal: { fontSize: "13px", color: "#111827", fontWeight: "500" },
  error: {
    background: "#fef2f2",
    color: "#dc2626",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    margin: 0,
    border: "1px solid #fecaca",
  },
  actions: { display: "flex", gap: "12px", justifyContent: "flex-end" },
  cancelBtn: {
    padding: "12px 20px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "8px",
    background: "#fff",
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'system-ui', sans-serif",
  },
  submitBtn: {
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #2d5a3d, #4a7c59)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'system-ui', sans-serif",
  },
  successBox: {
    textAlign: "center",
    padding: "48px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  successIcon: { fontSize: "48px" },
  successTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1a3a2a",
    margin: 0,
    fontFamily: "'Georgia', serif",
  },
  successText: { fontSize: "14px", color: "#6b7280", margin: 0 },
  infoPanel: {
    background: "#fff",
    borderRadius: "14px",
    padding: "28px",
    boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
  },
  infoTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 20px",
    fontFamily: "'Georgia', serif",
  },
  steps: { display: "flex", flexDirection: "column", gap: "16px" },
  stepItem: { display: "flex", gap: "14px", alignItems: "flex-start" },
  stepNum: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#16a34a",
    fontWeight: "700",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepText: { fontSize: "13px", color: "#6b7280", margin: "4px 0 0" },
};

export default SubmitProduce;