'use client';

import React from 'react';
import { InvoiceData, AuditLog } from '../../../types/typesInvoice';
import InvoiceRow from './InvoiceRow';

type InvoiceDataWithId = InvoiceData & { id: number };

export default function InvoiceTable({

    invoices,
    auditLogs,

}: {

    invoices: InvoiceDataWithId[];
    auditLogs: AuditLog[];

}) {

    if (!invoices.length) {

        return <p className="text-sm text-gray-500">No invoices to display.</p>;
    }

    return (

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="w-full text-sm">
                <thead className="bg-purple-600 text-white">
                    <tr>
                        <th className="py-3 px-4 text-left font-semibold">Invoice</th>
                        <th className="py-3 px-4 text-left font-semibold">Issue Date</th>
                        <th className="py-3 px-4 text-left font-semibold">Customer</th>
                        <th className="py-3 px-4 text-left font-semibold">Net Amount</th>
                        <th className="py-3 px-4 text-left font-semibold">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {invoices.map((inv) => (
                        <InvoiceRow
                            key={inv.id}
                            invoice={inv}
                            auditLogs={auditLogs}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

