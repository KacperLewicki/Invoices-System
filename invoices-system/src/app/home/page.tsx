"use client";

import React, { useMemo } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import dayjs from "dayjs";
import { useInvoice } from "../../hooks/context/invoiceContext";
import MonthlyComparisonChart from "../../components/chart/monthlyComparisonChart";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function HomePage() {

  const { invoices } = useInvoice();

  const safeInvoices = Array.isArray(invoices) ? invoices : [];

  const doughnutData = useMemo(() => {

    const statusCountMap = new Map<string, number>();

    safeInvoices.forEach((inv) => {

      const status = inv.documentStatus || "Unknown";
      statusCountMap.set(status, (statusCountMap.get(status) ?? 0) + 1);
    });

    const labels = Array.from(statusCountMap.keys());
    const data = Array.from(statusCountMap.values());

    return {
      labels,
      datasets: [
        {
          label: "Distribution by Status",
          data,
          backgroundColor: ["#F59E0B", "#10B981", "#EF4444", "#3B82F6", "#A855F7", "#6B7280"],
          hoverOffset: 4,
        },
      ],
    };
  }, [safeInvoices]);

  const doughnutOptions = {

    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
    },
  };

  const underReviewInvoices = useMemo(() => {

    return safeInvoices.filter(
      (inv) => inv.documentStatus?.toLowerCase() === "under review"
    );
  }, [safeInvoices]);

  return (

    <div className="flex flex-col w-full min-h-screen p-4 overflow-y-auto">
      <style jsx global>{`@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"); body { font-family: "Poppins", sans-serif;}`}</style>

      <div className="grid grid-cols-1 gap-4 mb-6 w-full">
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Monthly Comparison</h2>
          <div>
            <MonthlyComparisonChart />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 w-full">
        <div className="bg-white p-6 rounded-2xl shadow-md h-[28rem] flex flex-col">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Status Distribution</h2>
          <div className="flex-1 flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Recent Activity</h2>
          <ul className="space-y-3 text-md text-gray-600 flex-1 overflow-auto">
            <li>✅ Created a new Invoice <strong>Qtrust February</strong></li>
            <li>✔️ Changed <strong>Qtrust February</strong> Status to accepted</li>
            <li>📤 Sent invoice <strong>FV/25/0001</strong> to <strong>Verification</strong></li>
            <li>✅ Invoice accepted by the <strong>Administrator</strong></li>
          </ul>
        </div>
      </div>

      <div className="hidden md:block bg-white p-6 rounded-2xl shadow-md w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Invoice Awaiting Approval</h2>
        <table className="w-full border-collapse text-center text-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b p-3 text-gray-700">Invoice Name</th>
              <th className="border-b p-3 text-gray-700">Customer Name</th>
              <th className="border-b p-3 text-gray-700">Invoice Date</th>
              <th className="border-b p-3 text-gray-700">Due Date</th>
              <th className="border-b p-3 text-gray-700">Netto</th>
              <th className="border-b p-3 text-gray-700">Status</th>
              <th className="border-b p-3 text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {underReviewInvoices.length === 0 ? (
              <tr><td colSpan={7} className="p-3 text-gray-500 italic">Brak faktur o statusie „Under Review”</td></tr>
            ) : (
              underReviewInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="p-3">{inv.nameInvoice}</td>
                  <td className="p-3">{inv.customerName}</td>
                  <td className="p-3">{dayjs(inv.dataInvoice).format('YYYY-MM-DD')}</td>
                  <td className="p-3">{dayjs(inv.dueDate).format('YYYY-MM-DD')}</td>
                  <td className="p-3">{inv.summaryNetto} zł</td>
                  <td className="p-3 text-yellow-600 font-semibold">{inv.documentStatus}</td>
                  <td className="p-3">
                    <button className="bg-yellow-400 px-4 py-2 rounded-lg text-white hover:bg-yellow-500">Reminder</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}