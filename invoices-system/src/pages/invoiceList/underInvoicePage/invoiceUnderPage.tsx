"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import "../../../globalCSS/globals.css";

interface ItemData {
    id: number;
    nameItem: string;
    quantity: number;
    vatItem: number;
    nettoItem: number;
    bruttoItem: number;
    comment: string;
}

interface InvoiceData {
    id: number;
    nameInvoice: string;
    dataInvoice: string;
    dataInvoiceSell: string;
    DueDate: string;
    PaymentTerm: string;
    comments: string;
    seller: string;
    description: string;
    summaryNetto: number;
    summaryVat: number;
    summaryBrutto: number;
    ExchangeRate: number;
    paymentMethod: string;
    effectiveMonth: string;
    documentStatus: string;
    currency: string;
    status: string;
    customerName: string;
    items: ItemData[];
}

const InvoiceUnderPage: React.FC = () => {
    
    const [invoices, setInvoices] = useState<InvoiceData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const fetchInvoices = async () => {

            try {
                const response = await fetch('/api/dowolandInvoiceDataToInvoicePage');
                const data = await response.json();

                if (Array.isArray(data)) {
                    setInvoices(data);
                } else {
                    console.error("Oczekiwana tablica, otrzymano:", data);
                    setInvoices([]);
                }

            } catch (error) {
                console.error('Błąd podczas pobierania faktur:', error);
                setInvoices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    if (loading) {

        return <p className="text-center mt-10 text-lg text-gray-600">Ładowanie danych...</p>;
    }

    const handleRowClick = (invoice: InvoiceData) => {

        router.push(`/invoiceList/invoiceDetail?invoice=${encodeURIComponent(JSON.stringify(invoice))}`);

    };

    return (
        <div className="flex justify-center items-center bg-white">
            <div className="w-full">
                <table className="w-full table-auto border-collapse">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-4 py-4 text-sm font-semibold text-center">Lp.</th>
                            <th className="px-4 py-4 text-sm font-semibold">Numer faktury</th>
                            <th className="px-4 py-4 text-sm font-semibold">Klient</th>
                            <th className="px-4 py-4 text-sm font-semibold text-right">Wartość netto</th>
                            <th className="px-4 py-4 text-sm font-semibold text-right">VAT</th>
                            <th className="px-4 py-4 text-sm font-semibold text-right">Wartość brutto</th>
                            <th className="px-4 py-4 text-sm font-semibold text-center">Waluta</th>
                            <th className="px-4 py-4 text-sm font-semibold">Data wystawienia</th>
                            <th className="px-4 py-4 text-sm font-semibold">Termin płatności</th>
                            <th className="px-4 py-4 text-sm font-semibold">Metoda płatności</th>
                            <th className="px-4 py-4 text-sm font-semibold">Miesiąc efektywności</th>
                            <th className="px-4 py-4 text-sm font-semibold">Status dokumentu</th>
                            <th className="px-4 py-4 text-sm font-semibold text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-800">
                        {invoices.map((invoice, index) => (
                            <tr
                                key={invoice.id}
                                onClick={() => handleRowClick(invoice)}
                                className="cursor-pointer hover:bg-gray-100 transition duration-200 ease-in-out"
                            >
                                <td className="px-4 py-4 text-sm text-center border border-gray-300">{index + 1}</td>
                                <td className="px-4 py-4 text-sm font-medium border border-gray-300">{invoice.nameInvoice}</td>
                                <td className="px-4 py-4 text-sm border border-gray-300">{invoice.customerName}</td>
                                <td className="px-4 py-4 text-sm text-right border border-gray-300">{invoice.summaryNetto}</td>
                                <td className="px-4 py-4 text-sm text-right border border-gray-300">{invoice.summaryVat}</td>
                                <td className="px-4 py-4 text-sm text-right border border-gray-300">{invoice.summaryBrutto}</td>
                                <td className="px-4 py-4 text-sm text-center border border-gray-300">{invoice.currency}</td>
                                <td className="px-4 py-4 text-sm border border-gray-300">{new Date(invoice.dataInvoiceSell).toLocaleDateString()}</td>
                                <td className="px-4 py-4 text-sm border border-gray-300">{new Date(invoice.DueDate).toLocaleDateString()}</td>
                                <td className="px-4 py-4 text-sm border border-gray-300">{invoice.paymentMethod}</td>
                                <td className="px-4 py-4 text-sm border border-gray-300">{invoice.effectiveMonth}</td>
                                <td className="px-4 py-4 text-sm border border-gray-300">{invoice.documentStatus}</td>
                                <td className="px-4 py-4 text-sm border border-gray-300 text-center">
                                    <span
                                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                                            invoice.status === 'Opłacone'
                                                ? 'bg-gray-300 text-gray-800'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        {invoice.status}
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

export default InvoiceUnderPage;
