import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAllProduce } from "../../services/produceService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";

const inspectorNav = [
  { icon: "🔬", label: "Dashboard", to: "/inspector/dashboard" },
  { icon: "📋", label: "Grade Produce", to: "/inspector/grade" },
];

const StatCard = ({ icon, label, value, color }) => (
  <div style={{ ...styles.statCard, borderTop: `4px solid ${color}` }}>
    <div style={styles.statIcon}>{icon}</div>
    <div style={styles.statValue}>{value}</div>
    <div style={styles.statLabel}>{label}</div>
  </div>
);

const InspectorDashboard = () => {
  const { user } = useAuth();
  const [produce, setProduce] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProduce()
      .then((data) => setProduce(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const submitted = produce.filter((p) => p.status === "SUBMITTED").length;
  const approved = produce.filter((p) => p.status === "APPROVED").length;
  const rejected = produce.filter((p) => p.status === "REJECTED").length;
  const pending = produce.filter((p) => p.status === "SUBMITTED");
  const recent = produce.slice(-5).reverse();

  return (
    <DashboardLayout navItems={inspectorNav}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.greeting}>Inspector Panel, {user?.name} 🔬</h1>
          <p style={styles.subGreeting}>Review and grade submitted produce for quality approval.</p>
        </div>
        <Link to="/inspector/grade" style={styles.gradeBtn}>
          + Grade Produce
        </Link>
      </div>

      {loading ? <Loader /> : (
        <>
          <div style={styles.statsGrid}>
            <StatCard icon="⏳" label="Awaiting Grading" value={submitted} color="#f59e0b" />
            <StatCard icon="✅" label="Approved" value={approved} color="#22c55e" />
            <StatCard icon="❌" label="Rejected" value={rejected} color="#ef4444" />
            <StatCard icon="📦" label="Total Produce" value={produce.length} color="#6366f1" />
          </div>

          {/* Pending grading */}
          {pending.length > 0 && (
            <div style={{ ...styles.section, marginBottom: "24px" }}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>⚠️ Needs Grading</h2>
                <Link to="/inspector/grade" style={styles.viewAll}>Grade now →</Link>
              </div>
              <div style={styles.table}>
                <div style={styles.tableHead}>
                  <span>Name</span>
                  <span>Category</span>
                  <span>Farmer</span>
                  <span>Quantity</span>
                  <span>Action</span>
                </div>
                {pending.slice(0, 5).map((p) => (
                  <div key={p.id} style={styles.tableRow}>
                    <span style={styles.produceName}>{p.name}</span>
                    <span style={styles.cell}>{p.category}</span>
                    <span style={styles.cell}>{p.farmer?.name || "—"}</span>
                    <span style={styles.cell}>{p.quantity} kg</span>
                    <Link to={`/inspector/grade`} style={styles.gradeLink}>Grade →</Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent all produce */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>All Recent Produce</h2>
            </div>
            {recent.length === 0 ? (
              <p style={styles.emptyText}>No produce submitted yet.</p>
            ) : (
              <div style={styles.table}>
                <div style={{ ...styles.tableHead, gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }}>
                  <span>Name</span>
                  <span>Category</span>
                  <span>Farmer</span>
                  <span>Quantity</span>
                  <span>Status</span>
                </div>
                {recent.map((p) => (
                  <div key={p.id} style={{ ...styles.tableRow, gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }}>
                    <span style={styles.produceName}>{p.name}</span>
                    <span style={styles.cell}>{p.category}</span>
                    <span style={styles.cell}>{p.farmer?.name || "—"}</span>
                    <span style={styles.cell}>{p.quantity} kg</span>
                    <StatusBadge status={p.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px",
  },
  greeting: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#1a3a2a",
    margin: "0 0 6px",
    fontFamily: "'Georgia', serif",
  },
  subGreeting: { fontSize: "14px", color: "#6b7280", margin: 0 },
  gradeBtn: {
    background: "linear-gradient(135deg, #1e40af, #3b82f6)",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "10px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "32px",
  },
  statCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
  },
  statIcon: { fontSize: "24px", marginBottom: "12px" },
  statValue: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#111827",
    fontFamily: "'Georgia', serif",
    marginBottom: "4px",
  },
  statLabel: { fontSize: "13px", color: "#6b7280" },
  section: {
    background: "#fff",
    borderRadius: "14px",
    padding: "28px",
    boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
    fontFamily: "'Georgia', serif",
  },
  viewAll: { fontSize: "13px", color: "#1e40af", textDecoration: "none", fontWeight: "600" },
  table: { display: "flex", flexDirection: "column" },
  tableHead: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
    padding: "10px 16px",
    background: "#f9fafb",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "4px",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
    padding: "14px 16px",
    borderBottom: "1px solid #f3f4f6",
    alignItems: "center",
  },
  produceName: { fontSize: "14px", fontWeight: "600", color: "#111827" },
  cell: { fontSize: "14px", color: "#6b7280" },
  gradeLink: {
    color: "#1e40af",
    fontSize: "13px",
    fontWeight: "600",
    textDecoration: "none",
    background: "#eff6ff",
    padding: "4px 10px",
    borderRadius: "6px",
  },
  emptyText: { fontSize: "14px", color: "#9ca3af", textAlign: "center", padding: "24px" },
};

export default InspectorDashboard;