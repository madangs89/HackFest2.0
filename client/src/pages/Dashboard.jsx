import React, { useState } from "react";

const Dashboard = () => {
  const [selectedDB, setSelectedDB] = useState("PostgreSQL");
  const [activeMenu, setActiveMenu] = useState("Tables");
  const [selectedTable, setSelectedTable] = useState("users");

  const databases = ["PostgreSQL", "Snowflake", "SQL Server"];

  const tables = {
    users: [
      { name: "id", type: "UUID", key: "PK" },
      { name: "email", type: "VARCHAR(255)", key: "" },
      { name: "created_at", type: "TIMESTAMP", key: "" },
      { name: "updated_at", type: "TIMESTAMP", key: "" },
      { name: "status", type: "ENUM", key: "" },
    ],
    orders: [
      { name: "id", type: "UUID", key: "PK" },
      { name: "user_id", type: "UUID", key: "FK" },
      { name: "total_amount", type: "DECIMAL", key: "" },
      { name: "created_at", type: "TIMESTAMP", key: "" },
    ],
  };

  return (
    <div className="h-screen w-full bg-white text-black flex flex-col font-sans">

      {/* ================= TOP NAV ================= */}
      <div className="h-14 border-b border-gray-200 flex items-center justify-between px-8">
        <div className="text-lg font-semibold">
          DataDoc AI
        </div>

        <div className="flex items-center gap-4 text-sm">
          <select
            value={selectedDB}
            onChange={(e) => setSelectedDB(e.target.value)}
            className="border border-gray-300 px-3 py-1 rounded"
          >
            {databases.map((db) => (
              <option key={db}>{db}</option>
            ))}
          </select>

          <button className="border border-black px-4 py-1 rounded">
            Refresh
          </button>

          <button className="bg-black text-white px-4 py-1 rounded">
            Export
          </button>

          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="flex flex-1 overflow-hidden">

        {/* ================= LEFT PANEL ================= */}
        <div className="w-64 border-r border-gray-200 p-6 flex flex-col text-sm">

          <div className="uppercase text-gray-400 text-xs mb-6">
            Navigation
          </div>

          <div className="space-y-4">
            {["Overview", "Tables", "Data Quality", "Lineage", "AI Docs", "Alerts", "Settings"].map(
              (item) => (
                <div
                  key={item}
                  onClick={() => setActiveMenu(item)}
                  className={`cursor-pointer px-2 py-1 rounded ${
                    activeMenu === item
                      ? "bg-black text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>

        {/* ================= CENTER PANEL ================= */}
        <div className="flex-1 flex flex-col overflow-hidden">

          <div className="p-8 overflow-auto flex-1">

            <h1 className="text-2xl font-semibold mb-6">
              {selectedDB} Schema Explorer
            </h1>

            <div className="grid grid-cols-4 gap-8">

              {/* TABLE LIST */}
              <div className="col-span-1 border border-gray-200 rounded p-4">
                <h2 className="font-medium mb-4 text-sm">
                  Tables
                </h2>

                <div className="space-y-2">
                  {Object.keys(tables).map((table) => (
                    <div
                      key={table}
                      onClick={() => setSelectedTable(table)}
                      className={`px-3 py-2 rounded cursor-pointer text-sm ${
                        selectedTable === table
                          ? "bg-black text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {table}
                    </div>
                  ))}
                </div>
              </div>

              {/* TABLE STRUCTURE */}
              <div className="col-span-3 border border-gray-200 rounded p-6">

                <h2 className="text-lg font-medium mb-6">
                  {selectedTable} Structure
                </h2>

                <table className="w-full text-sm border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 border">
                        Column
                      </th>
                      <th className="text-left px-4 py-3 border">
                        Type
                      </th>
                      <th className="text-left px-4 py-3 border">
                        Key
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tables[selectedTable]?.map((col, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 border font-medium">
                          {col.name}
                        </td>
                        <td className="px-4 py-3 border text-gray-600">
                          {col.type}
                        </td>
                        <td className="px-4 py-3 border">
                          {col.key && (
                            <span className="text-xs border px-2 py-1 rounded">
                              {col.key}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* DATA QUALITY + AI SUMMARY */}
                <div className="grid grid-cols-2 gap-6 mt-8 text-sm">

                  <div className="border border-gray-200 rounded p-4">
                    <h3 className="font-medium mb-3">
                      Data Quality
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>Completeness: 98%</li>
                      <li>Null Ratio: 1.1%</li>
                      <li>Freshness: 2 hours</li>
                      <li>Duplicate Keys: 0</li>
                    </ul>
                  </div>

                  <div className="border border-gray-200 rounded p-4">
                    <h3 className="font-medium mb-3">
                      AI Business Summary
                    </h3>
                    <p className="text-gray-600">
                      This table stores structured entity-level data and
                      supports analytical queries and operational joins.
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ================= RIGHT AI PANEL ================= */}
        <div className="w-96 border-l border-gray-200 flex flex-col">

          <div className="p-4 border-b text-sm font-medium">
            AI Assistant
          </div>

          <div className="flex-1 p-4 overflow-auto text-sm text-gray-600 space-y-3">
            <div className="bg-gray-100 p-3 rounded w-fit">
              What does this table represent?
            </div>

            <div className="bg-black text-white p-3 rounded w-fit ml-auto">
              This table represents structured schema-level metadata
              extracted from the selected database.
            </div>
          </div>

          <div className="p-4 border-t flex gap-2">
            <input
              placeholder="Ask about schema..."
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <button className="bg-black text-white px-4 py-2 rounded">
              Send
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
