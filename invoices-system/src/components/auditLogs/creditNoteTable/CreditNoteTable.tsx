'use client';

import React from 'react';
import { CreditNoteData, AuditLog } from '../../../types/typesInvoice';
import CreditNoteRow from './CreditNoteRow';

type CreditNoteDataWithId = CreditNoteData & { id: number };

export default function CreditNoteTable ({

    creditNotes,
    auditLogs,

}: {

    creditNotes: CreditNoteDataWithId[];
    auditLogs: AuditLog[];

}) {

    if (!creditNotes.length) {

        return <p className="text-sm text-gray-500">No credit notes to display.</p>;
    }

    return (

        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="w-full text-sm">
                <thead className="bg-purple-600 text-white">
                    <tr>
                        <th className="py-3 px-4 text-left font-semibold">Credit Note Number</th>
                        <th className="py-3 px-4 text-left font-semibold">Invoice Date</th>
                        <th className="py-3 px-4 text-left font-semibold">Customer</th>
                        <th className="py-3 px-4 text-left font-semibold">Net Amount</th>
                        <th className="py-3 px-4 text-left font-semibold">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {creditNotes.map((cn) => (
                        <CreditNoteRow
                            key={cn.id}
                            creditNote={cn}
                            auditLogs={auditLogs}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}


