import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const procurementNav = [
  { icon: "📦", label: "Dashboard", to: "/procurement/dashboard" },
  { icon: "🛒", label: "Marketplace", to: "/procurement/marketplace" },
  { icon: "📋", label: "Order History", to: "/procurement/orders" },
];

const allOrders = [
  { id: "ORD-001", produce: "Wheat", supplier: "Ayesh", qty: 100, rate: 2200, total: 2200, status: "Approved", date: "2026-04-10", location: "Andhra Pradesh", category: "Grain", rating: "A" },
  { id: "ORD-002", produce: "Rice", supplier: "Ravi Kumar", qty: 50, rate: 3500, total: 1750, status: "Pending", date: "2026-04-09", location: "Telangana", category: "Grain", rating: "A" },
  { id: "ORD-003", produce: "Tomatoes", supplier: "Sunita Devi", qty: 30, rate: 1200, total: 360, status: "Pending", date: "2026-04-08", location: "Karnataka", category: "Vegetables", rating: "B" },
  { id: "ORD-004", produce: "Onions", supplier: "Prakash Rao", qty: 200, rate: 1800, total: 3600, status: "Approved", date: "2026-04-07", location: "Maharashtra", category: "Vegetables", rating: "A" },
  { id: "ORD-005", produce: "Maize", supplier: "Venkat Reddy", qty: 100, rate: 1900, total: 1900, status: "Pending", date: "2026-04-06", location: "Andhra Pradesh", category: "Grain", rating: "A" },
  { id: "ORD-006", produce: "Mangoes", supplier: "Lakshmi Farms", qty: 20, rate: 4500, total: 900, status: "Pending", date: "2026-04-05", location: "Andhra Pradesh", category: "Fruits", rating: "A" },
  { id: "ORD-007", produce: "Milk", supplier: "Gopal Dairy", qty: 100, rate: 55, total: 55, status: "Approved", date: "2026-04-04", location: "Gujarat", category: "Dairy", rating: "A" },
  { id: "ORD-008", produce: "Potatoes", supplier: "Ram Singh", qty: 150, rate: 1400, total: 2100, status: "Pending", date: "2026-04-03", location: "Uttar Pradesh", category: "Vegetables", rating: "A" },
  { id: "ORD-009", produce: "Bananas", supplier: "Krishna Orchards", qty: 40, rate: 3200, total: 1280, status: "Pending", date: "2026-04-02", location: "Tamil Nadu", category: "Fruits", rating: "A" },
];

const statusColor = { Approved: "#2e7d32", Pending: "#f57c00", Rejected: "#c62828" };
const statusBg = { Approved: "#e8f5e9", Pending: "#fff3e0", Rejected: "#ffebee" };
const ratingColor = { A: "#2e7d32", B: "#f57c00", C: "#c62828" };

const statuses = ["All", "Approved", "Pending"];

export default function Orders() {
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [sortBy, setSortBy] = useState("date");

  const filtered = allOrders
    .filter(o => {
      const matchStatus = filterStatus === "All" || o.status === filterStatus;
      const matchSearch = o.produce.toLowerCase().includes(search.toLowerCase()) ||
        o.supplier.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.date) - new Date(a.date);
      if (sortBy === "total") return b.total - a.total;
      if (sortBy === "qty") return b.qty - a.qty;
      return 0;
    });

  const totalOrders = allOrders.length;
  const approved = allOrders.filter(o => o.status === "Approved").length;
  const pending = allOrders.filter(o => o.status === "Pending").length;
  const totalValue = allOrders.reduce((s, o) => s + o.total, 0);

  return (
  <DashboardLayout navItems={procurementNav}>
    <div>
    <div style={{ minHeight: "100vh", background: "#f7f9f4", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8f0e0", padding: "28px 40px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, color: "#888", textTransform: "uppercase", marginBottom: 6 }}>
            Supplier Portal
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>Orders</h1>
          <p style={{ color: "#888", marginTop: 6, fontSize: 14 }}>
            Track and manage all your procurement orders.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#e8f5e9", color: "#2e7d32", borderRadius: 20, padding: "4px 14px", fontSize: 12, marginTop: 8 }}>
            <span style={{ width: 7, height: 7, background: "#2e7d32", borderRadius: "50%", display: "inline-block" }} />
            LIVE MARKET DATA
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, maxWidth: 900, margin: "0 auto" }}>
          {[
            { label: "TOTAL ORDERS", value: totalOrders, sub: "all time", color: "#1565c0", border: "#90caf9" },
            { label: "APPROVED", value: approved, sub: "fulfilled", color: "#2e7d32", border: "#a5d6a7" },
            { label: "PENDING", value: pending, sub: "in progress", color: "#f57c00", border: "#ffcc80" },
            { label: "TOTAL VALUE ₹", value: totalValue.toLocaleString(), sub: "procured", color: "#6a1b9a", border: "#ce93d8" },
          ].map((stat, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 12, border: `1.5px solid ${stat.border}`, padding: "18px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 10, letterSpacing: 1.5, color: "#aaa", textTransform: "uppercase", marginBottom: 8 }}>{stat.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: "#bbb", marginTop: 4 }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ padding: "20px 40px 0", maxWidth: 1200, margin: "0 auto", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search orders..."
          style={{ padding: "9px 16px", borderRadius: 8, border: "1.5px solid #dde8d4", fontSize: 13, outline: "none", width: 220, background: "#fff" }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              style={{
                padding: "7px 16px", borderRadius: 20, border: "1.5px solid",
                borderColor: filterStatus === s ? "#2e7d32" : "#dde8d4",
                background: filterStatus === s ? "#2e7d32" : "#fff",
                color: filterStatus === s ? "#fff" : "#555",
                fontSize: 12, cursor: "pointer", fontWeight: filterStatus === s ? 600 : 400
              }}>
              {s}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#888" }}>Sort by:</span>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ padding: "7px 12px", borderRadius: 8, border: "1.5px solid #dde8d4", fontSize: 12, outline: "none", background: "#fff" }}>
            <option value="date">Date</option>
            <option value="total">Value</option>
            <option value="qty">Quantity</option>
          </select>
        </div>
      </div>

      {/* Main */}
      <div style={{ display: "flex", gap: 24, padding: "20px 40px 40px", maxWidth: 1200, margin: "0 auto" }}>
        {/* Table */}
        <div style={{ flex: 1 }}>
          <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e8f0e0", overflow: "hidden" }}>
            {/* Table Header */}
            <div style={{
              display: "grid", gridTemplateColumns: "110px 1fr 1fr 80px 90px 90px 100px",
              padding: "12px 20px", background: "#f7f9f4",
              borderBottom: "1.5px solid #e8f0e0", fontSize: 11, color: "#aaa",
              textTransform: "uppercase", letterSpacing: 1, fontWeight: 600
            }}>
              <div>Order ID</div>
              <div>Produce</div>
              <div>Supplier</div>
              <div>Qty</div>
              <div>Rate</div>
              <div>Value</div>
              <div>Status</div>
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "50px", color: "#bbb" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
                <div>No orders found.</div>
              </div>
            ) : filtered.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order === selectedOrder ? null : order)}
                style={{
                  display: "grid", gridTemplateColumns: "110px 1fr 1fr 80px 90px 90px 100px",
                  padding: "14px 20px", borderBottom: "1px solid #f0f4ea",
                  cursor: "pointer", transition: "background 0.1s",
                  background: selectedOrder?.id === order.id ? "#f0f9f0" : "#fff",
                  alignItems: "center"
                }}
                onMouseEnter={e => { if (selectedOrder?.id !== order.id) e.currentTarget.style.background = "#fafcf7" }}
                onMouseLeave={e => { if (selectedOrder?.id !== order.id) e.currentTarget.style.background = "#fff" }}
              >
                <div style={{ fontSize: 12, color: "#2e7d32", fontWeight: 600, fontFamily: "monospace" }}>{order.id}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{order.produce}</div>
                  <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{order.category} · {order.date}</div>
                </div>
                <div>
                  <div style={{ fontSize: 13, color: "#444" }}>{order.supplier}</div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>{order.location}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{order.qty}kg</div>
                <div style={{ fontSize: 12, color: "#666" }}>₹{order.rate}/qtl</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>₹{order.total.toLocaleString()}</div>
                <div>
                  <span style={{
                    background: statusBg[order.status], color: statusColor[order.status],
                    borderRadius: 6, fontSize: 11, fontWeight: 700, padding: "4px 10px"
                  }}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "#aaa", marginTop: 10, textAlign: "right" }}>
            {filtered.length} order{filtered.length !== 1 ? "s" : ""} shown
          </div>
        </div>

        {/* Detail Panel */}
        <div style={{ width: 280, flexShrink: 0 }}>
          <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e8f0e0", padding: 24, position: "sticky", top: 28 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", marginBottom: 16 }}>Order Details</div>

            {!selectedOrder ? (
              <div style={{ textAlign: "center", padding: "30px 0", color: "#bbb" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🧾</div>
                <div style={{ fontSize: 13 }}>Click any order to view details.</div>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "#aaa", fontFamily: "monospace" }}>{selectedOrder.id}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{selectedOrder.produce}</div>
                  </div>
                  <span style={{
                    background: statusBg[selectedOrder.status], color: statusColor[selectedOrder.status],
                    borderRadius: 6, fontSize: 11, fontWeight: 700, padding: "4px 10px"
                  }}>
                    {selectedOrder.status}
                  </span>
                </div>

                {[
                  ["Supplier", selectedOrder.supplier],
                  ["Location", selectedOrder.location],
                  ["Category", selectedOrder.category],
                  ["Quality Rating", <span style={{ color: ratingColor[selectedOrder.rating], fontWeight: 700 }}>{selectedOrder.rating} Grade</span>],
                  ["Quantity", `${selectedOrder.qty} kg`],
                  ["Rate", `₹${selectedOrder.rate}/quintal`],
                  ["Order Date", selectedOrder.date],
                  ["Total Value", <span style={{ color: "#2e7d32", fontWeight: 700, fontSize: 15 }}>₹{selectedOrder.total.toLocaleString()}</span>],
                ].map(([label, val], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f4ea", fontSize: 13 }}>
                    <span style={{ color: "#888" }}>{label}</span>
                    <span style={{ fontWeight: 500, color: "#1a1a1a", textAlign: "right" }}>{val}</span>
                  </div>
                ))}

                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                  {selectedOrder.status === "Pending" && (
                    <button style={{
                      padding: "10px", borderRadius: 10, border: "none",
                      background: "#2e7d32", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer"
                    }}>
                      Approve Order
                    </button>
                  )}
                  <button style={{
                    padding: "10px", borderRadius: 10, border: "1.5px solid #dde8d4",
                    background: "#fff", color: "#555", fontSize: 13, cursor: "pointer"
                  }}>
                    View Quality Report
                  </button>
                  {selectedOrder.status === "Pending" && (
                    <button style={{
                      padding: "10px", borderRadius: 10, border: "1.5px solid #ffcdd2",
                      background: "#fff", color: "#c62828", fontSize: 13, cursor: "pointer"
                    }}>
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
        </div>
  </DashboardLayout>
  );
}