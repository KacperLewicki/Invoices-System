"use client";

import React from "react";
import "../../globalCSS/globals.css";
import { CreditNoteData } from "../../types/typesInvoice";


interface CreditNoteDataExtended extends CreditNoteData {

    id?: number;
}

interface selectCreditNoteProps {

    creditNote: CreditNoteDataExtended;
    onGeneratePDF: () => void;
}

const SelectCreditNote: React.FC<selectCreditNoteProps> = ({

    creditNote,
    onGeneratePDF,

}) => {

    return (

        <div className="flex flex-col lg:flex-row gap-6 py-10 px-4">
            <div className="flex flex-col items-start">
                <button
                    onClick={onGeneratePDF}
                    className="bg-purple-800 text-white py-2 px-6 rounded-lg shadow-md hover:bg-purple-900 mb-4">
                    Generate Invoice PDF
                </button>
            </div>

            <div className="w-full max-w-7xl bg-white p-8 shadow-lg rounded-lg border border-gray-200">
                <header className="border-b border-gray-300 pb-4 mb-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-purple-700">
                        Credit Note: {creditNote.creditNote} - {creditNote.invoiceName}
                    </h1>
                    <p className="text-lg text-gray-700">
                        Status:{" "}
                        <span
                            className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${creditNote.documentStatus ===
                                    "Correction Approved - Paid - Final Invoice"
                                    ? "bg-green-200 text-green-800"
                                    : "bg-green-200 text-green-800"
                                }`}>
                            {creditNote.documentStatus}
                        </span>
                    </p>
                </header>

                <section className="mb-6 text-gray-900">
                    <h2 className="text-lg font-semibold mb-2 text-purple-700">
                        Client Details
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <p>
                            <strong>Client:</strong> {creditNote.customerName}
                        </p>
                        <p>
                            <strong>Seller:</strong> {creditNote.seller}
                        </p>
                        <p>
                            <strong>Payment Method:</strong> {creditNote.paymentMethod}
                        </p>
                        <p>
                            <strong>Month:</strong> {creditNote.effectiveMonth}
                        </p>
                        <p>
                            <strong>Currency:</strong> {creditNote.currency}
                        </p>
                    </div>
                </section>

                <section className="mb-6 text-gray-900">
                    <h2 className="text-lg font-semibold mb-2 text-purple-700">
                        Credit Note Details
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <p>
                            <strong>Issue Date:</strong>{" "}
                            {new Date(creditNote.dataInvoice).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Sale Date:</strong>{" "}
                            {new Date(creditNote.dataInvoiceSell).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Payment Due Date:</strong>{" "}
                            {new Date(creditNote.dueDate).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Comment:</strong> {creditNote.comments || "None"}
                        </p>
                    </div>
                </section>

                <section className="mb-6 text-gray-900">
                    <h2 className="text-lg font-semibold mb-2 text-purple-700">
                        Credit Note Items
                    </h2>
                    <table className="w-full text-left border-collapse bg-white">
                        <thead>
                            <tr className="bg-purple-800 text-white">
                                <th className="px-4 py-2 border border-gray-200">Name</th>
                                <th className="px-4 py-2 border border-gray-200 text-right">
                                    Quantity
                                </th>
                                <th className="px-4 py-2 border border-gray-200 text-right">
                                    Net
                                </th>
                                <th className="px-4 py-2 border border-gray-200 text-right">
                                    VAT
                                </th>
                                <th className="px-4 py-2 border border-gray-200 text-right">
                                    Gross
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {creditNote.items.map((item) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-purple-100 transition duration-200 ease-in-out">
                                    <td className="px-4 py-2 border border-gray-200">
                                        {item.itemName}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-200 text-right">
                                        {Math.round(item.quantity)}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-200 text-right">
                                        {item.nettoItem} {creditNote.currency}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-200 text-right">
                                        {Math.round(item.vatItem)}%
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
                        <strong>Total Net:</strong> {creditNote.summaryNetto}{" "}
                        {creditNote.currency}
                    </p>
                    <p className="text-lg">
                        <strong>Total VAT:</strong> {creditNote.summaryVat}{" "}
                        {creditNote.currency}
                    </p>
                    <p className="text-lg font-bold text-purple-700">
                        <strong>Total Gross:</strong> {creditNote.summaryBrutto}{" "}
                        {creditNote.currency}
                    </p>
                </section>
            </div>
        </div>
    );
};

export default SelectCreditNote;
