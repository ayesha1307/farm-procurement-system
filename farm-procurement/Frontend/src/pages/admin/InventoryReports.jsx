import { useEffect, useState } from "react";
import { getAllProduce } from "../../services/produceService";
import { getAllProcurements } from "../../services/procurementService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";

const adminNav = [
  { icon: "⚙️", label: "Dashboard", to: "/admin/dashboard" },
  { icon: "👥", label: "User Management", to: "/admin/users" },
  { icon: "📊", label: "Inventory Reports", to: "/admin/inventory" },
];

const InventoryReports = () => {
  const [produce, setProduce] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("INVENTORY");

  useEffect(() => {
    Promise.all([getAllProduce(), getAllProcurements()])
      .then(([p, o]) => {
        setProduce(Array.isArray(p) ? p : []);
        setOrders(Array.isArray(o) ? o : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Inventory: group approved produce by category
  const inventoryMap = {};
  produce.filter(p => p.status === "APPROVED").forEach(p => {
    const cat = p.category || "Other";
    if (!inventoryMap[cat]) inventoryMap[cat] = { category: cat, count: 0, totalQty: 0, items: [] };
    inventoryMap[cat].count += 1;
    inventoryMap[cat].totalQty += p.quantity || 0;
    inventoryMap[cat].items.push(p);
  });
  const inventory = Object.values(inventoryMap);

  // Procurement analytics
  const totalValue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const approvedValue = orders.filter(o => o.status === "APPROVED").reduce((s, o) => s + (o.totalAmount || 0), 0);
  const categoryMap = {};
  orders.forEach(o => {
    const cat = o.produce?.category || "Other";
    if (!categoryMap[cat]) categoryMap[cat] = { category: cat, orders: 0, totalQty: 0, totalValue: 0 };
    categoryMap[cat].orders += 1;
    categoryMap[cat].totalQty += o.quantity || 0;
    categoryMap[cat].totalValue += o.totalAmount || 0;
  });
  const categoryStats = Object.values(categoryMap);

  const inventoryStatus = (qty) => {
    if (qty === 0) return { label: "OUT OF STOCK", color: "#ef4444", bg: "#fef2f2" };
    if (qty < 50) return { label: "LOW STOCK", color: "#f59e0b", bg: "#fffbeb" };
    return { label: "AVAILABLE", color: "#22c55e", bg: "#f0fdf4" };
  };

  return (
    <DashboardLayout navItems={adminNav}>
      <div style={s.header}>
        <div>
          <p style={s.sup}>ADMIN · REPORTS</p>
          <h1 style={s.title}>Inventory & Reports</h1>
          <p style={s.sub}>Monitor inventory stock and procurement analytics.</p>
        </div>
      </div>

      {loading ? <Loader /> : (
        <>
          {/* Summary stats */}
          <div style={s.statsGrid}>
            <div style={{ ...s.statCard, borderTop: "4px solid #22c55e" }}>
              <p style={s.statLabel}>Approved Produce</p>
              <p style={s.statValue}>{produce.filter(p => p.status === "APPROVED").length}</p>
              <p style={s.statSub}>Ready for procurement</p>
            </div>
            <div style={{ ...s.statCard, borderTop: "4px solid #6366f1" }}>
              <p style={s.statLabel}>Total Categories</p>
              <p style={s.statValue}>{inventory.length}</p>
              <p style={s.statSub}>Active produce types</p>
            </div>
            <div style={{ ...s.statCard, borderTop: "4px solid #f59e0b" }}>
              <p style={s.statLabel}>Total Orders</p>
              <p style={s.statValue}>{orders.length}</p>
              <p style={s.statSub}>{orders.filter(o => o.status === "APPROVED").length} approved</p>
            </div>
            <div style={{ ...s.statCard, borderTop: "4px solid #ec4899" }}>
              <p style={s.statLabel}>Total Procurement Value</p>
              <p style={s.statValue}>₹{totalValue.toLocaleString()}</p>
              <p style={s.statSub}>₹{approvedValue.toLocaleString()} approved</p>
            </div>
          </div>

          {/* Tab switcher */}
          <div style={s.tabs}>
            {["INVENTORY", "PROCUREMENT", "ALL PRODUCE"].map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                style={{ ...s.tab, ...(activeTab === t ? s.tabActive : {}) }}>
                {t}
              </button>
            ))}
          </div>

          {/* INVENTORY VIEW */}
          {activeTab === "INVENTORY" && (
            <div style={s.card}>
              <h2 style={s.cardTitle}>Produce Inventory by Category</h2>
              <p style={s.cardSub}>Based on approved produce available for procurement.</p>
              {inventory.length === 0 ? (
                <div style={s.empty}>📦 No approved produce in inventory yet.</div>
              ) : (
                <>
                  <div style={s.thead}>
                    <span>Category</span><span>Items</span><span>Total Qty (kg)</span><span>Status</span>
                  </div>
                  {inventory.map((item, i) => {
                    const status = inventoryStatus(item.totalQty);
                    return (
                      <div key={i} style={s.trow}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={s.catIcon}>🌾</div>
                          <span style={s.bold}>{item.category}</span>
                        </div>
                        <span style={s.muted}>{item.count} items</span>
                        <span style={{ ...s.bold, color: "#006948" }}>{item.totalQty} kg</span>
                        <span style={{ background: status.bg, color: status.color, padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                          {status.label}
                        </span>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}

          {/* PROCUREMENT VIEW */}
          {activeTab === "PROCUREMENT" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Category breakdown */}
              <div style={s.card}>
                <h2 style={s.cardTitle}>Procurement by Category</h2>
                {categoryStats.length === 0 ? (
                  <div style={s.empty}>No procurement orders yet.</div>
                ) : (
                  <>
                    <div style={{ ...s.thead, gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
                      <span>Category</span><span>Orders</span><span>Total Qty</span><span>Total Value</span>
                    </div>
                    {categoryStats.map((c, i) => (
                      <div key={i} style={{ ...s.trow, gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
                        <span style={s.bold}>{c.category}</span>
                        <span style={s.muted}>{c.orders}</span>
                        <span style={s.muted}>{c.totalQty} kg</span>
                        <span style={{ ...s.bold, color: "#006948" }}>₹{c.totalValue.toLocaleString()}</span>
                      </div>
                    ))}
                    <div style={{ padding: "14px 12px", background: "#f9fafb", borderRadius: 8, marginTop: 8, display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>TOTAL</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{orders.length}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{orders.reduce((s, o) => s + (o.quantity || 0), 0)} kg</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#006948" }}>₹{totalValue.toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>

              {/* All orders */}
              <div style={s.card}>
                <h2 style={s.cardTitle}>All Procurement Orders</h2>
                {orders.length === 0 ? <div style={s.empty}>No orders yet.</div> : (
                  <>
                    <div style={{ ...s.thead, gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }}>
                      <span>Produce</span><span>Qty</span><span>Price/kg</span><span>Total</span><span>Status</span>
                    </div>
                    {[...orders].reverse().map(o => (
                      <div key={o.id} style={{ ...s.trow, gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }}>
                        <span style={s.bold}>{o.produce?.name || "—"}</span>
                        <span style={s.muted}>{o.quantity} kg</span>
                        <span style={s.muted}>₹{o.price}</span>
                        <span style={{ ...s.bold, color: "#006948" }}>₹{o.totalAmount}</span>
                        <StatusBadge status={o.status} />
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

          {/* ALL PRODUCE VIEW */}
          {activeTab === "ALL PRODUCE" && (
            <div style={s.card}>
              <h2 style={s.cardTitle}>All Farm Produce Records</h2>
              <div style={{ ...s.thead, gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }}>
                <span>Name</span><span>Category</span><span>Farmer</span><span>Quantity</span><span>Status</span>
              </div>
              {produce.length === 0 ? <div style={s.empty}>No produce submitted yet.</div> :
                [...produce].reverse().map(p => (
                  <div key={p.id} style={{ ...s.trow, gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }}>
                    <span style={s.bold}>{p.name}</span>
                    <span style={s.muted}>{p.category}</span>
                    <span style={s.muted}>{p.farmer?.name || "—"}</span>
                    <span style={s.muted}>{p.quantity} kg</span>
                    <StatusBadge status={p.status} />
                  </div>
                ))
              }
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

const s = {
  header: { marginBottom: 28 },
  sup: { fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, color: "#006948", margin: "0 0 4px" },
  title: { fontSize: 26, fontWeight: 800, color: "#1a2e1f", margin: "0 0 6px", fontFamily: "'Manrope',sans-serif" },
  sub: { fontSize: 14, color: "#6b7280", margin: 0 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 },
  statCard: { background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" },
  statLabel: { fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 6px" },
  statValue: { fontSize: 26, fontWeight: 800, color: "#111827", margin: "0 0 4px", fontFamily: "'Manrope',sans-serif" },
  statSub: { fontSize: 11, color: "#9ca3af", margin: 0 },
  tabs: { display: "flex", gap: 8, marginBottom: 20 },
  tab: { padding: "9px 18px", border: "1.5px solid #e5e7eb", borderRadius: 8, background: "#fff", color: "#6b7280", fontSize: 12, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: 0.5 },
  tabActive: { background: "#1a2e1f", color: "#fff", borderColor: "#1a2e1f" },
  card: { background: "#fff", borderRadius: 14, padding: "24px 28px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" },
  cardTitle: { fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 6px", fontFamily: "'Manrope',sans-serif" },
  cardSub: { fontSize: 13, color: "#9ca3af", margin: "0 0 20px" },
  thead: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "10px 12px", background: "#f9fafb", borderRadius: 8, fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  trow: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "13px 12px", borderBottom: "1px solid #f3f4f6", alignItems: "center" },
  catIcon: { width: 30, height: 30, borderRadius: 8, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 },
  bold: { fontSize: 13, fontWeight: 600, color: "#111827" },
  muted: { fontSize: 13, color: "#6b7280" },
  empty: { textAlign: "center", padding: "40px", color: "#9ca3af", fontSize: 14 },
};

export default InventoryReports;