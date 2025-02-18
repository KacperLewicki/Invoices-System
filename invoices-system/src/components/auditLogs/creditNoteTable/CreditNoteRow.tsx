'use client';

import React, { useState } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import HorizontalTimeline from '../HorizontalTimeline/HorizontalTimeline';
import { CreditNoteData, AuditLog } from '../../../types/typesInvoice';

type CreditNoteDataWithId = CreditNoteData & { id: number };

function CreditNoteRow ({

    creditNote,
    auditLogs,

}: {

    creditNote: CreditNoteDataWithId;
    auditLogs: AuditLog[];

}) {

    const [open, setOpen] = useState(false);

    const rowLogs = auditLogs.filter((log) => (log.table_name === 'creditnotesinvoices' || log.table_name === 'creditnoteitems') && log.row_id === creditNote.id);

    return (
        <>
            <tr
                onClick={() => setOpen(!open)} className="hover:bg-purple-50 transition-colors cursor-pointer">
                <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                        {open ? (<MdKeyboardArrowUp className="text-purple-600 text-xl" />) : (<MdKeyboardArrowDown className="text-purple-600 text-xl" />)}
                        <span className="font-medium text-gray-800"> {creditNote.creditNote} </span>
                    </div>
                </td>
                <td className="py-3 px-4">{new Date(creditNote.dataInvoice).toLocaleDateString()}</td>
                <td className="py-3 px-4">{creditNote.customerName}</td>
                <td className="py-3 px-4"> {creditNote.summaryNetto} {creditNote.currency} </td>
                <td className="py-3 px-4">{creditNote.documentStatus}</td>
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

export default CreditNoteRow;