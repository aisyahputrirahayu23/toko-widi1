import React, { useState } from "react";
import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import "./assets/tailwind.css";

const Loading = React.lazy(() => import("./components/Loading"));

import MainLayout from "./layout/MainLayout";
import AuthLayout from "./layout/AuthLayout";

// import Dashboard from "./pages/Dashboard";
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
// import Inventory from "./pages/Inventory";
const Inventory = React.lazy(() => import("./pages/Inventory"));
// import Reports from "./pages/Reports";
const Reports = React.lazy(() => import("./pages/Reports"));
// import Orders from "./pages/Orders";
const Orders = React.lazy(() => import("./pages/Orders"));
// import Settings from "./pages/Settings";
const Settings = React.lazy(() => import("./pages/Settings"));

// import Login from "./pages/auth/Login";
const Login = React.lazy(() => import("./pages/auth/Login"));
// import Register from "./pages/auth/Register";
const Register = React.lazy(() => import("./pages/auth/Register"));
// import Forgot from "./pages/auth/Forgot";
const Forgot = React.lazy(() => import("./pages/auth/Forgot"));

function App() {
  // const [count, setCount] = useState(0);

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
