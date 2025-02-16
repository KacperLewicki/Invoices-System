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

  useEffect(() => {

    fetch('/api/getAuditLogs')

      .then((res) => res.json())
      .then((data) => {

        if (Array.isArray(data)) {

          setAuditLogs(data.map((log) => ({ ...log, action: log.action as AuditAction })));

        } else {

          console.warn('Invalid format of audit logs:', data);

        }
      })

      .catch((err) => console.error('Error while fetching /api/getAuditLogs:', err));

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

    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-700 mb-4 sm:mb-0">
            AuditLogs (Invoices + Credit Notes)
          </h1>
          <div className="max-w-sm w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full border border-purple-300 rounded-lg px-4 py-2
                         focus:ring-2 focus:ring-purple-400 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Invoices</h2>
          {loading && <p className="text-sm text-gray-500">Loading invoices...</p>}
          {error && <p className="text-sm text-red-500">Error: {error}</p>}
          {!loading && !error && (
            <InvoiceTable invoices={filteredInvoices} auditLogs={auditLogs} />
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Credit Notes
          </h2>
          {loadingCreditNotes && (
            <p className="text-sm text-gray-500">Loading credit notes...</p>
          )}
          {errorCreditNotes && (
            <p className="text-sm text-red-500">Error: {errorCreditNotes}</p>
          )}
          {!loadingCreditNotes && !errorCreditNotes && (
            <CreditNoteTable
              creditNotes={filteredCreditNotes}
              auditLogs={auditLogs.map((log) => ({
                ...log,
                action: log.action as AuditAction,
              }))}
            />
          )}
        </section>
      </div>
    </div>
  );
}
