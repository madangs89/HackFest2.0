import React, { useState, useMemo } from "react";

const mockDatabases = {
  PostgreSQL: {
    users: fakeTable(12500, 120, 62500, 0),
    courses: fakeTable(4200, 50, 21000, 0),
    enrollments: fakeTable(8900, 300, 35600, 2),
    assignments: fakeTable(7600, 90, 30400, 0),
    grades: fakeTable(11200, 500, 44800, 1),
  },
  Snowflake: {
    transactions: fakeTable(88000, 1000, 352000, 3),
    invoices: fakeTable(45000, 600, 180000, 1),
    accounts: fakeTable(22000, 100, 88000, 0),
    budgets: fakeTable(7000, 20, 28000, 0),
    expenses: fakeTable(39000, 350, 156000, 2),
  },
  "SQL Server": {
    leads: fakeTable(19000, 200, 76000, 0),
    contacts: fakeTable(30000, 450, 120000, 1),
    opportunities: fakeTable(14000, 120, 56000, 0),
    campaigns: fakeTable(9000, 80, 36000, 0),
    activities: fakeTable(25000, 300, 100000, 2),
  },
};

function fakeTable(rowCount, nullValues, totalValues, duplicateKeys) {
  return {
    columns: [
      { name: "id", type: "UUID", key: "PK", nullable: false },
      { name: "name", type: "VARCHAR(255)", key: "", nullable: false },
      { name: "created_at", type: "TIMESTAMP", key: "", nullable: false },
      { name: "updated_at", type: "TIMESTAMP", key: "", nullable: true },
      { name: "status", type: "VARCHAR(50)", key: "", nullable: false },
    ],
    rowCount,
    lastUpdated: "2026-02-18",
    nullValues,
    totalValues,
    duplicateKeys,
  };
}

const DatabaseExplorer = ({ organization, defaultDB, onBack }) => {
  const [selectedDB, setSelectedDB] = useState(defaultDB);
  const [selectedTable, setSelectedTable] = useState(null);
  const [messages, setMessages] = useState([]);

  const tables = mockDatabases[selectedDB] || {};
  const tableNames = Object.keys(tables);
  const tableData = selectedTable ? tables[selectedTable] : null;

  const quality = useMemo(() => {
    if (!tableData) return null;

    const completeness =
      ((tableData.totalValues - tableData.nullValues) /
        tableData.totalValues) *
      100;

    return {
      completeness: completeness.toFixed(2),
      nullRatio: (
        (tableData.nullValues / tableData.totalValues) *
        100
      ).toFixed(2),
      duplicateKeys: tableData.duplicateKeys,
    };
  }, [tableData]);

  const generateSummary = () => {
    if (!tableData) return "";
    return `
The ${selectedTable} table contains ${tableData.rowCount.toLocaleString()} records.
It supports operational and analytical reporting within ${organization}.
Primary key integrity is ${
      tableData.duplicateKeys === 0 ? "healthy" : "needs review"
    }.
Recommended joins: related transactional and reference tables.
`;
  };

  const generateDocs = () => {
    if (!tableData) return "";
    return `
AI Documentation for ${selectedTable}:

• Business Context:
  Core entity table used in ${organization} workflows.

• Usage Recommendations:
  - Join with related tables for KPI dashboards
  - Use created_at for growth analysis
  - Monitor status distribution trends

• Data Quality Notes:
  Completeness: ${quality?.completeness}%
  Null Ratio: ${quality?.nullRatio}%
  Duplicate Keys: ${quality?.duplicateKeys}
`;
  };

  const handleChat = (input) => {
    if (!tableData) return;

    let response = "Please select a table first.";

    if (input.toLowerCase().includes("row"))
      response = `${tableData.rowCount.toLocaleString()} rows available.`;

    if (input.toLowerCase().includes("duplicate"))
      response = `Duplicate keys: ${tableData.duplicateKeys}`;

    if (input.toLowerCase().includes("null"))
      response = `Null ratio: ${quality?.nullRatio}%`;

    setMessages([
      ...messages,
      { role: "user", text: input },
      { role: "ai", text: response },
    ]);
  };

  const exportJSON = () => {
    if (!tableData) return;
    const data = {
      organization,
      database: selectedDB,
      table: selectedTable,
      structure: tableData.columns,
      quality,
      summary: generateSummary(),
      docs: generateDocs(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedTable}.json`;
    link.click();
  };

  return (
    <div className="h-screen bg-white text-black flex flex-col">

      {/* TOP BAR */}
      <div className="h-14 border-b flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="border px-3 py-1">
            Back
          </button>
          <div className="font-semibold">
            {organization} — {selectedDB}
          </div>
        </div>

        <div className="flex gap-3">
          <select
            value={selectedDB}
            onChange={(e) => {
              setSelectedDB(e.target.value);
              setSelectedTable(null);
            }}
            className="border px-3 py-1"
          >
            {Object.keys(mockDatabases).map((db) => (
              <option key={db}>{db}</option>
            ))}
          </select>

          <button onClick={exportJSON} className="bg-black text-white px-4 py-1">
            Export JSON
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* TABLE LIST */}
        <div className="w-64 border-r p-6">
          {tableNames.map((table) => (
            <div
              key={table}
              onClick={() => setSelectedTable(table)}
              className={`cursor-pointer px-3 py-2 ${
                selectedTable === table
                  ? "bg-black text-white"
                  : ""
              }`}
            >
              {table}
            </div>
          ))}
        </div>

        {/* CENTER CONTENT */}
        <div className="flex-1 p-8 overflow-auto">
          {!selectedTable && (
            <div>Select a table to view analysis.</div>
          )}

          {tableData && (
            <>
              <h2 className="text-xl font-semibold mb-4">
                {selectedTable} Structure
              </h2>

              <table className="w-full border text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-3 py-2">Column</th>
                    <th className="border px-3 py-2">Type</th>
                    <th className="border px-3 py-2">Key</th>
                    <th className="border px-3 py-2">Nullable</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.columns.map((col, i) => (
                    <tr key={i}>
                      <td className="border px-3 py-2">{col.name}</td>
                      <td className="border px-3 py-2">{col.type}</td>
                      <td className="border px-3 py-2">{col.key}</td>
                      <td className="border px-3 py-2">
                        {col.nullable ? "Yes" : "No"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 border p-4 whitespace-pre-line text-sm">
                {generateDocs()}
              </div>
            </>
          )}
        </div>

        {/* CHAT */}
        <div className="w-96 border-l flex flex-col">
          <div className="p-4 border-b font-semibold">
            AI Assistant
          </div>

          <div className="flex-1 p-4 overflow-auto space-y-2 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 ${
                  m.role === "user"
                    ? "bg-gray-200 ml-auto w-fit"
                    : "bg-black text-white w-fit"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="p-4 border-t flex gap-2">
            <input
              id="chatInput"
              className="flex-1 border px-3 py-2 text-sm"
              placeholder="Ask about table..."
            />
            <button
              onClick={() => {
                const input =
                  document.getElementById("chatInput").value;
                handleChat(input);
                document.getElementById("chatInput").value =
                  "";
              }}
              className="bg-black text-white px-4"
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DatabaseExplorer;
