import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { ROLES } from "../utils/roles";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

<<<<<<< HEAD
import FarmerDashboard from "../pages/Farmer/FarmerDashboard";
import SubmitProduce from "../pages/Farmer/SubmitProduce";
import ProduceHistory from "../pages/Farmer/ProduceHistory";
=======
import FarmerDashboard from "../pages/farmer/FarmerDashboard";
import SubmitProduce from "../pages/farmer/Submitproduce";
import ProduceHistory from "../pages/farmer/ProduceHistory";
>>>>>>> 9fc93fc775d3f99bd4cee8a477dec371a48afc32

import InspectorDashboard from "../pages/inspector/InspectorDashboard";
import GradingForm from "../pages/inspector/GradingForm";

import ProcurementDashboard from "../pages/procurement/ProcurementDashboard";
import Marketplace from "../pages/procurement/MarketPlace";
import OrderHistory from "../pages/procurement/OrderHistory";

import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import InventoryReports from "../pages/admin/InventoryReports";

const Placeholder = ({ title }) => (
  <div style={{ padding: 40, fontFamily: "sans-serif" }}>
    <h2>🚧 {title} — Coming Soon</h2>
  </div>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/" element={<Navigate to="/login" replace />} />

    <Route path="/farmer/dashboard" element={<PrivateRoute allowedRoles={[ROLES.FARMER]}><FarmerDashboard /></PrivateRoute>} />
    <Route path="/farmer/submit" element={<PrivateRoute allowedRoles={[ROLES.FARMER]}><SubmitProduce /></PrivateRoute>} />
    <Route path="/farmer/history" element={<PrivateRoute allowedRoles={[ROLES.FARMER]}><ProduceHistory /></PrivateRoute>} />

    <Route path="/inspector/dashboard" element={<PrivateRoute allowedRoles={[ROLES.INSPECTOR]}><InspectorDashboard /></PrivateRoute>} />
    <Route path="/inspector/grade" element={<PrivateRoute allowedRoles={[ROLES.INSPECTOR]}><GradingForm /></PrivateRoute>} />

    <Route path="/procurement/dashboard" element={<PrivateRoute allowedRoles={[ROLES.PROCUREMENT]}><ProcurementDashboard /></PrivateRoute>} />
    <Route path="/procurement/marketplace" element={<PrivateRoute allowedRoles={[ROLES.PROCUREMENT]}><Marketplace /></PrivateRoute>} />
    <Route path="/procurement/orders" element={<PrivateRoute allowedRoles={[ROLES.PROCUREMENT]}><OrderHistory /></PrivateRoute>} />

    <Route path="/admin/dashboard" element={<PrivateRoute allowedRoles={[ROLES.ADMIN]}><AdminDashboard /></PrivateRoute>} />
    <Route path="/admin/users" element={<PrivateRoute allowedRoles={[ROLES.ADMIN]}><UserManagement /></PrivateRoute>} />
    <Route
  path="/admin/inventory"
  element={
    <PrivateRoute allowedRoles={["ADMIN"]}>
      <InventoryReports />
    </PrivateRoute>
  }
/>
    <Route path="/unauthorized" element={<Placeholder title="Unauthorized Access" />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoutes;