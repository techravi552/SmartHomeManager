// frontend/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Routines from "./pages/Routines";
import EnergyReport from "./pages/EnergyReport";
import PrivateRoute from "./components/PrivateRoute";
import AddDeviceForm from "./components/AddDeviceForm";
import Emargensy from "./pages/Emargensy";
import DeviceStatus from "./pages/DeviceStatus";
import DeviceGroups from "./components/DeviceGroups";

function App() {
  return (
   
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/routines"
          element={
            <PrivateRoute>
              <Routines />
            </PrivateRoute>
          }
        />
        <Route
          path="/energy"
          element={
            <PrivateRoute>
              <EnergyReport />
            </PrivateRoute>
          }
        />
         <Route
          path="/Emargensy"
          element={
            <PrivateRoute>
              <Emargensy />
            </PrivateRoute>
          }
        />
         <Route
          path="/DeviceStatus"
          element={
            <PrivateRoute>
              <DeviceStatus />
            </PrivateRoute>
          }
        />
          <Route
          path="/DeviceGroups"
          element={
            <PrivateRoute>
              <DeviceGroups />
            </PrivateRoute>
          }
        />
        
        
        <Route
          path="/AddDeviceForm"
          element={
            <PrivateRoute>
              <AddDeviceForm />
            </PrivateRoute>
          }
        />

        {/* default: go to dashboard if logged in, else login */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
