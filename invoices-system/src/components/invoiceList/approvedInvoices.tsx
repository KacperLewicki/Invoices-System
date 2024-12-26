"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInvoice } from '../../hooks/context/invoiceContext';
import "../../globalCSS/globals.css";
import { InvoiceData, CreditNoteData } from '../../types/typesInvoice';

interface InvoiceWithType extends InvoiceData {
    id: number;
    items: any[];
    type: 'invoice';
}

interface CreditNoteWithType extends CreditNoteData {
    id: number;
    items: any[];
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
                    .filter((invoice) => invoice.documentStatus?.trim() === 'Opłacona - Gotowa faktura')
                    .map((invoice) => ({ ...invoice, type: 'invoice' }))
            );
        }

        if (Array.isArray(creditNotes)) {

            setLocalCreditNotes(
                creditNotes
                    .filter((creditNote) => creditNote.documentStatus?.trim() === 'Poprawka zatwierdzona - opłacona - gotowa faktura')
                    .map((creditNote) => ({ ...creditNote, type: 'creditNote' }))
            );
        }
    }, [invoices, creditNotes]);

    const combinedData = [...localInvoices, ...localCreditNotes];

    const handleRowClick = (item: InvoiceWithType | CreditNoteWithType) => {

        if (item.type === 'invoice') {

            setSelectedInvoice(item as InvoiceWithType);
            router.push(`/invoiceList/invoiceDetails/invoice`);

        } else {

            setSelectedCreditNote(item as CreditNoteWithType);
            router.push(`/invoiceList/invoiceDetails/creditnote`);
        }
    };

    if (loading || loadingCreditNotes) {

        return <p className="text-center mt-10 text-lg text-gray-600">Ładowanie danych...</p>;
    }

    return (
        <div className="flex justify-center items-center bg-white p-6">
            <div className="w-full max-w-full shadow-lg rounded-lg border border-gray-200 overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead className="bg-purple-800 text-white">
                        <tr>
                            <th className="px-4 py-4 text-sm font-semibold text-center">Lp.</th>
                            <th className="px-4 py-4 text-sm font-semibold">Numer faktury</th>
                            <th className="px-4 py-4 text-sm font-semibold">Klient</th>
                            <th className="px-4 py-4 text-sm font-semibold text-right">Wartość brutto</th>
                            <th className="px-4 py-4 text-sm font-semibold text-center">Waluta</th>
                            <th className="px-4 py-4 text-sm font-semibold">Data wystawienia</th>
                            <th className="px-4 py-4 text-sm font-semibold">Termin płatności</th>
                            <th className="px-4 py-4 text-sm font-semibold text-center">Typ</th>
                            <th className="px-4 py-4 text-sm font-semibold text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800 bg-white">
                        {combinedData.length > 0 ? (
                            combinedData.map((item, index) => (
                                <tr
                                    key={`${item.type}-${item.id}`}
                                    onClick={() => handleRowClick(item)}
                                    className="cursor-pointer hover:bg-purple-100 transition duration-200 ease-in-out">
                                    <td className="px-4 py-4 text-sm text-center border border-gray-200">{index + 1}</td>
                                    <td className="px-4 py-4 text-sm font-medium border border-gray-200">
                                        {item.type === 'invoice' ? item.nameInvoice : item.creditNote}
                                    </td>
                                    <td className="px-4 py-4 text-sm border border-gray-200">{item.customerName}</td>
                                    <td className="px-4 py-4 text-sm text-right border border-gray-200">{item.summaryBrutto}</td>
                                    <td className="px-4 py-4 text-sm text-center border border-gray-200">{item.currency}</td>
                                    <td className="px-4 py-4 text-sm border border-gray-200">
                                        {new Date(item.dataInvoiceSell).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 text-sm border border-gray-200">
                                        {new Date(item.dueDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-center border border-gray-200">
                                        {item.type === 'invoice' ? 'Faktura' : 'Nota kredytowa'}
                                    </td>
                                    <td className="px-4 py-4 text-sm border border-gray-200 text-center">
                                        <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-green-200 text-green-800">
                                            {item.documentStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="px-4 py-4 text-center text-sm text-gray-600">
                                    Brak dostępnych faktur lub not kredytowych do wyświetlenia.
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
