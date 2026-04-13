import { useEffect, useState } from "react";
import { getAllProduce } from "../../services/produceService";
import { createProcurement, getAllProcurements } from "../../services/procurementService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";

const procurementNav = [
  { icon: "📦", label: "Dashboard", to: "/procurement/dashboard" },
  { icon: "🛒", label: "Marketplace", to: "/procurement/marketplace" },
  { icon: "📋", label: "Order History", to: "/procurement/orders" },
];

const StatCard = ({ icon, label, value, color }) => (
  <div style={{ ...styles.statCard, borderTop: `4px solid ${color}` }}>
    <div style={styles.statIcon}>{icon}</div>
    <div style={styles.statValue}>{value}</div>
    <div style={styles.statLabel}>{label}</div>
  </div>
);

const ProcurementDashboard = () => {
  const [approvedProduce, setApprovedProduce] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ quantity: "", price: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [produce, procurements] = await Promise.all([
        getAllProduce(),
        getAllProcurements(),
      ]);
      setApprovedProduce(produce.filter((p) => p.status === "APPROVED"));
      setOrders(procurements);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOrder = async () => {
    if (!selected) { setError("Please select an approved produce."); return; }
    if (!form.quantity || form.quantity <= 0) { setError("Enter a valid quantity."); return; }
    if (!form.price || form.price <= 0) { setError("Enter a valid price."); return; }
    setSubmitting(true);
    setError("");
    try {
      await createProcurement(selected.id, parseInt(form.quantity), parseFloat(form.price));
      const total = form.quantity * form.price;
      setSuccess(`✅ Order placed! Total: ₹${total} — ${total >= 1000 ? "APPROVED" : "PENDING"}`);
      setSelected(null);
      setForm({ quantity: "", price: "" });
      fetchData();
      setTimeout(() => setSuccess(""), 4000);
    } catch {
      setError("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalOrders = orders.length;
  const approvedOrders = orders.filter((o) => o.status === "APPROVED").length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const totalValue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <DashboardLayout navItems={procurementNav}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Procurement Dashboard 📦</h1>
          <p style={styles.subtitle}>Place orders for approved produce and track procurement history.</p>
        </div>
      </div>

      {success && <div style={styles.successBanner}>{success}</div>}
      {error && <div style={styles.errorBanner}>⚠️ {error}</div>}

      {loading ? <Loader /> : (
        <>
          {/* Stats */}
          <div style={styles.statsGrid}>
            <StatCard icon="📋" label="Total Orders" value={totalOrders} color="#6366f1" />
            <StatCard icon="✅" label="Approved Orders" value={approvedOrders} color="#22c55e" />
            <StatCard icon="⏳" label="Pending Orders" value={pendingOrders} color="#f59e0b" />
            <StatCard icon="💰" label="Total Value (₹)" value={totalValue.toFixed(0)} color="#ec4899" />
          </div>

          <div style={styles.layout}>
            {/* Left: approved produce to order */}
            <div style={styles.leftPanel}>
              <h2 style={styles.panelTitle}>Available Approved Produce</h2>
              {approvedProduce.length === 0 ? (
                <div style={styles.empty}>
                  <p>No approved produce available for procurement.</p>
                  <p style={{ fontSize: "12px", color: "#9ca3af" }}>Produce must be graded ≥ 80 by an inspector first.</p>
                </div>
              ) : (
                <div style={styles.produceList}>
                  {approvedProduce.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        ...styles.produceCard,
                        ...(selected?.id === p.id ? styles.produceCardSelected : {}),
                      }}
                      onClick={() => { setSelected(p); setError(""); }}
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
                      {selected?.id === p.id && (
                        <div style={styles.selectHint}>✓ Selected</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: order form */}
            <div style={styles.orderPanel}>
              <h3 style={styles.orderPanelTitle}>Place Order</h3>

              {!selected ? (
                <div style={styles.noSelection}>
                  <div style={styles.noSelectionIcon}>📦</div>
                  <p style={styles.noSelectionText}>Select an approved produce from the list to place an order.</p>
                </div>
              ) : (
                <>
                  <div style={styles.selectedInfo}>
                    <p style={styles.selectedLabel}>Selected Produce</p>
                    <p style={styles.selectedName}>{selected.name}</p>
                    <div style={styles.selectedMeta}>
                      <span>{selected.category}</span>
                      <span>•</span>
                      <span>{selected.quantity} kg available</span>
                      <span>•</span>
                      <span>by {selected.farmer?.name}</span>
                    </div>
                  </div>

                  <div style={styles.field}>
                    <label style={styles.fieldLabel}>Quantity (kg)</label>
                    <input
                      type="number"
                      min="1"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      placeholder="e.g. 10"
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.field}>
                    <label style={styles.fieldLabel}>Price per kg (₹)</label>
                    <input
                      type="number"
                      min="1"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="e.g. 50"
                      style={styles.input}
                    />
                  </div>

                  {form.quantity && form.price && (
                    <div style={{
                      ...styles.totalPreview,
                      background: form.quantity * form.price >= 1000 ? "#f0fdf4" : "#fffbeb",
                      borderColor: form.quantity * form.price >= 1000 ? "#bbf7d0" : "#fde68a",
                      color: form.quantity * form.price >= 1000 ? "#16a34a" : "#d97706",
                    }}>
                      <span>Total: ₹{(form.quantity * form.price).toFixed(2)}</span>
                      <span style={{ fontSize: "12px" }}>
                        {form.quantity * form.price >= 1000 ? "→ APPROVED" : "→ PENDING (need ₹1000+)"}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={handleOrder}
                    disabled={submitting || !form.quantity || !form.price}
                    style={{ ...styles.submitBtn, opacity: submitting || !form.quantity || !form.price ? 0.6 : 1 }}
                  >
                    {submitting ? "Placing Order..." : "Place Order →"}
                  </button>

                  <button
                    onClick={() => { setSelected(null); setForm({ quantity: "", price: "" }); setError(""); }}
                    style={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Order History */}
          {orders.length > 0 && (
            <div style={{ ...styles.section, marginTop: "24px" }}>
              <h2 style={styles.panelTitle}>Order History</h2>
              <div style={styles.table}>
                <div style={styles.tableHead}>
                  <span>Produce</span>
                  <span>Quantity</span>
                  <span>Price/kg</span>
                  <span>Total</span>
                  <span>Status</span>
                </div>
                {orders.slice().reverse().map((o) => (
                  <div key={o.id} style={styles.tableRow}>
                    <span style={styles.produceName}>{o.produce?.name || "—"}</span>
                    <span style={styles.cell}>{o.quantity} kg</span>
                    <span style={styles.cell}>₹{o.price}</span>
                    <span style={{ ...styles.cell, fontWeight: "600", color: "#111827" }}>₹{o.totalAmount}</span>
                    <StatusBadge status={o.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

const styles = {
  header: { marginBottom: "28px" },
  title: { fontSize: "26px", fontWeight: "700", color: "#1a3a2a", margin: "0 0 6px", fontFamily: "'Georgia', serif" },
  subtitle: { fontSize: "14px", color: "#6b7280", margin: 0 },
  successBanner: { background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", padding: "14px 18px", borderRadius: "10px", marginBottom: "20px", fontSize: "14px", fontWeight: "600" },
  errorBanner: { background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "14px 18px", borderRadius: "10px", marginBottom: "20px", fontSize: "14px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" },
  statCard: { background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" },
  statIcon: { fontSize: "24px", marginBottom: "12px" },
  statValue: { fontSize: "32px", fontWeight: "700", color: "#111827", fontFamily: "'Georgia', serif", marginBottom: "4px" },
  statLabel: { fontSize: "13px", color: "#6b7280" },
  layout: { display: "grid", gridTemplateColumns: "1fr 360px", gap: "24px", alignItems: "start" },
  leftPanel: { background: "#fff", borderRadius: "14px", padding: "24px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" },
  panelTitle: { fontSize: "17px", fontWeight: "700", color: "#111827", margin: "0 0 20px", fontFamily: "'Georgia', serif" },
  produceList: { display: "flex", flexDirection: "column", gap: "10px" },
  produceCard: { border: "1.5px solid #e5e7eb", borderRadius: "10px", padding: "14px 16px", cursor: "pointer" },
  produceCardSelected: { border: "1.5px solid #7c3aed", background: "#faf5ff" },
  produceCardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  produceName: { fontSize: "15px", fontWeight: "600", color: "#111827" },
  produceCardMeta: { display: "flex", gap: "16px", fontSize: "12px", color: "#6b7280" },
  selectHint: { fontSize: "11px", color: "#7c3aed", fontWeight: "600", marginTop: "8px" },
  empty: { textAlign: "center", padding: "40px", color: "#9ca3af", fontSize: "14px", lineHeight: 2 },
  orderPanel: { background: "#fff", borderRadius: "14px", padding: "28px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", position: "sticky", top: "24px" },
  orderPanelTitle: { fontSize: "17px", fontWeight: "700", color: "#111827", margin: "0 0 24px", fontFamily: "'Georgia', serif" },
  noSelection: { textAlign: "center", padding: "32px 16px" },
  noSelectionIcon: { fontSize: "40px", marginBottom: "12px" },
  noSelectionText: { fontSize: "14px", color: "#9ca3af", lineHeight: 1.6 },
  selectedInfo: { background: "#f9fafb", borderRadius: "10px", padding: "16px", marginBottom: "20px" },
  selectedLabel: { fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px" },
  selectedName: { fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0 0 6px", fontFamily: "'Georgia', serif" },
  selectedMeta: { display: "flex", gap: "8px", fontSize: "12px", color: "#6b7280", flexWrap: "wrap" },
  field: { marginBottom: "16px" },
  fieldLabel: { fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" },
  input: { width: "100%", padding: "12px 14px", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "15px", outline: "none", background: "#fafafa", boxSizing: "border-box" },
  totalPreview: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: "8px", border: "1px solid", fontSize: "14px", fontWeight: "600", marginBottom: "16px" },
  submitBtn: { width: "100%", padding: "14px", background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "600", cursor: "pointer", marginBottom: "10px" },
  cancelBtn: { width: "100%", padding: "12px", background: "#fff", color: "#6b7280", border: "1.5px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" },
  section: { background: "#fff", borderRadius: "14px", padding: "28px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" },
  table: { display: "flex", flexDirection: "column" },
  tableHead: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "10px 16px", background: "#f9fafb", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" },
  tableRow: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "14px 16px", borderBottom: "1px solid #f3f4f6", alignItems: "center" },
  cell: { fontSize: "14px", color: "#6b7280" },
};

export default ProcurementDashboard;