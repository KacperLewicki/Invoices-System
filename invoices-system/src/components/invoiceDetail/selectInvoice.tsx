"use client";

import React from "react";
import { InvoiceData, ItemData } from "../../types/typesInvoice";

interface ItemDataWithId extends ItemData {

    id: number;
}

interface InvoiceDataWithItems extends InvoiceData {

    items: ItemDataWithId[];
}

interface selectInvoiceViewProps {

    invoice: InvoiceDataWithItems;
}

const SelectInvoice: React.FC<selectInvoiceViewProps> = ({ invoice }) => {
    return (
        <div className="w-full max-w-7xl bg-white p-8 shadow-lg rounded-lg border border-gray-200">
            <header className="border-b border-gray-300 pb-4 mb-4 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-purple-700">
                    Invoice: {invoice.nameInvoice}
                </h1>
                <p className="text-lg text-gray-700">
                    Status:{" "}
                    <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${invoice.documentStatus === "Paid - Final Invoice"
                            ? "bg-green-200 text-green-800"
                            : invoice.documentStatus === "Requires Correction"
                                ? "bg-red-200 text-red-800"
                                : invoice.documentStatus === "Under Review"
                                    ? "bg-yellow-200 text-yellow-800"
                                    : "bg-orange-100 text-orange-600"
                            }`}>
                        {invoice.documentStatus}
                    </span>
                </p>
            </header>

            <section className="mb-6 text-gray-900">
                <h2 className="text-lg font-semibold mb-2 text-purple-700">
                    Client Details
                </h2>
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <p>
                            <strong>Client:</strong> {invoice.customerName}
                        </p>
                        <p>
                            <strong>Payment Method:</strong> {invoice.paymentMethod}
                        </p>
                        <p>
                            <strong>Currency:</strong> {invoice.currency}
                        </p>
                    </div>
                    <div className="pl-6">
                        <p>
                            <strong>Seller:</strong> {invoice.seller}
                        </p>
                        <p>
                            <strong>Effective Month:</strong> {invoice.effectiveMonth}
                        </p>
                    </div>
                </div>
            </section>

            <section className="mb-6 text-gray-900">
                <h2 className="text-lg font-semibold mb-2 text-purple-700">
                    Invoice Details
                </h2>
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <p>
                            <strong>Issue Date:</strong>{" "}
                            {new Date(invoice.dataInvoice).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Payment Due Date:</strong>{" "}
                            {new Date(invoice.dueDate).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="pl-6">
                        <p>
                            <strong>Sale Date:</strong>{" "}
                            {new Date(invoice.dataInvoiceSell).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Comment:</strong> {invoice.comments || "None"}
                        </p>
                    </div>
                </div>
            </section>

            <section className="mb-6 text-gray-900">
                <h2 className="text-lg font-semibold mb-2 text-purple-700">
                    Invoice Items
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
                            <th className="px-4 py-2 border border-gray-200">Comment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item) => (
                            <tr
                                key={item.id}
                                className="hover:bg-purple-100 transition duration-200 ease-in-out">
                                <td className="px-4 py-2 border border-gray-200">
                                    {item.nameItem}
                                </td>
                                <td className="px-4 py-2 border border-gray-200 text-right">
                                    {Math.round(item.quantity)}
                                </td>
                                <td className="px-4 py-2 border border-gray-200 text-right">
                                    {item.nettoItem} {invoice.currency}
                                </td>
                                <td className="px-4 py-2 border border-gray-200 text-right">
                                    {Math.round(item.vatItem)}%
                                </td>
                                <td className="px-4 py-2 border border-gray-200 text-right">
                                    {item.bruttoItem} {invoice.currency}
                                </td>
                                <td className="px-4 py-2 border border-gray-200">
                                    {item.comment || "None"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className="mt-6 text-right border-t border-gray-300 pt-4 text-gray-900">
                <p className="text-lg">
                    <strong>Total Net:</strong> {invoice.summaryNetto} {invoice.currency}
                </p>
                <p className="text-lg">
                    <strong>Total VAT:</strong> {invoice.summaryVat} {invoice.currency}
                </p>
                <p className="text-lg font-bold text-purple-700">
                    <strong>Total Gross:</strong> {invoice.summaryBrutto}{" "}
                    {invoice.currency}
                </p>
            </section>
        </div>
    );
};

export default SelectInvoice;
