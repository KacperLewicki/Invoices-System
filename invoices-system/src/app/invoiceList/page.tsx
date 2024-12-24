"use client";

import React, { useState } from 'react'
import CorrectiveInvoices from '../../components/invoiceList/correctiveInvoices';
import Invoices from '../../components/invoiceList/invoices';
import '../../globalCSS/globals.css';

export default function InvoiceList() {

  const [showInvoices, setShowInvoices] = useState(false);
  const [showCorrectiveInvoices, setShowCorrectiveInvoices] = useState(false);

  const showInvoice = () => {

    setShowInvoices(true);
    setShowCorrectiveInvoices(false);
  }

  const showCreditNote = () => {

    setShowInvoices(false);
    setShowCorrectiveInvoices(true);
  }

  return (
    <div className=" flex flex-col items-center justify-center bg-white py-10">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Lista Twoich Faktur</h1>

      <div className="flex space-x-4 mb-8">
        <button
          className="bg-purple-600 text-white rounded-lg py-2 px-6 hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
          onClick={showInvoice}
        >
          Stworzone Faktury
        </button>
        <button
          className="bg-purple-600 text-white rounded-lg py-2 px-6 hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
          onClick={showCreditNote}
        >
          Poprawione Faktury
        </button>
      </div>

      <div className="max-w-5xl">
        {showInvoices && <Invoices />}
        {showCorrectiveInvoices && <CorrectiveInvoices />}
      </div>
    </div>
  );
}


