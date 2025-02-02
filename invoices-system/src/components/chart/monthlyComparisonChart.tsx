"use client";

import React, { useMemo } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";
import { useInvoice } from "../../hooks/context/invoiceContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MonthlyComparisonChart: React.FC = () => {

  const { invoices } = useInvoice();

  const safeInvoices = Array.isArray(invoices) ? invoices : [];

  const chartData = useMemo(() => {

    if (!safeInvoices || safeInvoices.length === 0) {

      return {
        labels: [],
        datasets: [],
      };
    }

    const sums: Record<string, { netto: number; brutto: number; vat: number }> = {};

    safeInvoices.forEach((inv) => {

      const month = dayjs(inv.dataInvoice).format("YYYY-MM");

      if (!sums[month]) {

        sums[month] = { netto: 0, brutto: 0, vat: 0 };
      }
      sums[month].netto += Number(inv.summaryNetto) || 0;
      sums[month].brutto += Number(inv.summaryBrutto) || 0;
      sums[month].vat += Number(inv.summaryVat) || 0;
    });

    const sortedMonths = Object.keys(sums).sort().slice(-3);
    const labels = sortedMonths;

    const nettoValues = sortedMonths.map((m) => sums[m]?.netto || 0);
    const bruttoValues = sortedMonths.map((m) => sums[m]?.brutto || 0);
    const vatValues = sortedMonths.map((m) => sums[m]?.vat || 0);

    return {

      labels,
      datasets: [
        {
          label: "Netto",
          data: nettoValues,
          fill: false,
          borderColor: "rgba(54, 162, 235, 1)",
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: "rgba(54, 162, 235, 1)",
        },
        {
          label: "Brutto",
          data: bruttoValues,
          fill: false,
          borderColor: "rgba(255, 99, 132, 1)",
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: "rgba(255, 99, 132, 1)",
        },
        {
          label: "VAT",
          data: vatValues,
          fill: false,
          borderColor: "rgba(255, 205, 86, 1)",
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: "rgba(255, 205, 86, 1)",
        },
      ],
    };
  }, [safeInvoices]);

  const options = {

    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: "easeInOutQuart" as const,
    },
    plugins: {
      legend: { display: true, position: "top" as const },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const value = tooltipItem.raw;
            return `${tooltipItem.dataset.label}: ${value.toLocaleString("pl-PL", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} PLN`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: number | string) {
            if (typeof value === "number") {
              return `${value.toLocaleString("pl-PL")} PLN`;
            }
            return value;
          },
        },
      },
      x: {
        ticks: {
          autoSkip: false,
        },
      },
    },
  };

  return (

    <div className="w-full h-[480px]">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default MonthlyComparisonChart;
