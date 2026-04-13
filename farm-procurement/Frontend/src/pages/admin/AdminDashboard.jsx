import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProduce } from "../../services/produceService";
import { getAllProcurements } from "../../services/procurementService";
import { getAllUsers } from "../../services/userService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";

const adminNav = [
  { icon: "⚙️", label: "Dashboard", to: "/admin/dashboard" },
  { icon: "👥", label: "User Management", to: "/admin/users" },
  { icon: "📊", label: "Inventory Reports", to: "/admin/inventory" },
];

const StatCard = ({ icon, label, value, sub, color }) => (
  <div style={{ ...s.statCard, borderTop: `4px solid ${color}` }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p style={s.statLabel}>{label}</p>
        <p style={s.statValue}>{value}</p>
        {sub && <p style={s.statSub}>{sub}</p>}
      </div>
      <div style={{ ...s.statIconWrap, background: color + "18" }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [produce, setProduce] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllProduce(), getAllProcurements(), getAllUsers()])
      .then(([p, o, u]) => {
        setProduce(Array.isArray(p) ? p : []);
        setOrders(Array.isArray(o) ? o : []);
        setUsers(Array.isArray(u) ? u : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const approved = produce.filter(p => p.status === "APPROVED").length;
  const submitted = produce.filter(p => p.status === "SUBMITTED").length;
  const rejected = produce.filter(p => p.status === "REJECTED").length;
  const totalValue = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const approvedOrders = orders.filter(o => o.status === "APPROVED").length;
  const farmers = users.filter(u => u.role === "FARMER").length;
  const inspectors = users.filter(u => u.role === "INSPECTOR").length;

  const recentProduce = [...produce].reverse().slice(0, 6);
  const recentOrders = [...orders].reverse().slice(0, 5);

  return (
    <DashboardLayout navItems={adminNav}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <p style={s.headerSup}>SYSTEM OVERVIEW</p>
          <h1 style={s.headerTitle}>Admin Dashboard</h1>
          <p style={s.headerSub}>Monitor all produce, inspections, procurement and users.</p>
        </div>
        <div style={s.headerActions}>
          <Link to="/admin/users" style={s.btnPrimary}>+ Add User</Link>
        </div>
      </div>

      {loading ? <Loader /> : (
        <>
          {/* Stats row */}
          <div style={s.statsGrid}>
            <StatCard icon="📦" label="Total Produce" value={produce.length} sub={`${submitted} awaiting inspection`} color="#6366f1" />
            <StatCard icon="✅" label="Approved Produce" value={approved} sub={`${rejected} rejected`} color="#22c55e" />
            <StatCard icon="💰" label="Total Procurement" value={`₹${totalValue.toLocaleString()}`} sub={`${approvedOrders} orders approved`} color="#f59e0b" />
            <StatCard icon="👥" label="Registered Users" value={users.length} sub={`${farmers} farmers · ${inspectors} inspectors`} color="#ec4899" />
          </div>

          {/* Workflow status */}
          <div style={s.row2}>
            {/* Produce status breakdown */}
            <div style={s.card}>
              <div style={s.cardHeader}>
                <h2 style={s.cardTitle}>Produce Lifecycle Status</h2>
                <Link to="/admin/inventory" style={s.viewAll}>View Inventory →</Link>
              </div>
              <div style={s.lifecycleGrid}>
                {[
                  { label: "SUBMITTED", count: submitted, color: "#f59e0b", bg: "#fffbeb" },
                  { label: "APPROVED", count: approved, color: "#22c55e", bg: "#f0fdf4" },
                  { label: "REJECTED", count: rejected, color: "#ef4444", bg: "#fef2f2" },
                ].map(item => (
                  <div key={item.label} style={{ ...s.lifecycleItem, background: item.bg, borderColor: item.color + "40" }}>
                    <p style={{ ...s.lifecycleCount, color: item.color }}>{item.count}</p>
                    <p style={s.lifecycleLabel}>{item.label}</p>
                    <div style={{ ...s.lifecycleBar, background: item.color + "30" }}>
                      <div style={{ height: "100%", width: `${produce.length ? (item.count / produce.length) * 100 : 0}%`, background: item.color, borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent produce table */}
              <div style={s.tableHead}>
                <span>Produce</span><span>Category</span><span>Farmer</span><span>Status</span>
              </div>
              {recentProduce.map(p => (
                <div key={p.id} style={s.tableRow}>
                  <span style={s.bold}>{p.name}</span>
                  <span style={s.muted}>{p.category}</span>
                  <span style={s.muted}>{p.farmer?.name || "—"}</span>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* User breakdown */}
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <h2 style={s.cardTitle}>User Roles</h2>
                  <Link to="/admin/users" style={s.viewAll}>Manage →</Link>
                </div>
                {[
                  { role: "FARMER", icon: "👨‍🌾", color: "#22c55e" },
                  { role: "INSPECTOR", icon: "🔬", color: "#6366f1" },
                  { role: "PROCUREMENT", icon: "📦", color: "#f59e0b" },
                  { role: "ADMIN", icon: "⚙️", color: "#ec4899" },
                ].map(r => {
                  const count = users.filter(u => u.role === r.role).length;
                  return (
                    <div key={r.role} style={s.roleRow}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ ...s.roleIcon, background: r.color + "18" }}>{r.icon}</span>
                        <span style={s.roleName}>{r.role}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 80, height: 6, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${users.length ? (count / users.length) * 100 : 0}%`, background: r.color, borderRadius: 4 }} />
                        </div>
                        <span style={{ ...s.muted, minWidth: 20 }}>{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent orders */}
              <div style={s.card}>
                <div style={s.cardHeader}>
                  <h2 style={s.cardTitle}>Recent Procurement</h2>
                </div>
                {recentOrders.length === 0 ? (
                  <p style={{ ...s.muted, textAlign: "center", padding: "20px 0" }}>No orders yet.</p>
                ) : recentOrders.map(o => (
                  <div key={o.id} style={s.orderRow}>
                    <div>
                      <p style={s.bold}>{o.produce?.name || "—"}</p>
                      <p style={{ ...s.muted, fontSize: 11 }}>{o.quantity} kg · ₹{o.price}/kg</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ ...s.bold, color: "#006948" }}>₹{o.totalAmount}</p>
                      <StatusBadge status={o.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Grade rule reference */}
          <div style={{ ...s.card, marginTop: 20 }}>
            <h2 style={s.cardTitle}>Quality Grade Reference</h2>
            <div style={s.gradeGrid}>
              {[
                { grade: "Grade A", range: "85–100", color: "#22c55e", desc: "Premium quality — eligible for all procurement" },
                { grade: "Grade B", range: "60–84", color: "#f59e0b", desc: "Standard quality — eligible for bulk procurement" },
                { grade: "Grade C", range: "0–59", color: "#ef4444", desc: "Below standard — rejected from procurement" },
              ].map(g => (
                <div key={g.grade} style={{ ...s.gradeCard, borderLeft: `4px solid ${g.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{g.grade}</span>
                    <span style={{ fontWeight: 800, fontSize: 14, color: g.color }}>Score {g.range}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

const s = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 },
  headerSup: { fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, color: "#006948", marginBottom: 4, margin: "0 0 4px" },
  headerTitle: { fontSize: 28, fontWeight: 800, color: "#1a2e1f", margin: "0 0 6px", fontFamily: "'Manrope', sans-serif", letterSpacing: -0.5 },
  headerSub: { fontSize: 14, color: "#6b7280", margin: 0 },
  headerActions: { display: "flex", gap: 12 },
  btnPrimary: { background: "linear-gradient(135deg,#006948,#52c98a)", color: "#fff", padding: "12px 20px", borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 700 },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 },
  statCard: { background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" },
  statLabel: { fontSize: 12, color: "#6b7280", margin: "0 0 6px", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 },
  statValue: { fontSize: 28, fontWeight: 800, color: "#111827", margin: "0 0 4px", fontFamily: "'Manrope',sans-serif" },
  statSub: { fontSize: 11, color: "#9ca3af", margin: 0 },
  statIconWrap: { width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" },
  row2: { display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 },
  card: { background: "#fff", borderRadius: 14, padding: "24px 28px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: 700, color: "#111827", margin: 0, fontFamily: "'Manrope',sans-serif" },
  viewAll: { fontSize: 12, color: "#006948", textDecoration: "none", fontWeight: 700 },
  lifecycleGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 },
  lifecycleItem: { borderRadius: 10, padding: "14px 16px", border: "1px solid" },
  lifecycleCount: { fontSize: 28, fontWeight: 800, margin: "0 0 4px", fontFamily: "'Manrope',sans-serif" },
  lifecycleLabel: { fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#6b7280", margin: "0 0 8px" },
  lifecycleBar: { height: 6, borderRadius: 4, overflow: "hidden" },
  tableHead: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "8px 12px", background: "#f9fafb", borderRadius: 8, fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  tableRow: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "12px 12px", borderBottom: "1px solid #f3f4f6", alignItems: "center" },
  bold: { fontSize: 13, fontWeight: 600, color: "#111827" },
  muted: { fontSize: 13, color: "#6b7280" },
  roleRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f9fafb" },
  roleIcon: { width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 },
  roleName: { fontSize: 13, fontWeight: 600, color: "#374151" },
  orderRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f9fafb" },
  gradeGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 16 },
  gradeCard: { background: "#f9fafb", borderRadius: 10, padding: "14px 16px" },
};

export default AdminDashboard;