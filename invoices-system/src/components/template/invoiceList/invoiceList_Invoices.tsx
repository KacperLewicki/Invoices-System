"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useInvoice } from '../../../hooks/context/invoiceContext';
import "../../../globalCSS/globals.css";
import { InvoiceData, ItemData } from '../../../types/typesInvoice';

interface Item_Data extends ItemData {

    id: number;
}

interface Invoice_Data extends InvoiceData {

    id: number;
    items: Item_Data[];
}

const Invoices: React.FC = () => {

    const { invoices, loading, setSelectedInvoice } = useInvoice();
    const router = useRouter();

    const handleRowClick = (invoice: Invoice_Data) => {

        setSelectedInvoice(invoice);
        router.push(`/invoiceList/invoiceDetails`);
    };

    if (loading) {
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
                            <th className="px-4 py-4 text-sm font-semibold">Miesiąc</th>
                            <th className="px-4 py-4 text-sm font-semibold text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800 bg-white">
                        {invoices.map((invoice, index) => (
                            <tr
                                key={invoice.id}
                                onClick={() => handleRowClick(invoice)}
                                className="cursor-pointer hover:bg-purple-100 transition duration-200 ease-in-out"
                            >
                                <td className="px-4 py-4 text-sm text-center border border-gray-200">{index + 1}</td>
                                <td className="px-4 py-4 text-sm font-medium border border-gray-200">{invoice.nameInvoice}</td>
                                <td className="px-4 py-4 text-sm border border-gray-200">{invoice.customerName}</td>
                                <td className="px-4 py-4 text-sm text-right border border-gray-200">{invoice.summaryBrutto}</td>
                                <td className="px-4 py-4 text-sm text-center border border-gray-200">{invoice.currency}</td>
                                <td className="px-4 py-4 text-sm border border-gray-200">{new Date(invoice.dataInvoiceSell).toLocaleDateString()}</td>
                                <td className="px-4 py-4 text-sm border border-gray-200">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                                <td className="px-4 py-4 text-sm border border-gray-200">{invoice.effectiveMonth}</td>
                                <td className="px-4 py-4 text-sm border border-gray-200 text-center">
                                    <span
                                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${invoice.documentStatus === 'Opłacone'
                                            ? 'bg-green-200 text-green-800'
                                            : invoice.documentStatus === 'Do poprawy'
                                                ? 'bg-red-200 text-red-800'
                                                : invoice.documentStatus === 'W trakcie akceptacji'
                                                    ? 'bg-yellow-200 text-yellow-800'
                                                    : 'bg-orange-100 text-orange-600'
                                            }`}
                                    >
                                        {invoice.documentStatus}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Invoices;
