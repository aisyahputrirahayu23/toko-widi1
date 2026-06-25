import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import "./assets/tailwind.css";

import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ProtectedRoute, RoleRoute } from "./components/ProtectedRoute";
import Loading from "./components/Loading";
import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";

const Dashboard    = React.lazy(() => import("./pages/Dashboard"));
const Inventory    = React.lazy(() => import("./pages/Inventory"));
const Reports      = React.lazy(() => import("./pages/Reports"));
const Transactions = React.lazy(() => import("./pages/Transactions"));
const Users        = React.lazy(() => import("./pages/Users"));
const Suppliers    = React.lazy(() => import("./pages/Suppliers"));
const Settings     = React.lazy(() => import("./pages/Settings"));

const Login    = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Forgot   = React.lazy(() => import("./pages/auth/Forgot"));

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route
              path="/dashboard"
              element={<RoleRoute role="admin"><Dashboard /></RoleRoute>}
            />
            <Route
              path="/inventory"
              element={<ProtectedRoute><Inventory /></ProtectedRoute>}
            />
            <Route
              path="/reports"
              element={<RoleRoute role="admin"><Reports /></RoleRoute>}
            />
            <Route
              path="/users"
              element={<RoleRoute role="admin"><Users /></RoleRoute>}
            />
            <Route
              path="/transactions"
              element={<RoleRoute role="karyawan"><Transactions /></RoleRoute>}
            />
            <Route
              path="/suppliers"
              element={<RoleRoute role="karyawan"><Suppliers /></RoleRoute>}
            />
            <Route
              path="/settings"
              element={<ProtectedRoute><Settings /></ProtectedRoute>}
            />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<Forgot />} />
          </Route>
        </Routes>
      </Suspense>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
