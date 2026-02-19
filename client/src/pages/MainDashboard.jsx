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
    <div className="h-screen bg-white text-black flex flex-col">
      {/* ================= NAVBAR ================= */}
      <div className="h-14 border-b flex items-center justify-between px-8">
        <div className="font-semibold text-lg">DataDoc AI</div>

        <div className="flex items-center gap-6 text-sm">
          <div>Organizations</div>
          <div>Activity</div>
          <div>Settings</div>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 p-12 overflow-auto">
        {/* PAGE HEADER */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold mb-3">Organization Overview</h1>
          <p className="text-gray-600 text-sm">
            Monitor connected databases, schema health and AI-generated
            documentation status.
          </p>
        </div>

        {/* GLOBAL STATS */}
        <div className="grid grid-cols-4 gap-8 mb-14">
          <StatCard title="Total Organizations" value={organizations.length} />
          <StatCard title="Total Databases" value="3" />
          <StatCard title="Total Tables" value="15" />
          <StatCard title="Avg Health Score" value="94%" />
        </div>

        {/* ORGANIZATION CARDS */}
        <div className="grid grid-cols-3 gap-10">
          {organizations.map((org) => (
            <div
              key={org.name}
              onClick={() => setActiveOrg(org)}
              className="border p-8 cursor-pointer hover:bg-black rounded-lg hover:text-white transition"
            >
              <h2 className="text-xl font-semibold">{org.name}</h2>

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
  <div className="border p-6">
    <div className="text-sm text-gray-500 mb-2">{title}</div>
    <div className="text-2xl font-semibold">{value}</div>
  </div>
);

export default MainDashboard;
