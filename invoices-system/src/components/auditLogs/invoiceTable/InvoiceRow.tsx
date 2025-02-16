'use client';

import React, { useState } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import HorizontalTimeline from '../HorizontalTimeline/HorizontalTimeline';
import { InvoiceData, AuditLog } from '../../../types/typesInvoice';

type InvoiceDataWithId = InvoiceData & { id: number };

function InvoiceRow ({

    invoice,
    auditLogs,

}: {

    invoice: InvoiceDataWithId;
    auditLogs: AuditLog[];

}) {

    const [open, setOpen] = useState(false);

    const rowLogs = auditLogs.filter((log) => (log.table_name === 'invoicemanual' || log.table_name === 'invoiceitem') && log.row_id === invoice.id);

    return (
        <>
            <tr
                onClick={() => setOpen(!open)} className="hover:bg-purple-50 transition-colors cursor-pointer">
                <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                        {open ? (<MdKeyboardArrowUp className="text-purple-600 text-xl" />) : (<MdKeyboardArrowDown className="text-purple-600 text-xl" />)}
                        <span className="font-medium text-gray-800"> {invoice.nameInvoice} </span>
                    </div>
                </td>
                <td className="py-3 px-4">{invoice.dataInvoice}</td>
                <td className="py-3 px-4">{invoice.customerName}</td>
                <td className="py-3 px-4"> {invoice.summaryNetto} {invoice.currency} </td>
                <td className="py-3 px-4">{invoice.documentStatus}</td>
            </tr>
            {open && (
                <tr className="bg-gray-50">
                    <td colSpan={5} className="p-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <HorizontalTimeline logs={rowLogs} />
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

export default InvoiceRow;