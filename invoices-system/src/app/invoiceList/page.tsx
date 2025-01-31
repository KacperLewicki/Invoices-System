"use client";

import React, { useState } from 'react'
import CreditNotes from '../../invoicesCreditNotesListPage/creditNote';
import Invoices from '../../invoicesListPage/invoices';
import '../../globalCSS/globals.css';
import InvoicesApproved from '../../invoicesApprovedListPage/invoicesApproved';

export default function InvoiceList() {

  const [showInvoices, setShowInvoices] = useState(false);
  const [showCorrectiveInvoices, setShowCorrectiveInvoices] = useState(false);
  const [showApprovedInvoices, setShowApprovedInvoices] = useState(false);

  const showInvoice = () => {

    setShowInvoices(true);
    setShowCorrectiveInvoices(false);
    setShowApprovedInvoices(false);
  }

  const showCreditNote = () => {

    setShowInvoices(false);
    setShowCorrectiveInvoices(true);
    setShowApprovedInvoices(false);
  }

  const showApprovedInvoice = () => {

    setShowInvoices(false);
    setShowCorrectiveInvoices(false);
    setShowApprovedInvoices(true);
  }

  return (
    <div className="flex flex-col items-center justify-center bg-white py-10">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">My Invoice List</h1>

      <div className="flex space-x-4 mb-8">
        <button
          className="bg-purple-600 text-white rounded-lg py-2 px-6 hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
          onClick={showApprovedInvoice}>
          Approved Invoices
        </button>
        <button
          className="bg-purple-600 text-white rounded-lg py-2 px-6 hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
          onClick={showInvoice}>
          Created Invoices
        </button>
        <button
          className="bg-purple-600 text-white rounded-lg py-2 px-6 hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
          onClick={showCreditNote}>
          Corrected Invoices
        </button>

      </div>

      <div className="max-w-5xl">
        {showInvoices && <Invoices />}
        {showCorrectiveInvoices && <CreditNotes />}
        {showApprovedInvoices && <InvoicesApproved />}
      </div>
    </div>
  );
}


