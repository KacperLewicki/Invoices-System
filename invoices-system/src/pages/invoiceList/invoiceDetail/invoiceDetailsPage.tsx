import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

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

const InvoiceDetailPage: React.FC = () => {

    const searchParams = useSearchParams();

    const invoiceData = searchParams?.get("invoice") || null;

    const [invoice, setInvoice] = useState<InvoiceData | null>(null);

    useEffect(() => {

        if (invoiceData) {

            try {
                const parsedInvoice: InvoiceData = JSON.parse(invoiceData);
                setInvoice(parsedInvoice);

            } catch (error) {

                console.error("Błąd parsowania danych faktury:", error);
            }
        }
    }, [invoiceData]);

    if (!invoice) {
        
        return <p>Faktura nie znaleziona</p>;
    }

    return (
        <div className="min-h-screen bg-white flex justify-center items-center py-10">
            <div className="w-full max-w-4xl bg-gray-200 p-8 shadow-lg rounded-lg">
                <header className="border-b border-gray-300 pb-4 mb-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Faktura: {invoice.nameInvoice}</h1>
                    <p className="text-lg text-gray-700">Status: <span className="font-semibold">{invoice.status}</span></p>
                </header>

                <section className="mb-6 text-gray-900">
                    <h2 className="text-lg font-semibold mb-2">Dane Klienta</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <p><strong>Klient:</strong> {invoice.customerName}</p>
                        <p><strong>Sprzedawca:</strong> {invoice.seller}</p>
                        <p><strong>Metoda płatności:</strong> {invoice.paymentMethod}</p>
                        <p><strong>Miesiąc efektywności:</strong> {invoice.effectiveMonth}</p>
                        <p><strong>Status dokumentu:</strong> {invoice.documentStatus}</p>
                        <p><strong>Waluta:</strong> {invoice.currency}</p>
                    </div>
                </section>

                <section className="mb-6 text-gray-900">
                    <h2 className="text-lg font-semibold mb-2">Szczegóły Faktury</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <p><strong>Data wystawienia:</strong> {new Date(invoice.dataInvoice).toLocaleDateString()}</p>
                        <p><strong>Data sprzedaży:</strong> {new Date(invoice.dataInvoiceSell).toLocaleDateString()}</p>
                        <p><strong>Termin płatności:</strong> {new Date(invoice.DueDate).toLocaleDateString()}</p>
                        <p><strong>Komentarz:</strong> {invoice.comments || "Brak"}</p>
                    </div>
                </section>

                <section className="mb-6 text-gray-900">
                    <h2 className="text-lg font-semibold mb-2">Pozycje Faktury</h2>
                    <table className="w-full text-left border-collapse bg-gray-200">
                        <thead>
                            <tr className="bg-gray-300 text-gray-700">
                                <th className="px-4 py-2 border border-gray-300">Nazwa</th>
                                <th className="px-4 py-2 border border-gray-300 text-right">Ilość</th>
                                <th className="px-4 py-2 border border-gray-300 text-right">Netto</th>
                                <th className="px-4 py-2 border border-gray-300 text-right">VAT</th>
                                <th className="px-4 py-2 border border-gray-300 text-right">Brutto</th>
                                <th className="px-4 py-2 border border-gray-300">Komentarz</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item) => (
                                <tr key={item.id} className="bg-gray-100">
                                    <td className="px-4 py-2 border border-gray-300">{item.nameItem}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-right">{item.quantity}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-right">{item.nettoItem} {invoice.currency}</td>
                                    <td className="px-4 py-2 border border-gray-300 text-right">{item.vatItem}%</td>
                                    <td className="px-4 py-2 border border-gray-300 text-right">{item.bruttoItem} {invoice.currency}</td>
                                    <td className="px-4 py-2 border border-gray-300">{item.comment || "Brak"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section className="mt-6 text-right border-t border-gray-300 pt-4 text-gray-900">
                    <p className="text-lg"><strong>Razem Netto:</strong> {invoice.summaryNetto} {invoice.currency}</p>
                    <p className="text-lg"><strong>Razem VAT:</strong> {invoice.summaryVat} {invoice.currency}</p>
                    <p className="text-lg font-bold"><strong>Razem Brutto:</strong> {invoice.summaryBrutto} {invoice.currency}</p>
                </section>
            </div>
        </div>
    );
};

export default InvoiceDetailPage;
