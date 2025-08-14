"use client";

import { useSelector } from "react-redux";
import ProtectedRoute from "@/providers/ProtectedRoute";
import { RootState } from "@/store/store";

const DashboardPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const renderDashboard = () => {
    switch (user?.role) {
      case "HOSPITAL_ADMIN":
        return (
          <div>
            <h1 className="text-2xl font-bold">Hospital Admin Dashboard</h1>
            {/* Hospital admin specific content */}
          </div>
        );
      case "DOCTOR":
        return (
          <div>
            <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
            {/* Doctor specific content */}
          </div>
        );
      case "PATIENT":
        return (
          <div>
            <h1 className="text-2xl font-bold">Patient Dashboard</h1>
            {/* Patient specific content */}
          </div>
        );
      default:
        return <p>Loading...</p>;
    }
  };

  return (
    <ProtectedRoute>
      <main className="container mx-auto py-8">{renderDashboard()}</main>
    </ProtectedRoute>
  );
};

export default DashboardPage;
