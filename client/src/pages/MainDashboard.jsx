import React, { useState } from "react";
import DatabaseExplorer from "./DatabaseExplorer";

const organizations = [
  {
    name: "LMS",
    db: "PostgreSQL",
    tables: 5,
    lastSync: "2 hours ago",
    health: 96,
  },
  {
    name: "Finance",
    db: "Snowflake",
    tables: 5,
    lastSync: "5 hours ago",
    health: 91,
  },
  {
    name: "CRM",
    db: "SQL Server",
    tables: 5,
    lastSync: "1 day ago",
    health: 94,
  },
];

const MainDashboard = () => {
  const [activeOrg, setActiveOrg] = useState(null);

  if (activeOrg) {
    return (
      <DatabaseExplorer
        organization={activeOrg.name}
        defaultDB={activeOrg.db}
        onBack={() => setActiveOrg(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* ================= NAVBAR ================= */}
      <div className="h-14 border-b flex items-center justify-between px-4 sm:px-6 md:px-8">
        <div className="font-semibold text-lg sm:text-xl">DataDoc AI</div>

        <div className="hidden sm:flex items-center gap-6 text-sm">
          <div>Organizations</div>
          <div>Activity</div>
          <div>Settings</div>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 px-4 sm:px-6 md:px-12 py-8 overflow-auto">
        {/* PAGE HEADER */}
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-3">
            Organization Overview
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl">
            Monitor connected databases, schema health and AI-generated
            documentation status.
          </p>
        </div>

        {/* GLOBAL STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Organizations" value={organizations.length} />
          <StatCard title="Total Databases" value="3" />
          <StatCard title="Total Tables" value="15" />
          <StatCard title="Avg Health Score" value="94%" />
        </div>

        {/* ORGANIZATION CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <div
              key={org.name}
              onClick={() => setActiveOrg(org)}
              className="border p-6 sm:p-8 cursor-pointer rounded-lg transition 
                         hover:bg-black hover:text-white"
            >
              <h2 className="text-lg sm:text-xl font-semibold">{org.name}</h2>

              <div className="mt-4 text-sm space-y-2">
                <p>Database: {org.db}</p>
                <p>Tables: {org.tables}</p>
                <p>Last Sync: {org.lastSync}</p>
                <p>Health Score: {org.health}%</p>
              </div>

              <div className="mt-6 text-xs border-t pt-4">
                Click to explore schema →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="border p-6 rounded-md">
    <div className="text-sm text-gray-500 mb-2">{title}</div>
    <div className="text-xl sm:text-2xl font-semibold">{value}</div>
  </div>
);

export default MainDashboard;
