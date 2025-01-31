"use client";

import React, { ChangeEvent } from "react";
import { CreditNoteData, CreditNoteItemData } from "../../types/typesInvoice";

interface CorrectionModalProps {

    creditNoteData: CreditNoteData | null;
    setCreditNoteData: React.Dispatch<React.SetStateAction<CreditNoteData | null>>;
    creditNoteItems: CreditNoteItemData[];
    setCreditNoteItems: React.Dispatch<React.SetStateAction<CreditNoteItemData[]>>;
    calculateTotals: (items: CreditNoteItemData[]) => {
        summaryNetto: number;
        summaryVat: number;
        summaryBrutto: number;
    };

    submitCorrection: () => Promise<void>;
    closeModal: () => void;
}

const CorrectionModal: React.FC<CorrectionModalProps> = ({

    creditNoteData,
    setCreditNoteData,
    creditNoteItems,
    setCreditNoteItems,
    calculateTotals,
    submitCorrection,
    closeModal,

}) => {

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCreditNoteData((prev) =>
            prev ? { ...prev, [name]: value } : null
        );
    };

    const handleItemChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = e.target;
        const updatedItems = [...creditNoteItems];

        updatedItems[index] = {
            ...updatedItems[index],
            [name]: name === "itemName" ? value : parseFloat(value) || 0,
        };

        const currentItem = updatedItems[index];
        const quantity = parseFloat(currentItem.quantity?.toString()) || 1;
        const netto = parseFloat(currentItem.nettoItem?.toString()) || 0;
        const vat = parseFloat(currentItem.vatItem?.toString()) || 0;

        if (netto > 0 && quantity > 0) {

            const totalNetto = netto * quantity;
            const totalVat = (totalNetto * vat) / 100;
            const totalBrutto = totalNetto + totalVat;
            currentItem.bruttoItem = parseFloat(totalBrutto.toFixed(2));

        } else {

            currentItem.bruttoItem = 0;
        }
        updatedItems[index] = currentItem;

        setCreditNoteItems(updatedItems);

        const totals = calculateTotals(updatedItems);
        setCreditNoteData((prev) => (prev ? { ...prev, ...totals } : null));
    };

    const handleItemDelete = (index: number) => {

        const updatedItems = creditNoteItems.filter((_, i) => i !== index);
        setCreditNoteItems(updatedItems);

        const totals = calculateTotals(updatedItems);
        setCreditNoteData((prev) => (prev ? { ...prev, ...totals } : null));
    };

    const handleAddItem = () => {

        const newItem: CreditNoteItemData = {
            itemName: "",
            quantity: 0,
            nettoItem: 0,
            vatItem: 0,
            bruttoItem: 0,
        };

        const updatedItems = [...creditNoteItems, newItem];
        setCreditNoteItems(updatedItems);

        const totals = calculateTotals(updatedItems);
        setCreditNoteData((prev) => (prev ? { ...prev, ...totals } : null));
    };

    if (!creditNoteData) {

        return <p className="text-center">No data for correction.</p>;
    }

    return (

        <div className="bg-white rounded-lg p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl mb-6 font-semibold text-center">
                Correct Invoice
            </h2>

            <div className="grid grid-cols-3 gap-4 w-full">
                <div>
                    <label className="block text-gray-700">Invoice Name</label>
                    <input
                        type="text"
                        name="invoiceName"
                        value={creditNoteData.invoiceName || ""}
                        onChange={handleInputChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                        readOnly />
                </div>
                <div>
                    <label className="block text-gray-700">Payment Terms</label>
                    <input
                        type="text"
                        name="paymentTerm"
                        value={creditNoteData.paymentTerm || ""}
                        onChange={handleInputChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                        readOnly />
                </div>
                <div>
                    <label className="block text-gray-700">Comments</label>
                    <input
                        type="text"
                        name="comments"
                        value={creditNoteData.comments || ""}
                        onChange={handleInputChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full" />
                </div>
                <div>
                    <label className="block text-gray-700">Seller</label>
                    <input
                        type="text"
                        name="seller"
                        value={creditNoteData.seller || ""}
                        onChange={handleInputChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full" />
                </div>
                <div>
                    <label className="block text-gray-700">Client Name</label>
                    <input
                        type="text"
                        name="customerName"
                        value={creditNoteData.customerName || ""}
                        onChange={handleInputChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full" />
                </div>
                <div>
                    <label className="block text-gray-700">Description</label>
                    <input
                        type="text"
                        name="description"
                        value={creditNoteData.description || ""}
                        onChange={handleInputChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full" />
                </div>
                <div>
                    <label className="block text-gray-700">Exchange Rate</label>
                    <input
                        type="number"
                        name="exchangeRate"
                        value={creditNoteData.exchangeRate || ""}
                        onChange={handleInputChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                        readOnly />
                </div>
                <div>
                    <label className="block text-gray-700">Effective Month</label>
                    <input
                        type="text"
                        name="effectiveMonth"
                        value={creditNoteData.effectiveMonth || ""}
                        onChange={handleInputChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full" />
                </div>
                <div>
                    <label className="block text-gray-700">Currency</label>
                    <input
                        type="text"
                        name="currency"
                        value={creditNoteData.currency || ""}
                        onChange={handleInputChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full" />
                </div>
            </div>

            <h2 className="text-2xl font-semibold text-center">Invoice Items</h2>
            <div className="flex justify-end">
                <button
                    onClick={handleAddItem}
                    className="bg-purple-600 text-white py-1 px-3 rounded hover:bg-green-700">
                    Add Item
                </button>
            </div>

            <table className="w-full text-left border-collapse bg-white mt-4">
                <thead>
                    <tr className="bg-purple-800 text-white">
                        <th className="px-4 py-2 border border-gray-200">Name</th>
                        <th className="px-4 py-2 border border-gray-200 text-right">
                            Quantity
                        </th>
                        <th className="px-4 py-2 border border-gray-200 text-right">Net</th>
                        <th className="px-4 py-2 border border-gray-200 text-right">
                            VAT (%)
                        </th>
                        <th className="px-4 py-2 border border-gray-200 text-right">
                            Gross
                        </th>
                        <th className="px-4 py-2 border border-gray-200 text-right">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {creditNoteItems.map((item, index) => (
                        <tr key={index}>
                            <td className="px-4 py-2 border border-gray-200">
                                <input
                                    type="text"
                                    name="itemName"
                                    value={item.itemName}
                                    onChange={(e) => handleItemChange(e, index)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="Item Name" />
                            </td>
                            <td className="px-4 py-2 border border-gray-200 text-right">
                                <input
                                    type="number"
                                    name="quantity"
                                    value={Math.round(item.quantity)}
                                    onChange={(e) => handleItemChange(e, index)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="Quantity" />
                            </td>
                            <td className="px-4 py-2 border border-gray-200 text-right">
                                <input
                                    type="number"
                                    name="nettoItem"
                                    value={item.nettoItem}
                                    onChange={(e) => handleItemChange(e, index)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="Net" />
                            </td>
                            <td className="px-4 py-2 border border-gray-200 text-right">
                                <input
                                    type="number"
                                    name="vatItem"
                                    value={Math.round(item.vatItem)}
                                    onChange={(e) => handleItemChange(e, index)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="VAT (%)" />
                            </td>
                            <td className="px-4 py-2 border border-gray-200 text-right">
                                <input
                                    type="number"
                                    name="bruttoItem"
                                    value={item.bruttoItem}
                                    onChange={(e) => handleItemChange(e, index)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    placeholder="Gross"
                                    readOnly />
                            </td>
                            <td className="px-4 py-2 border border-gray-200 text-right">
                                <button
                                    onClick={() => handleItemDelete(index)}
                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="grid grid-cols-3 gap-4 w-full mt-6">
                <div>
                    <label className="block text-gray-700">Total Net</label>
                    <input
                        type="number"
                        name="summaryNetto"
                        value={creditNoteData.summaryNetto || ""}
                        onChange={handleInputChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                        readOnly />
                </div>
                <div>
                    <label className="block text-gray-700">Total VAT</label>
                    <input
                        type="number"
                        name="summaryVat"
                        value={creditNoteData.summaryVat || ""}
                        onChange={handleInputChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                        readOnly />
                </div>
                <div>
                    <label className="block text-gray-700">Total Gross</label>
                    <input
                        type="number"
                        name="summaryBrutto"
                        value={creditNoteData.summaryBrutto || ""}
                        onChange={handleInputChange}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                        readOnly />
                </div>
            </div>

            <div className="flex justify-center mt-6">
                <button
                    onClick={submitCorrection}
                    className="bg-purple-800 text-white py-2 px-6 rounded hover:bg-purple-900">
                    Submit Invoice
                </button>
            </div>
        </div>
    );
};

export default CorrectionModal;
