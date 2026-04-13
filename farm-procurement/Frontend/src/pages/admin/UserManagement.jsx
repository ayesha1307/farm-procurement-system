import { useEffect, useState } from "react";
import { getAllUsers, createUser } from "../../services/userService";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Loader from "../../components/common/Loader";

const adminNav = [
  { icon: "⚙️", label: "Dashboard", to: "/admin/dashboard" },
  { icon: "👥", label: "User Management", to: "/admin/users" },
  { icon: "📊", label: "Inventory Reports", to: "/admin/inventory" },
];

const ROLES = ["FARMER", "INSPECTOR", "PROCUREMENT", "ADMIN"];

const roleColors = {
  FARMER:      { bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e" },
  INSPECTOR:   { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" },
  PROCUREMENT: { bg: "#faf5ff", color: "#7c3aed", dot: "#a855f7" },
  ADMIN:       { bg: "#fff1f2", color: "#be123c", dot: "#f43f5e" },
};

const RoleBadge = ({ role }) => {
  const c = roleColors[role] || { bg: "#f3f4f6", color: "#374151", dot: "#9ca3af" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: c.bg, color: c.color, padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: 0.3 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
      {role}
    </span>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    getAllUsers()
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = filter === "ALL" ? users : users.filter(u => u.role === filter);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.role) { setError("All fields required."); return; }
    setSubmitting(true); setError("");
    try {
      await createUser(form);
      setSuccess(`✅ ${form.name} added as ${form.role}`);
      setForm({ name: "", email: "", role: "" });
      setShowForm(false);
      fetchUsers();
      setTimeout(() => setSuccess(""), 3000);
    } catch { setError("Failed to create user."); }
    finally { setSubmitting(false); }
  };

  return (
    <DashboardLayout navItems={adminNav}>
      <div style={s.header}>
        <div>
          <p style={s.sup}>ADMIN · USER MANAGEMENT</p>
          <h1 style={s.title}>User Management</h1>
          <p style={s.sub}>Create, view and filter users by role.</p>
        </div>
        <button style={s.btnPrimary} onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Cancel" : "+ Add User"}
        </button>
      </div>

      {success && <div style={s.successBox}>{success}</div>}

      {/* Create user form */}
      {showForm && (
        <div style={s.formCard}>
          <h3 style={s.formTitle}>Create New User</h3>
          <form onSubmit={handleCreate} style={s.form}>
            <div style={s.formGrid}>
              <div style={s.field}>
                <label style={s.label}>Full Name</label>
                <input style={s.input} placeholder="e.g. Rajan Kumar" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Email Address</label>
                <input style={s.input} type="email" placeholder="e.g. rajan@farm.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Role</label>
                <select style={s.input} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option value="">-- Select Role --</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            {error && <p style={s.err}>⚠️ {error}</p>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
              <button type="button" style={s.btnCancel} onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" style={{ ...s.btnPrimary, opacity: submitting ? 0.7 : 1 }} disabled={submitting}>
                {submitting ? "Creating..." : "Create User →"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div style={s.tabs}>
        {["ALL", ...ROLES].map(r => (
          <button key={r} onClick={() => setFilter(r)}
            style={{ ...s.tab, ...(filter === r ? s.tabActive : {}) }}>
            {r}
            <span style={s.tabCount}>{r === "ALL" ? users.length : users.filter(u => u.role === r).length}</span>
          </button>
        ))}
      </div>

      {/* Users table */}
      {loading ? <Loader /> : (
        <div style={s.tableCard}>
          <div style={s.thead}>
            <span>#</span><span>Name</span><span>Email</span><span>Role</span>
          </div>
          {filtered.length === 0 ? (
            <div style={s.empty}>
              <p style={{ fontSize: 32, margin: "0 0 8px" }}>👥</p>
              <p style={{ color: "#9ca3af", fontSize: 14 }}>No users found for this role.</p>
            </div>
          ) : filtered.map((u, i) => (
            <div key={u.id} style={s.trow}>
              <span style={s.idx}>{i + 1}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={s.avatar}>{u.name?.[0]?.toUpperCase()}</div>
                <span style={s.bold}>{u.name}</span>
              </div>
              <span style={s.muted}>{u.email}</span>
              <RoleBadge role={u.role} />
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

const s = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 },
  sup: { fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, color: "#006948", margin: "0 0 4px" },
  title: { fontSize: 26, fontWeight: 800, color: "#1a2e1f", margin: "0 0 6px", fontFamily: "'Manrope',sans-serif" },
  sub: { fontSize: 14, color: "#6b7280", margin: 0 },
  btnPrimary: { background: "linear-gradient(135deg,#006948,#52c98a)", color: "#fff", padding: "12px 20px", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Manrope',sans-serif", textDecoration: "none", display: "inline-block" },
  btnCancel: { padding: "12px 20px", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff", color: "#6b7280", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  successBox: { background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", padding: "12px 16px", borderRadius: 10, marginBottom: 20, fontSize: 14, fontWeight: 600 },
  formCard: { background: "#fff", borderRadius: 14, padding: "28px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", marginBottom: 24 },
  formTitle: { fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 20px", fontFamily: "'Manrope',sans-serif" },
  form: {},
  formGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 },
  input: { padding: "11px 14px", border: "1.5px solid #e5e7eb", borderRadius: 9, fontSize: 14, fontFamily: "'Manrope',sans-serif", color: "#111827", outline: "none", background: "#fafafa" },
  err: { color: "#dc2626", fontSize: 13, fontWeight: 600, margin: "8px 0 0" },
  tabs: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  tab: { display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", border: "1.5px solid #e5e7eb", borderRadius: 8, background: "#fff", color: "#6b7280", fontSize: 12, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: 0.5 },
  tabActive: { background: "#1a2e1f", color: "#fff", borderColor: "#1a2e1f" },
  tabCount: { background: "rgba(255,255,255,0.2)", borderRadius: 999, padding: "1px 7px", fontSize: 11 },
  tableCard: { background: "#fff", borderRadius: 14, boxShadow: "0 1px 8px rgba(0,0,0,0.06)", overflow: "hidden" },
  thead: { display: "grid", gridTemplateColumns: "48px 2fr 2fr 1fr", padding: "12px 20px", background: "#f9fafb", fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5 },
  trow: { display: "grid", gridTemplateColumns: "48px 2fr 2fr 1fr", padding: "14px 20px", borderBottom: "1px solid #f3f4f6", alignItems: "center" },
  idx: { fontSize: 13, color: "#d1d5db", fontWeight: 600 },
  avatar: { width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#006948,#52c98a)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 },
  bold: { fontSize: 14, fontWeight: 600, color: "#111827" },
  muted: { fontSize: 13, color: "#6b7280" },
  empty: { textAlign: "center", padding: "48px" },
};

export default UserManagement;