import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Leads = lazy(() => import("./pages/Leads"));
const Capture = lazy(() => import("./pages/Capture"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Settings = lazy(() => import("./pages/Settings"));
const LeadDetails = lazy(() => import("./pages/LeadDetails"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-300">Loading workspace…</div>}>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="leads" element={<Leads />} />
                <Route path="capture" element={<Capture />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
                <Route path="leads/:leadId" element={<LeadDetails />} />
              </Route>
            </Route>

            <Route
              path="*"
              element={
                <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.15),transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] px-6 text-center text-slate-100">
                  <div className="max-w-md rounded-[32px] border border-white/10 bg-white/10 p-10 backdrop-blur-xl">
                    <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">404</p>
                    <h1 className="mt-3 text-4xl font-semibold">We hit a dead end.</h1>
                    <p className="mt-3 text-sm leading-7 text-slate-300">The page you requested is not in the CRM workspace yet.</p>
                  </div>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;