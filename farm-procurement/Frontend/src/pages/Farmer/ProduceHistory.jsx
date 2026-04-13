import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAllProduce } from "../../services/produceService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatusBadge from "../../components/common/StatusBadge";
import Loader from "../../components/common/Loader";

const farmerNav = [
  { icon: "🏡", label: "Dashboard", to: "/farmer/dashboard" },
  { icon: "📤", label: "Submit Produce", to: "/farmer/submit" },
  { icon: "📋", label: "My Produce", to: "/farmer/history" },
];

const ProduceHistory = () => {
  const { user } = useAuth();
  const [produce, setProduce] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    getAllProduce()
      .then((data) => {
        const mine = data.filter((p) => p.farmer?.id === user?.id);
        setProduce(mine);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const statuses = ["ALL", "SUBMITTED", "APPROVED", "REJECTED"];
  const filtered = filter === "ALL" ? produce : produce.filter((p) => p.status === filter);

  return (
    <DashboardLayout navItems={farmerNav}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Produce</h1>
          <p style={styles.subtitle}>All your submissions and their inspection results.</p>
        </div>
        <Link to="/farmer/submit" style={styles.addBtn}>+ Submit New</Link>
      </div>

      {/* Filter tabs */}
      <div style={styles.tabs}>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{ ...styles.tab, ...(filter === s ? styles.tabActive : {}) }}
          >
            {s}
            <span style={styles.tabCount}>
              {s === "ALL" ? produce.length : produce.filter((p) => p.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? <Loader /> : (
        <div style={styles.tableCard}>
          {filtered.length === 0 ? (
            <div style={styles.empty}>
              <p style={styles.emptyIcon}>📭</p>
              <p style={styles.emptyText}>No produce found for this filter.</p>
            </div>
          ) : (
            <>
              <div style={styles.tableHead}>
                <span>#</span>
                <span>Produce</span>
                <span>Category</span>
                <span>Quantity</span>
                <span>Status</span>
              </div>
              {filtered.map((p, i) => (
                <div key={p.id} style={styles.tableRow}>
                  <span style={styles.idx}>{i + 1}</span>
                  <span style={styles.name}>{p.name}</span>
                  <span style={styles.cell}>{p.category}</span>
                  <span style={styles.cell}>{p.quantity} kg</span>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#1a3a2a",
    margin: "0 0 6px",
    fontFamily: "'Georgia', serif",
  },
  subtitle: { fontSize: "14px", color: "#6b7280", margin: 0 },
  addBtn: {
    background: "linear-gradient(135deg, #2d5a3d, #4a7c59)",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "10px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
  },
  tabs: {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "8px",
    background: "#fff",
    color: "#6b7280",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'system-ui', sans-serif",
    transition: "all 0.15s",
  },
  tabActive: {
    background: "#1a3a2a",
    color: "#fff",
    borderColor: "#1a3a2a",
  },
  tabCount: {
    background: "rgba(255,255,255,0.2)",
    borderRadius: "999px",
    padding: "1px 7px",
    fontSize: "11px",
  },
  tableCard: {
    background: "#fff",
    borderRadius: "14px",
    padding: "8px",
    boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
    overflow: "hidden",
  },
  tableHead: {
    display: "grid",
    gridTemplateColumns: "48px 2fr 1fr 1fr 1fr",
    padding: "12px 20px",
    background: "#f9fafb",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "4px",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "48px 2fr 1fr 1fr 1fr",
    padding: "16px 20px",
    borderBottom: "1px solid #f3f4f6",
    alignItems: "center",
  },
  idx: { fontSize: "13px", color: "#d1d5db", fontWeight: "600" },
  name: { fontSize: "14px", fontWeight: "600", color: "#111827" },
  cell: { fontSize: "14px", color: "#6b7280" },
  empty: {
    textAlign: "center",
    padding: "60px",
  },
  emptyIcon: { fontSize: "40px", margin: "0 0 12px" },
  emptyText: { fontSize: "14px", color: "#9ca3af", margin: 0 },
};

export default ProduceHistory;