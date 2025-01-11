"use client";

import React from "react";
import { useInvoice } from "../../../hooks/context/invoiceContext";
import "../../../globalCSS/globals.css";

const CreditNoteDetails: React.FC = () => {

    const { selectedCreditNote: creditNote } = useInvoice();

    const handleGeneratePDF = async () => {

        try {

            if (!creditNote) {

                throw new Error("Brak danych faktury (creditNote).");
            }

            const payload = {
                creditNote: creditNote.creditNote,
                invoiceName: creditNote.invoiceName,
                documentStatus: creditNote.documentStatus,
                customerName: creditNote.customerName,
                seller: creditNote.seller,
                paymentMethod: creditNote.paymentMethod,
                effectiveMonth: creditNote.effectiveMonth,
                currency: creditNote.currency,
                dataInvoice: creditNote.dataInvoice,
                dataInvoiceSell: creditNote.dataInvoiceSell,
                dueDate: creditNote.dueDate,
                comments: creditNote.comments,
                summaryNetto: creditNote.summaryNetto,
                summaryVat: creditNote.summaryVat,
                summaryBrutto: creditNote.summaryBrutto,
                items: creditNote.items.map(item => ({
                    id: item.id,
                    itemName: item.itemName,
                    quantity: item.quantity,
                    nettoItem: item.nettoItem,
                    vatItem: item.vatItem,
                    bruttoItem: item.bruttoItem,
                })),
            };

            const response = await fetch("/api/invoiceCreditNotePDF", {

                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(payload),

            });

            if (!response.ok) {

                throw new Error("Błąd podczas generowania PDF (pdf-lib).");
            }

            const blob = await response.blob();
            const pdfURL = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = pdfURL;
            link.download = `nota-${creditNote.invoiceName}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(pdfURL);

        } catch (error) {

            console.error(error);
            alert("Wystąpił problem z generowaniem PDF (pdf-lib).");
        }
    };

    if (!creditNote) {

        return (
            <p className="text-center mt-10 text-lg text-gray-600">
                Nota kredytowa nie została znaleziona.
            </p>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 py-10 px-4">
            <div className="flex flex-col items-start">
                <button
                    onClick={handleGeneratePDF}
                    className="bg-purple-800 text-white py-2 px-6 rounded-lg shadow-md hover:bg-purple-900 mb-4"
                >
                    Wygeneruj PDF Faktury
                </button>
            </div>

            <div className="w-full max-w-7xl bg-white p-8 shadow-lg rounded-lg border border-gray-200">
                <header className="border-b border-gray-300 pb-4 mb-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-purple-700">
                        Nota Kredytowa: {creditNote.creditNote} - {creditNote.invoiceName}
                    </h1>
                    <p className="text-lg text-gray-700">
                        Status:{" "}
                        <span
                            className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${creditNote.documentStatus ===
                                "Poprawka zatwierdzona - opłacona - gotowa faktura"
                                ? "bg-green-200 text-green-800"
                                : "bg-green-200 text-green-800"
                                }`}
                        >
                            {creditNote.documentStatus}
                        </span>
                    </p>
                </header>

                <section className="mb-6 text-gray-900">
                    <h2 className="text-lg font-semibold mb-2 text-purple-700">Dane Klienta</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <p>
                            <strong>Klient:</strong> {creditNote.customerName}
                        </p>
                        <p>
                            <strong>Sprzedawca:</strong> {creditNote.seller}
                        </p>
                        <p>
                            <strong>Metoda płatności:</strong> {creditNote.paymentMethod}
                        </p>
                        <p>
                            <strong>Miesiąc:</strong> {creditNote.effectiveMonth}
                        </p>
                        <p>
                            <strong>Waluta:</strong> {creditNote.currency}
                        </p>
                    </div>
                </section>

                <section className="mb-6 text-gray-900">
                    <h2 className="text-lg font-semibold mb-2 text-purple-700">
                        Szczegóły Noty Kredytowej
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <p>
                            <strong>Data wystawienia:</strong>{" "}
                            {new Date(creditNote.dataInvoice).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Data sprzedaży:</strong>{" "}
                            {new Date(creditNote.dataInvoiceSell).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Termin płatności:</strong>{" "}
                            {new Date(creditNote.dueDate).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Komentarz:</strong> {creditNote.comments || "Brak"}
                        </p>
                    </div>
                </section>

                <section className="mb-6 text-gray-900">
                    <h2 className="text-lg font-semibold mb-2 text-purple-700">
                        Pozycje Noty Kredytowej
                    </h2>
                    <table className="w-full text-left border-collapse bg-white">
                        <thead>
                            <tr className="bg-purple-800 text-white">
                                <th className="px-4 py-2 border border-gray-200">Nazwa</th>
                                <th className="px-4 py-2 border border-gray-200 text-right">Ilość</th>
                                <th className="px-4 py-2 border border-gray-200 text-right">Netto</th>
                                <th className="px-4 py-2 border border-gray-200 text-right">VAT</th>
                                <th className="px-4 py-2 border border-gray-200 text-right">Brutto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {creditNote.items.map((item) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-purple-100 transition duration-200 ease-in-out"
                                >
                                    <td className="px-4 py-2 border border-gray-200">{item.itemName}</td>
                                    <td className="px-4 py-2 border border-gray-200 text-right">
                                        {item.quantity}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-200 text-right">
                                        {item.nettoItem} {creditNote.currency}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-200 text-right">
                                        {item.vatItem}%
                                    </td>
                                    <td className="px-4 py-2 border border-gray-200 text-right">
                                        {item.bruttoItem} {creditNote.currency}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section className="mt-6 text-right border-t border-gray-300 pt-4 text-gray-900">
                    <p className="text-lg">
                        <strong>Razem Netto:</strong> {creditNote.summaryNetto} {creditNote.currency}
                    </p>
                    <p className="text-lg">
                        <strong>Razem VAT:</strong> {creditNote.summaryVat} {creditNote.currency}
                    </p>
                    <p className="text-lg font-bold text-purple-700">
                        <strong>Razem Brutto:</strong> {creditNote.summaryBrutto}{" "}
                        {creditNote.currency}
                    </p>
                </section>
            </div>
        </div>
    );
};

export default CreditNoteDetails;
