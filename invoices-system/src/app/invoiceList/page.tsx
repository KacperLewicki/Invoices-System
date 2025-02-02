'use client';

import React, { useState } from 'react';
import CreditNotes from '../../invoicesCreditNotesListPage/creditNote';
import Invoices from '../../invoicesListPage/invoices';
import InvoicesApproved from '../../invoicesApprovedListPage/invoicesApproved';
import '../../globalCSS/globals.css';

export default function InvoiceList() {

  const [showInvoices, setShowInvoices] = useState(false);
  const [showCorrectiveInvoices, setShowCorrectiveInvoices] = useState(false);
  const [showApprovedInvoices, setShowApprovedInvoices] = useState(true);


  const showInvoice = () => {
    setShowInvoices(true);
    setShowCorrectiveInvoices(false);
    setShowApprovedInvoices(false);
  };

  const showCreditNote = () => {
    setShowInvoices(false);
    setShowCorrectiveInvoices(true);
    setShowApprovedInvoices(false);
  };

  const showApprovedInvoice = () => {
    setShowInvoices(false);
    setShowCorrectiveInvoices(false);
    setShowApprovedInvoices(true);
  };


  const getTranslateX = (): string => {

    if (showApprovedInvoices) return '0%';
    if (showInvoices) return '100%';
    if (showCorrectiveInvoices) return '200%';
    return '0%';
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="relative inline-flex w-full max-w-md sm:max-w-lg md:max-w-xl rounded-full bg-purple-100 p-1 mb-8">
        <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-purple-600 rounded-full transition-all duration-300" style={{ transform: `translateX(${getTranslateX()})` }} />

        <button
          onClick={showApprovedInvoice}
          className={`relative z-10 flex-1 text-center px-2 py-2 sm:px-4 sm:py-2 rounded-full font-medium transition-colors duration-300 ${showApprovedInvoices ? 'text-white' : 'text-purple-700'}`}>
          <span className="text-xs sm:text-sm md:text-base"> Approved Invoices </span>
        </button>

        <button
          onClick={showInvoice}
          className={`relative z-10 flex-1 text-center px-2 py-2 sm:px-4 sm:py-2 rounded-full font-medium transition-colors  duration-300 ${showInvoices ? 'text-white' : 'text-purple-700'} `}>
          <span className="text-xs sm:text-sm md:text-base"> Created Invoices </span>
        </button>

        <button
          onClick={showCreditNote}
          className={`relative z-10 flex-1 text-center px-2 py-2 sm:px-4 sm:py-2 rounded-full font-medium transition-colors duration-300 ${showCorrectiveInvoices ? 'text-white' : 'text-purple-700'}`}>
          <span className="text-xs sm:text-sm md:text-base">Corrected Invoices</span>
        </button>
      </div>

      <div className="w-full px-4">
        {showApprovedInvoices && <InvoicesApproved />}
        {showInvoices && <Invoices />}
        {showCorrectiveInvoices && <CreditNotes />}
      </div>
    </div>
  );
}
