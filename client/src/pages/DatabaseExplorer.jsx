import React, { useState, useMemo, useEffect } from "react";
import { ArrowLeft, MessageCircle, X } from "lucide-react";

/* ---------------- MOCK DATABASE ---------------- */

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
    nullValues,
    totalValues,
    duplicateKeys,
  };
}

/* ---------------- COMPONENT ---------------- */

const DatabaseExplorer = ({ organization, defaultDB, onBack }) => {
  const [selectedDB, setSelectedDB] = useState(defaultDB);
  const [selectedTable, setSelectedTable] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);

  const tables = mockDatabases[selectedDB] || {};
  const tableNames = Object.keys(tables);
  const tableData = selectedTable ? tables[selectedTable] : null;

  /* ---------- DEFAULT SELECT FIRST TABLE ---------- */
  useEffect(() => {
    if (tableNames.length > 0) {
      setSelectedTable(tableNames[0]);
    }
  }, [selectedDB]);

  /* ---------- QUALITY CALC ---------- */
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

  /* ---------- AI DOCS ---------- */
  const generateDocs = () => {
    if (!tableData) return "";
    return `
AI Documentation for ${selectedTable}

Business Context:
Core operational entity used inside ${organization}

Row Count:
${tableData.rowCount.toLocaleString()} records

Data Quality:
Completeness: ${quality?.completeness}%
Null Ratio: ${quality?.nullRatio}%
Duplicate Keys: ${quality?.duplicateKeys}

Recommendations:
- Join with transactional tables
- Monitor status distribution
- Use created_at for growth analysis
`;
  };

  /* ---------- CHAT ---------- */
  const handleChat = (input) => {
    if (!tableData) return;

    let response = "Ask about rows, duplicates, or null ratio.";

    if (input.toLowerCase().includes("row"))
      response = `${tableData.rowCount.toLocaleString()} rows available.`;

    if (input.toLowerCase().includes("duplicate"))
      response = `Duplicate keys: ${quality?.duplicateKeys}`;

    if (input.toLowerCase().includes("null"))
      response = `Null ratio: ${quality?.nullRatio}%`;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: input },
      { role: "ai", text: response },
    ]);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* TOP BAR */}
      <div className="h-14 border-b flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <button onClick={onBack}>
            <ArrowLeft size={18} />
          </button>
          <div className="font-semibold text-sm md:text-base">
            {organization} — {selectedDB}
          </div>
        </div>

        <div className="flex gap-3">
          <select
            value={selectedDB}
            onChange={(e) => setSelectedDB(e.target.value)}
            className="border px-3 py-1 text-sm"
          >
            {Object.keys(mockDatabases).map((db) => (
              <option key={db}>{db}</option>
            ))}
          </select>

          <button
            onClick={() => setShowExportPanel(true)}
            className="bg-black text-white px-4 py-1 text-sm"
          >
            Export
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

        {/* TABLE LIST */}
        <div className="md:w-64 border-r p-4 overflow-x-auto">
          <div className="flex md:block gap-2">
            {tableNames.map((table) => (
              <div
                key={table}
                onClick={() => setSelectedTable(table)}
                className={`cursor-pointer px-3 py-2 whitespace-nowrap ${
                  selectedTable === table
                    ? "bg-black text-white"
                    : ""
                }`}
              >
                {table}
              </div>
            ))}
          </div>
        </div>

        {/* CENTER */}
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          {tableData && (
            <>
              <h2 className="text-lg md:text-xl font-semibold mb-4">
                {selectedTable} Structure
              </h2>

              <div className="overflow-x-auto">
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
              </div>

              <div className="mt-6 border p-4 whitespace-pre-line text-sm">
                {generateDocs()}
              </div>
            </>
          )}
        </div>

        {/* DESKTOP AI SIDEBAR */}
        <div className="hidden md:flex md:w-96 border-l flex-col">
          <ChatPanel
            messages={messages}
            handleChat={handleChat}
          />
        </div>
      </div>

      {/* MOBILE AI BUTTON */}
      <button
        onClick={() => setShowChatPanel(true)}
        className="md:hidden fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg"
      >
        <MessageCircle size={22} />
      </button>

      {/* SLIDE CHAT PANEL */}
      <SlidePanel
        show={showChatPanel}
        onClose={() => setShowChatPanel(false)}
      >
        <ChatPanel
          messages={messages}
          handleChat={handleChat}
        />
      </SlidePanel>

      {/* SLIDE EXPORT PANEL */}
      <SlidePanel
        show={showExportPanel}
        onClose={() => setShowExportPanel(false)}
      >
        <div className="p-6 space-y-4">
          <div className="text-lg font-semibold">
            Export Options
          </div>
          <button className="w-full border px-4 py-2">
            Export as JSON
          </button>
          <button className="w-full border px-4 py-2">
            Export as CSV
          </button>
        </div>
      </SlidePanel>
    </div>
  );
};

/* ---------------- CHAT PANEL ---------------- */

const ChatPanel = ({ messages, handleChat }) => (
  <div className="flex flex-col h-full">
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
          document.getElementById("chatInput").value = "";
        }}
        className="bg-black text-white px-4"
      >
        Send
      </button>
    </div>
  </div>
);

/* ---------------- SLIDE PANEL ---------------- */

const SlidePanel = ({ show, onClose, children }) => (
  <div
    className={`fixed inset-0 z-50 transition ${
      show ? "pointer-events-auto" : "pointer-events-none"
    }`}
  >
    <div
      onClick={onClose}
      className={`absolute inset-0 bg-black/40 transition-opacity ${
        show ? "opacity-100" : "opacity-0"
      }`}
    />

    <div
      className={`absolute right-0 top-0 h-full bg-white w-full md:w-[400px]
      transform transition-transform duration-300
      ${show ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="flex justify-end p-4 border-b">
        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

export default DatabaseExplorer;
