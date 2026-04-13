import Sidebar from "./Sidebar";

const DashboardLayout = ({ children, navItems }) => {
  return (
    <div style={styles.wrapper}>
      <Sidebar navItems={navItems} />
      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#f4f3ee",
    fontFamily: "'system-ui', sans-serif",
  },
  main: {
    marginLeft: "240px",
    flex: 1,
    padding: "36px 40px",
    minHeight: "100vh",
  },
};

export default DashboardLayout;