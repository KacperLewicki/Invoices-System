'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useInvoice } from '../../hooks/context/invoiceContext';
import { AuditLog } from '../../types/typesInvoice';
import InvoiceTable from '../../components/auditLogs/invoiceTable/InvoiceTable';
import CreditNoteTable from '../../components/auditLogs/creditNoteTable/CreditNoteTable';

type AuditAction = 'INSERT' | 'UPDATE' | 'DELETE';

export interface AuditLogs extends AuditLog {
  action: AuditAction;
}

export default function Notifications() {
  const {
    invoices = [],
    loading,
    error,
    creditNotes = [],
    loadingCreditNotes,
    errorCreditNotes,
  } = useInvoice();

  const [searchTerm, setSearchTerm] = useState('');
  const [auditLogs, setAuditLogs] = useState<AuditLogs[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {

    fetch('/api/getAuditLogs')

      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {

          setAuditLogs(data.map((log) => ({
            ...log,
            action: log.action as AuditAction,
          }))
          );
        } else {
          console.warn('Invalid format of audit logs:', data);
        }
      })
      .catch((err) =>
        console.error('Error while fetching /api/getAuditLogs:', err)
      );
  }, []);

  const filteredInvoices = useMemo(() => {

    if (!searchTerm) return invoices;
    return invoices.filter((inv) => inv.nameInvoice.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, invoices]);

  const filteredCreditNotes = useMemo(() => {

    if (!searchTerm) return creditNotes;
    return creditNotes.filter((cn) => cn.creditNote.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, creditNotes]);

  return (

    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-3xl font-bold text-purple-700 mb-4 sm:mb-0"> AuditLogs </h1>
        <div className="max-w-sm w-full">
          <input
            type="text"
            placeholder="Search..."
            className="w-full border border-purple-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="flex justify-center items-center mb-6">
        <div className="relative bg-purple-100 p-1 rounded-full w-64">
          <div className="absolute top-0 left-0 h-full bg-purple-600 rounded-full transition-transform duration-300" style={{ width: '50%', transform: `translateX(${activeTab * 100}%)` }} />
          <button
            onClick={() => setActiveTab(0)}
            className={`relative z-10 w-1/2 text-center py-2 font-semibold
              ${activeTab === 0 ? 'text-white' : 'text-purple-700 hover:text-purple-900'} `}>
            Invoices
          </button>

          <button
            onClick={() => setActiveTab(1)}
            className={`relative z-10 w-1/2 text-center py-2 font-semibold
              ${activeTab === 1 ? 'text-white' : 'text-purple-700 hover:text-purple-900'} `}>
            Credit Notes
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden w-full relative">
        <div className="flex w-[200%] transition-transform duration-300" style={{ transform: `translateX(${activeTab === 1 ? '-50%' : '0%'})` }}>
          <div className="w-[50%] min-h-full overflow-auto p-4">
            {loading && (<p className="text-sm text-gray-500">Loading invoices...</p>)}
            {error && <p className="text-sm text-red-500">Error: {error}</p>}
            {!loading && !error && (<InvoiceTable invoices={filteredInvoices} auditLogs={auditLogs} />)}
          </div>

          <div className="w-[50%] min-h-full overflow-auto p-4">
            {loadingCreditNotes && (<p className="text-sm text-gray-500">Loading credit notes...</p>)}
            {errorCreditNotes && (<p className="text-sm text-red-500"> Error: {errorCreditNotes} </p>)}
            {!loadingCreditNotes && !errorCreditNotes && (<CreditNoteTable creditNotes={filteredCreditNotes} auditLogs={auditLogs.map((log) => ({ ...log, action: log.action as AuditAction }))} />)}
          </div>

        </div>
      </div>
    </div>
  );
}
