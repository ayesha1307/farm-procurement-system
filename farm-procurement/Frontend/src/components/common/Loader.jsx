const Loader = ({ text = "Loading..." }) => (
  <div style={styles.wrap}>
    <div style={styles.spinner} />
    <p style={styles.text}>{text}</p>
  </div>
);

const styles = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px",
    gap: "16px",
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #d1fae5",
    borderTop: "3px solid #2d5a3d",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  text: {
    color: "#6b7280",
    fontSize: "14px",
    margin: 0,
  },
};

// inject keyframes once
if (typeof document !== "undefined" && !document.getElementById("loader-style")) {
  const s = document.createElement("style");
  s.id = "loader-style";
  s.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
  document.head.appendChild(s);
}

export default Loader;