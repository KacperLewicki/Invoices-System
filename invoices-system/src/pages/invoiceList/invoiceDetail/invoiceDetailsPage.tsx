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
    dueDate: string;
    paymentTerm: string;
    comments: string;
    seller: string;
    description: string;
    summaryNetto: number;
    summaryVat: number;
    summaryBrutto: number;
    exchangeRate: number;
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
            <div className="w-full max-w-5xl bg-white p-8 shadow-lg rounded-lg border border-gray-200">
                <header className="border-b border-gray-300 pb-4 mb-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-purple-700">Faktura: {invoice.nameInvoice}</h1>
                    <p className="text-lg text-gray-700">
                        Status:  <span
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
                    </p>
                </header>

                <section className="mb-6 text-gray-900">
                    <h2 className="text-lg font-semibold mb-2 text-purple-700">Dane Klienta</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <p><strong>Klient:</strong> {invoice.customerName}</p>
                        <p><strong>Sprzedawca:</strong> {invoice.seller}</p>
                        <p><strong>Metoda płatności:</strong> {invoice.paymentMethod}</p>
                        <p><strong>Miesiąc efektywności:</strong> {invoice.effectiveMonth}</p>
                        <p><strong>Waluta:</strong> {invoice.currency}</p>
                    </div>
                </section>

                <section className="mb-6 text-gray-900">
                    <h2 className="text-lg font-semibold mb-2 text-purple-700">Szczegóły Faktury</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <p><strong>Data wystawienia:</strong> {new Date(invoice.dataInvoice).toLocaleDateString()}</p>
                        <p><strong>Data sprzedaży:</strong> {new Date(invoice.dataInvoiceSell).toLocaleDateString()}</p>
                        <p><strong>Termin płatności:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                        <p><strong>Komentarz:</strong> {invoice.comments || "Brak"}</p>
                    </div>
                </section>

                <section className="mb-6 text-gray-900">
                    <h2 className="text-lg font-semibold mb-2 text-purple-700">Pozycje Faktury</h2>
                    <table className="w-full text-left border-collapse bg-white">
                        <thead>
                            <tr className="bg-purple-800 text-white">
                                <th className="px-4 py-2 border border-gray-200">Nazwa</th>
                                <th className="px-4 py-2 border border-gray-200 text-right">Ilość</th>
                                <th className="px-4 py-2 border border-gray-200 text-right">Netto</th>
                                <th className="px-4 py-2 border border-gray-200 text-right">VAT</th>
                                <th className="px-4 py-2 border border-gray-200 text-right">Brutto</th>
                                <th className="px-4 py-2 border border-gray-200">Komentarz</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item) => (
                                <tr key={item.id} className="hover:bg-purple-100 transition duration-200 ease-in-out">
                                    <td className="px-4 py-2 border border-gray-200">{item.nameItem}</td>
                                    <td className="px-4 py-2 border border-gray-200 text-right">{item.quantity}</td>
                                    <td className="px-4 py-2 border border-gray-200 text-right">{item.nettoItem} {invoice.currency}</td>
                                    <td className="px-4 py-2 border border-gray-200 text-right">{item.vatItem}%</td>
                                    <td className="px-4 py-2 border border-gray-200 text-right">{item.bruttoItem} {invoice.currency}</td>
                                    <td className="px-4 py-2 border border-gray-200">{item.comment || "Brak"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section className="mt-6 text-right border-t border-gray-300 pt-4 text-gray-900">
                    <p className="text-lg"><strong>Razem Netto:</strong> {invoice.summaryNetto} {invoice.currency}</p>
                    <p className="text-lg"><strong>Razem VAT:</strong> {invoice.summaryVat} {invoice.currency}</p>
                    <p className="text-lg font-bold text-purple-700"><strong>Razem Brutto:</strong> {invoice.summaryBrutto} {invoice.currency}</p>
                </section>
            </div>
        </div>
    );

};

export default InvoiceDetailPage;
