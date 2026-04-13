const colors = {
  APPROVED: { bg: "#dcfce7", color: "#16a34a", dot: "#22c55e" },
  REJECTED: { bg: "#fee2e2", color: "#dc2626", dot: "#ef4444" },
  SUBMITTED: { bg: "#fef9c3", color: "#ca8a04", dot: "#eab308" },
  PENDING:   { bg: "#ffedd5", color: "#ea580c", dot: "#f97316" },
};

const StatusBadge = ({ status }) => {
  const c = colors[status] || { bg: "#f3f4f6", color: "#6b7280", dot: "#9ca3af" };
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      background: c.bg,
      color: c.color,
      padding: "4px 10px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "600",
      letterSpacing: "0.3px",
    }}>
      <span style={{
        width: "6px", height: "6px",
        borderRadius: "50%",
        background: c.dot,
        display: "inline-block",
      }} />
      {status}
    </span>
  );
};

export default StatusBadge;