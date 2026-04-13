import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ navItems = [] }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const roleColors = {
    FARMER:      { accent: "#22c55e", light: "#f0fdf4", dark: "#166534" },
    INSPECTOR:   { accent: "#3b82f6", light: "#eff6ff", dark: "#1e3a8a" },
    PROCUREMENT: { accent: "#a855f7", light: "#faf5ff", dark: "#581c87" },
    ADMIN:       { accent: "#f43f5e", light: "#fff1f2", dark: "#881337" },
  };

  const colors = roleColors[user?.role] || roleColors.FARMER;

  return (
    <aside style={{ ...styles.sidebar, borderRight: `3px solid ${colors.accent}20` }}>
      {/* Brand */}
      <div style={styles.brand}>
        <div style={{ ...styles.brandIcon, background: `linear-gradient(135deg, ${colors.dark}, ${colors.accent})` }}>
          🌿
        </div>
        <div>
          <p style={styles.brandName}>Pastoral</p>
          <p style={styles.brandSub}>Precision</p>
        </div>
      </div>

      {/* User info */}
      <div style={{ ...styles.userCard, background: colors.light, borderColor: colors.accent + "30" }}>
        <div style={{ ...styles.avatar, background: `linear-gradient(135deg, ${colors.dark}, ${colors.accent})` }}>
          {user?.name?.[0]?.toUpperCase() || "?"}
        </div>
        <div style={{ overflow: "hidden" }}>
          <p style={styles.userName}>{user?.name || "User"}</p>
          <span style={{ ...styles.roleBadge, background: colors.accent + "20", color: colors.dark }}>
            {user?.role}
          </span>
        </div>
      </div>

      {/* Nav items */}
      <nav style={styles.nav}>
        <p style={styles.navLabel}>Navigation</p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              style={{
                ...styles.navItem,
                ...(isActive ? {
                  background: colors.light,
                  color: colors.dark,
                  borderLeft: `3px solid ${colors.accent}`,
                  fontWeight: 700,
                } : {}),
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button onClick={logout} style={styles.logoutBtn}>
        <span>🚪</span>
        <span>Sign Out</span>
      </button>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: "240px",
    minHeight: "100vh",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    padding: "24px 0",
    position: "fixed",
    top: 0,
    left: 0,
    boxShadow: "2px 0 12px rgba(0,0,0,0.06)",
    zIndex: 100,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "0 20px 24px",
    borderBottom: "1px solid #f3f4f6",
    marginBottom: "16px",
  },
  brandIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    flexShrink: 0,
  },
  brandName: {
    fontSize: "15px",
    fontWeight: 800,
    color: "#111827",
    margin: 0,
    lineHeight: 1.2,
    fontFamily: "'Manrope', sans-serif",
  },
  brandSub: {
    fontSize: "11px",
    color: "#9ca3af",
    margin: 0,
    fontWeight: 500,
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "0 12px 20px",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid",
  },
  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: "14px",
    flexShrink: 0,
  },
  userName: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#111827",
    margin: "0 0 4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "130px",
  },
  roleBadge: {
    fontSize: "10px",
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: "999px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  nav: {
    flex: 1,
    padding: "0 12px",
  },
  navLabel: {
    fontSize: "10px",
    fontWeight: 800,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    margin: "0 8px 8px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: "2px",
    borderLeft: "3px solid transparent",
    transition: "all 0.15s",
  },
  navIcon: {
    fontSize: "16px",
    width: "20px",
    textAlign: "center",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "0 12px",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1.5px solid #fee2e2",
    background: "#fff",
    color: "#dc2626",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    width: "calc(100% - 24px)",
    fontFamily: "system-ui, sans-serif",
  },
};

export default Sidebar;