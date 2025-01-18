"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInvoice } from '../../hooks/context/invoiceContext';
import "../../globalCSS/globals.css";
import { InvoiceData, CreditNoteData } from '../../types/typesInvoice';

// Rethinking the logic for displaying invoices and credit notes - an improvement - a fix

interface InvoiceWithType extends InvoiceData {

    id: number;
    items: any[];
    type: 'invoice';
}

interface CreditNoteWithType extends CreditNoteData {

    id: number;
    type: 'creditNote';
}

const ApprovedInvoices: React.FC = () => {

    const { invoices, creditNotes, loading, loadingCreditNotes, setSelectedInvoice, setSelectedCreditNote } = useInvoice();
    const router = useRouter();

    const [localInvoices, setLocalInvoices] = useState<InvoiceWithType[]>([]);
    const [localCreditNotes, setLocalCreditNotes] = useState<CreditNoteWithType[]>([]);

    useEffect(() => {

        if (Array.isArray(invoices)) {

            setLocalInvoices(
                invoices
                    .filter((invoice) => invoice.documentStatus?.trim() === 'Paid - Final Invoice')
                    .map((invoice) => ({ ...invoice, type: 'invoice' }))
            );
        }

        if (Array.isArray(creditNotes)) {

            setLocalCreditNotes(
                creditNotes
                    .filter((creditNote) => creditNote.documentStatus?.trim() === 'Correction Approved - Paid - Final Invoice')
                    .map((creditNote) => ({ ...creditNote, type: 'creditNote' }))
            );
        }
    }, [invoices, creditNotes]);

    const combinedData = [...localInvoices, ...localCreditNotes];

    const handleRowClick = (invoices: InvoiceWithType, creditNotes: CreditNoteWithType) => {

        if (invoices.type === 'invoice') {

            setSelectedInvoice(invoices);
            router.push(`/invoiceList/invoiceDetails/invoice`);

        } else {

            setSelectedCreditNote(creditNotes);
            router.push(`/invoiceList/invoiceDetails/creditnote`);
        }
    };

    if (loading || loadingCreditNotes) {

        return <p className="text-center mt-10 text-lg text-gray-600">Data loading...</p>;
    }

    return (
        <div className="flex justify-center items-center bg-white p-6">
            <div className="w-full max-w-full shadow-lg rounded-lg border border-gray-200 overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead className="bg-purple-800 text-white">
                        <tr>
                            <th className="px-4 py-4 text-sm font-semibold text-center">No.</th>
                            <th className="px-4 py-4 text-sm font-semibold">Invoice Number</th>
                            <th className="px-4 py-4 text-sm font-semibold">Client</th>
                            <th className="px-4 py-4 text-sm font-semibold text-right">Gross Value</th>
                            <th className="px-4 py-4 text-sm font-semibold text-center">Currency</th>
                            <th className="px-4 py-4 text-sm font-semibold">Issue Date</th>
                            <th className="px-4 py-4 text-sm font-semibold">Payment Due Date</th>
                            <th className="px-4 py-4 text-sm font-semibold text-center">Type</th>
                            <th className="px-4 py-4 text-sm font-semibold text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800 bg-white">
                        {combinedData.length > 0 ? (
                            combinedData.map((invoice, index) => (
                                <tr
                                    key={`${invoice.type}-${invoice.id}`}
                                    onClick={() => handleRowClick(invoice as InvoiceWithType, invoice as CreditNoteWithType)}
                                    className="cursor-pointer hover:bg-purple-100 transition duration-200 ease-in-out">
                                    <td className="px-4 py-4 text-sm text-center border border-gray-200">{index + 1}</td>
                                    <td className="px-4 py-4 text-sm font-medium border border-gray-200">
                                        {invoice.type === 'invoice' ? invoice.nameInvoice : invoice.creditNote}
                                    </td>
                                    <td className="px-4 py-4 text-sm border border-gray-200">{invoice.customerName}</td>
                                    <td className="px-4 py-4 text-sm text-right border border-gray-200">{invoice.summaryBrutto}</td>
                                    <td className="px-4 py-4 text-sm text-center border border-gray-200">{invoice.currency}</td>
                                    <td className="px-4 py-4 text-sm border border-gray-200">
                                        {new Date(invoice.dataInvoiceSell).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 text-sm border border-gray-200">
                                        {new Date(invoice.dueDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-center border border-gray-200">
                                        {invoice.type === 'invoice' ? 'Invoice' : 'Credit Note'}
                                    </td>
                                    <td className="px-4 py-4 text-sm border border-gray-200 text-center">
                                        <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-green-200 text-green-800">
                                            {invoice.documentStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="px-4 py-4 text-center text-sm text-gray-600">
                                    No available invoices or credit notes to display.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApprovedInvoices;
