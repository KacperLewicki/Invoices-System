"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInvoice } from '../../hooks/context/invoiceContext';
import "../../globalCSS/globals.css";
import { CreditNoteData, CreditNoteItemData } from '../../types/typesInvoice';

interface CreditNote_Item extends CreditNoteItemData {

    id: number;
}

interface CreditNote_Data extends CreditNoteData {

    id: number;
    items: CreditNote_Item[];
}

const CreditNotes: React.FC = () => {

    const { creditNotes, loadingCreditNotes, setSelectedCreditNote } = useInvoice();
    const router = useRouter();

    const [localCreditNotes, setLocalCreditNotes] = useState<CreditNote_Data[]>([]);

    useEffect(() => {

        if (Array.isArray(creditNotes)) {

            setLocalCreditNotes(
                creditNotes.map((creditNote) => ({
                    ...creditNote,
                }))
            );
        }
    }, [creditNotes]);

    const handleRowClick = (creditNote: CreditNote_Data) => {

        setSelectedCreditNote(creditNote);
        router.push(`/invoiceList/invoiceDetails/creditnote`);
    };

    if (loadingCreditNotes) {

        return <p className="text-center mt-10 text-lg text-gray-600">Ładowanie danych...</p>;
    }

    return (
        <div className="flex justify-center items-center bg-white p-6">
            <div className="w-full max-w-full shadow-lg rounded-lg border border-gray-200 overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead className="bg-purple-800 text-white">
                        <tr>
                            <th className="px-4 py-4 text-sm font-semibold text-center">Lp.</th>
                            <th className="px-4 py-4 text-sm font-semibold">Numer Credit Note</th>
                            <th className="px-4 py-4 text-sm font-semibold">Klient</th>
                            <th className="px-4 py-4 text-sm font-semibold text-right">Wartość brutto</th>
                            <th className="px-4 py-4 text-sm font-semibold text-center">Waluta</th>
                            <th className="px-4 py-4 text-sm font-semibold">Data wystawienia</th>
                            <th className="px-4 py-4 text-sm font-semibold">Termin płatności</th>
                            <th className="px-4 py-4 text-sm font-semibold">Miesiąc</th>
                            <th className="px-4 py-4 text-sm font-semibold text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800 bg-white">
                        {localCreditNotes.length > 0 ? (
                            localCreditNotes.map((creditNote, index) => (
                                <tr
                                    key={creditNote.id}
                                    onClick={() => handleRowClick(creditNote)}
                                    className="cursor-pointer hover:bg-purple-100 transition duration-200 ease-in-out">
                                    <td className="px-4 py-4 text-sm text-center border border-gray-200">{index + 1}</td>
                                    <td className="px-4 py-4 text-sm font-medium border border-gray-200">{creditNote.creditNote}</td>
                                    <td className="px-4 py-4 text-sm border border-gray-200">{creditNote.customerName}</td>
                                    <td className="px-4 py-4 text-sm text-right border border-gray-200">{creditNote.summaryBrutto}</td>
                                    <td className="px-4 py-4 text-sm text-center border border-gray-200">{creditNote.currency}</td>
                                    <td className="px-4 py-4 text-sm border border-gray-200">
                                        {new Date(creditNote.dataInvoiceSell).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 text-sm border border-gray-200">
                                        {new Date(creditNote.dueDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 text-sm border border-gray-200">{creditNote.effectiveMonth}</td>
                                    <td className="px-4 py-4 text-sm border border-gray-200 text-center">
                                        <span
                                            className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${creditNote.documentStatus === 'Poprawka zatwierdzona - opłacona - gotowa faktura'
                                                    ? 'bg-green-200 text-green-800'
                                                    : 'bg-yellow-200 text-yellow-800'
                                                }`}>
                                            {creditNote.documentStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="px-4 py-4 text-center text-sm text-gray-600">
                                    Brak dostępnych not kredytowych do wyświetlenia.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CreditNotes;
