import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const procurementNav = [
  { icon: "📦", label: "Dashboard", to: "/procurement/dashboard" },
  { icon: "🛒", label: "Marketplace", to: "/procurement/marketplace" },
  { icon: "📋", label: "Order History", to: "/procurement/orders" },
];
const categories = ["All", "Grain", "Vegetables", "Fruits", "Pulses", "Dairy"];

const allOfferings = [
  { id: 1, name: "Wheat", category: "Grain", supplier: "Ayesh", qty: 100, price: 2200, rating: "A", available: true, harvest: "Now → Open", location: "Andhra Pradesh" },
  { id: 2, name: "Rice", category: "Grain", supplier: "Ravi Kumar", qty: 250, price: 3500, rating: "A", available: true, harvest: "Now → Open", location: "Telangana" },
  { id: 3, name: "Tomatoes", category: "Vegetables", supplier: "Sunita Devi", qty: 80, price: 1200, rating: "B", available: true, harvest: "Now → Jun", location: "Karnataka" },
  { id: 4, name: "Onions", category: "Vegetables", supplier: "Prakash Rao", qty: 500, price: 1800, rating: "A", available: true, harvest: "Now → Open", location: "Maharashtra" },
  { id: 5, name: "Maize", category: "Grain", supplier: "Venkat Reddy", qty: 300, price: 1900, rating: "A", available: true, harvest: "May → Jul", location: "Andhra Pradesh" },
  { id: 6, name: "Mangoes", category: "Fruits", supplier: "Lakshmi Farms", qty: 60, price: 4500, rating: "A", available: true, harvest: "Now → Jun", location: "Andhra Pradesh" },
  { id: 7, name: "Toor Dal", category: "Pulses", supplier: "Mohan Das", qty: 150, price: 8500, rating: "B", available: false, harvest: "Jun → Aug", location: "Madhya Pradesh" },
  { id: 8, name: "Milk", category: "Dairy", supplier: "Gopal Dairy", qty: 200, price: 55, rating: "A", available: true, harvest: "Daily", location: "Gujarat" },
  { id: 9, name: "Potatoes", category: "Vegetables", supplier: "Ram Singh", qty: 400, price: 1400, rating: "A", available: true, harvest: "Now → Open", location: "Uttar Pradesh" },
  { id: 10, name: "Jowar", category: "Grain", supplier: "Balu Patil", qty: 120, price: 2100, rating: "B", available: true, harvest: "Now → Jul", location: "Maharashtra" },
  { id: 11, name: "Bananas", category: "Fruits", supplier: "Krishna Orchards", qty: 90, price: 3200, rating: "A", available: true, harvest: "Now → Open", location: "Tamil Nadu" },
  { id: 12, name: "Chana Dal", category: "Pulses", supplier: "Suresh Farms", qty: 200, price: 7200, rating: "A", available: false, harvest: "Jul → Sep", location: "Rajasthan" },
];

const cropIcon = (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 44, height: 44 }}>
    <rect width="40" height="40" rx="8" fill="#e8f5e9" />
    <path d="M20 32V18" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 18C20 18 14 16 13 10C16 10 20 14 20 18Z" fill="#4caf50" />
    <path d="M20 22C20 22 26 20 27 14C24 14 20 18 20 22Z" fill="#66bb6a" />
    <path d="M20 26C20 26 15 25 14 20C17 20 20 24 20 26Z" fill="#4caf50" />
  </svg>
);

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [orderQty, setOrderQty] = useState(10);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const filtered = allOfferings.filter((o) => {
    const matchCat = activeCategory === "All" || o.category === activeCategory;
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.supplier.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
      setSelectedItem(null);
    }, 2000);
  };

  return (
  <DashboardLayout navItems={procurementNav}>
    <div style={{ minHeight: "100vh", background: "#f7f9f4", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #e8f0e0",
        padding: "12px 20px",
        position: "sticky",
        top: 0,
        zIndex: 10
      }}>
        <h2 style={{ margin: 0 }}>Marketplace</h2>

        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          style={{
            width: "100%",
            marginTop: 10,
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #ddd"
          }}
        />

        {/* Categories */}
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "5px 12px",
                borderRadius: 20,
                border: "1px solid",
                background: activeCategory === cat ? "#2e7d32" : "#fff",
                color: activeCategory === cat ? "#fff" : "#555",
                cursor: "pointer"
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{
        display: "flex",
        gap: 16,
        padding: "16px"
      }}>

        {/* Products */}
        <div style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 12
        }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              style={{
                background: "#fff",
                padding: 14,
                borderRadius: 10,
                border: "1px solid #e0e0e0",
                cursor: "pointer"
              }}
            >
              <div style={{ marginBottom: 8 }}>{cropIcon}</div>

              <b>{item.name}</b>
              <div style={{ fontSize: 12, color: "#777" }}>
                {item.supplier}
              </div>

              <div style={{ color: "#2e7d32", fontWeight: 600 }}>
                {item.qty}kg available
              </div>

              <div style={{ fontSize: 12 }}>
                ₹{item.price}
              </div>
            </div>
          ))}
        </div>

        {/* Order Panel */}
        <div style={{
          width: 260,
          background: "#fff",
          padding: 16,
          borderRadius: 10,
          border: "1px solid #e0e0e0",
          height: "fit-content",
          position: "sticky",
          top: 80
        }}>
          <h4>Place Order</h4>

          {!selectedItem ? (
            <p style={{ color: "#999" }}>Select product</p>
          ) : (
            <>
              <b>{selectedItem.name}</b>

              <div style={{ marginTop: 10 }}>
                <input
                  type="number"
                  value={orderQty}
                  onChange={(e) => setOrderQty(+e.target.value)}
                  style={{ width: "100%", padding: 6 }}
                />
              </div>

              <div style={{ marginTop: 10 }}>
                ₹{Math.round(orderQty * selectedItem.price / 100)}
              </div>

              <button
                onClick={handleOrder}
                style={{
                  marginTop: 10,
                  width: "100%",
                  padding: 10,
                  background: "#2e7d32",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6
                }}
              >
                {orderPlaced ? "Done" : "Order"}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  </DashboardLayout>
);
}