"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useInvoice } from "../../../hooks/context/invoiceContext";
import Modal from "../../modal/modal_popup";
import { CreditNoteData, CreditNoteItemData } from "../../../types/typesInvoice";
import { fetchInvoiceData, sendCreditNote } from "../../../service/invoiceList/invoiceListService";

// Rethinking the logic for displaying invoices - an improvement - a fix

const InvoiceDetailManager: React.FC = () => {

    const { selectedInvoice: invoice, fetchInvoices, fetchCreditNotes } = useInvoice();
    const [showComment, setShowComment] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [creditNoteData, setCreditNoteData] = useState<CreditNoteData | null>(null);
    const [creditNoteItems, setCreditNoteItems] = useState<CreditNoteItemData[]>([]);
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {

        if (invoice) {

            const data = fetchInvoiceData(invoice);
            setCreditNoteData(data);
            setCreditNoteItems(data?.items || []);
        }

    }, [invoice]);

    const createCreditNote = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const calculateTotals = (items: any[]) => {

        let summaryNetto = 0;
        let summaryVat = 0;
        let summaryBrutto = 0;

        items.forEach((item) => {

            const quantity = parseFloat(item.quantity?.toString()) || 1;
            const netto = parseFloat(item.nettoItem?.toString()) || 0;
            const vat = parseFloat(item.vatItem?.toString()) || 0;

            const totalNetto = netto * quantity;
            const totalBrutto = totalNetto + (totalNetto * vat / 100);
            const totalVat = totalBrutto - totalNetto;

            summaryNetto += parseFloat(totalNetto.toFixed(2));
            summaryBrutto += parseFloat(totalBrutto.toFixed(2));
            summaryVat += parseFloat(totalVat.toFixed(2));
        });

        return {

            summaryNetto: parseFloat(summaryNetto.toFixed(2)),
            summaryVat: parseFloat(summaryVat.toFixed(2)),
            summaryBrutto: parseFloat(summaryBrutto.toFixed(2)),
        };
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {

        const { name, value } = e.target;

        setCreditNoteData((prevData) => prevData ? { ...prevData, [name]: value } : null);
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
        setCreditNoteData((prevData) => prevData ? { ...prevData, ...totals } : null);
    };

    const handleItemDelete = (index: number) => {

        const updatedItems = creditNoteItems.filter((_, i) => i !== index);
        setCreditNoteItems(updatedItems);
        const totals = calculateTotals(updatedItems);
        setCreditNoteData((prevData) => prevData ? { ...prevData, ...totals } : null
        );
    };

    const handleAddItem = () => {

        const newItem: CreditNoteItemData = {

            itemName: "",
            quantity: 0,
            nettoItem: 0,
            vatItem: 0,
            bruttoItem: 0,
        };

        setCreditNoteItems((prevItems) => {

            const updatedItems = [...prevItems, newItem];
            const totals = calculateTotals(updatedItems);

            setCreditNoteData((prevData) => prevData ? { ...prevData, ...totals } : null);

            return updatedItems;
        });
    };

    const validateForm = (): boolean => {

        if (!creditNoteData) return false;

        const requiredFields: { field: keyof CreditNoteData; label: string }[] = [

            { field: 'paymentTerm', label: 'Warunki płatności' },
            { field: 'seller', label: 'Sprzedawca' },
            { field: 'customerName', label: 'Nazwa klienta' },
            { field: 'effectiveMonth', label: 'Miesiąc efektywny' },
            { field: 'currency', label: 'Waluta' }
        ];

        for (const { field, label } of requiredFields) {

            if (!creditNoteData[field]) {

                alert(`The “${label}” field is required.`);

                return false;
            }
        }
        return true;
    };

    const submitCorrection = async () => {

        try {

            if (!validateForm()) {

                console.warn('Formularz zawiera błędy.');
                return;
            }
            if (creditNoteData) {

                const itemsToSend = creditNoteItems.map(
                    ({ itemName, quantity, nettoItem, vatItem, bruttoItem }) => ({
                        itemName,
                        quantity,
                        nettoItem,
                        vatItem,
                        bruttoItem,
                    })
                );
                await sendCreditNote({
                    ...creditNoteData,
                    items: itemsToSend,
                });
                if (invoice) {

                    await fetch('/api/updateInvoiceStatus', {

                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ invoiceName: invoice.nameInvoice }),
                    });
                }
                await fetchInvoices();
                await fetchCreditNotes();

                setIsModalOpen(false);
                setShowConfirmation(true);
            }
        } catch (error) {

            console.error('Error creating credit note:', error);
            alert('An error occurred while uploading the corrected invoice.');
        }
    };

    const handleBackToInvoiceList = () => {

        window.location.href = '/invoiceList';
    };

    if (!invoice) return <p>The invoice was not found.</p>;

    const handleGeneratePDF = async () => {

        try {

            if (!invoice) {

                throw new Error("No invoice (invoice) details.");
            }

            const payload = {

                invoiceName: invoice.nameInvoice,
                documentStatus: invoice.documentStatus,
                customerName: invoice.customerName,
                seller: invoice.seller,
                paymentMethod: invoice.paymentMethod,
                effectiveMonth: invoice.effectiveMonth,
                currency: invoice.currency,
                dataInvoice: invoice.dataInvoice,
                dataInvoiceSell: invoice.dataInvoiceSell,
                dueDate: invoice.dueDate,
                comments: invoice.comments,
                summaryNetto: invoice.summaryNetto,
                summaryVat: invoice.summaryVat,
                summaryBrutto: invoice.summaryBrutto,
                items: invoice.items.map(item => ({
                    id: item.id,
                    itemName: item.nameItem,
                    quantity: Math.round(item.quantity),
                    nettoItem: item.nettoItem,
                    vatItem: Math.round(item.vatItem),
                    bruttoItem: item.bruttoItem,
                })),
            };

            const response = await fetch("/api/invoicePDF", {

                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {

                throw new Error("There was a problem with PDF generation.");
            }

            const blob = await response.blob();
            const pdfURL = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = pdfURL;
            link.download = `FV-${invoice.nameInvoice}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(pdfURL);

        } catch (error) {

            console.error(error);
            alert("There was a problem with PDF generation.");
        }
    };

    return (
        <>
            {showConfirmation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl mb-4 font-semibold text-center">Data has been sent</h2>
                        <p className="mb-4 text-center">Your corrected invoice is in the Corrected Invoices tab and awaits administrator approval</p>
                        <div className="flex justify-center">
                            <button
                                onClick={handleBackToInvoiceList}
                                className="bg-purple-800 text-white py-2 px-6 rounded-lg shadow-md hover:bg-purple-900">
                                Back to Invoice List
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {
                showComment && (
                    <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-md mb-4">
                        <h2 className="text-lg font-semibold">Administrator Comment:</h2>
                        <p>{"Please correct the invoice - empty fields - test"}</p>
                    </div>
                )
            }

            <div className="flex flex-col lg:flex-row gap-6 py-10 px-4">

                <div className="flex flex-col items-start">
                    {invoice.documentStatus === 'Requires Correction' && (
                        <>
                            <button
                                className="mb-4 bg-purple-800 text-white py-2 px-6 rounded-lg shadow-md hover:bg-purple-900 w-48"
                                onClick={() => setShowComment(!showComment)}>
                                Show Comment
                            </button>
                            <button
                                onClick={createCreditNote}
                                className="mb-4 bg-purple-800 text-white py-2 px-6 rounded-lg shadow-md hover:bg-purple-900 w-48">
                                Correct Invoice
                            </button>
                        </>
                    )}
                    <button
                        onClick={handleGeneratePDF}
                        className="bg-purple-800 text-white py-2 px-6 rounded-lg shadow-md hover:bg-purple-900 w-48">
                        Generate Invoice PDF
                    </button>
                </div>

                <div className="w-full max-w-7xl bg-white p-8 shadow-lg rounded-lg border border-gray-200">

                    <header className="border-b border-gray-300 pb-4 mb-4 flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-purple-700">
                            Invoice: {invoice.nameInvoice}
                        </h1>
                        <p className="text-lg text-gray-700">
                            Status: {" "}
                            <span
                                className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${invoice.documentStatus === 'Paid - Final Invoice'
                                    ? 'bg-green-200 text-green-800'
                                    : invoice.documentStatus === 'Requires Correction'
                                        ? 'bg-red-200 text-red-800'
                                        : invoice.documentStatus === 'Under Review'
                                            ? 'bg-yellow-200 text-yellow-800'
                                            : 'bg-orange-100 text-orange-600'
                                    }`}>
                                {invoice.documentStatus}
                            </span>
                        </p>
                    </header>

                    <section className="mb-6 text-gray-900">
                        <h2 className="text-lg font-semibold mb-2 text-purple-700">Client Details</h2>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p><strong>Client:</strong> {invoice.customerName}</p>
                                <p><strong>Payment Method:</strong> {invoice.paymentMethod}</p>
                                <p><strong>Currency:</strong> {invoice.currency}</p>
                            </div>
                            <div className="pl-6">
                                <p><strong>Seller:</strong> {invoice.seller}</p>
                                <p><strong>Effective Month:</strong> {invoice.effectiveMonth}</p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-6 text-gray-900">
                        <h2 className="text-lg font-semibold mb-2 text-purple-700">Invoice Details</h2>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p><strong>Issue Date:</strong> {new Date(invoice.dataInvoice).toLocaleDateString()}</p>
                                <p><strong>Payment Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                            </div>
                            <div className="pl-6">
                                <p><strong>Sale Date:</strong> {new Date(invoice.dataInvoiceSell).toLocaleDateString()}</p>
                                <p><strong>Comment:</strong> {invoice.comments || "None"}</p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-6 text-gray-900">
                        <h2 className="text-lg font-semibold mb-2 text-purple-700">Invoice Items</h2>
                        <table className="w-full text-left border-collapse bg-white">
                            <thead>
                                <tr className="bg-purple-800 text-white">
                                    <th className="px-4 py-2 border border-gray-200">Name</th>
                                    <th className="px-4 py-2 border border-gray-200 text-right">Quantity</th>
                                    <th className="px-4 py-2 border border-gray-200 text-right">Net</th>
                                    <th className="px-4 py-2 border border-gray-200 text-right">VAT</th>
                                    <th className="px-4 py-2 border border-gray-200 text-right">Gross</th>
                                    <th className="px-4 py-2 border border-gray-200">Comment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map((item) => (
                                    <tr key={item.id} className="hover:bg-purple-100 transition duration-200 ease-in-out">
                                        <td className="px-4 py-2 border border-gray-200">{item.nameItem}</td>
                                        <td className="px-4 py-2 border border-gray-200 text-right">{Math.round(item.quantity)}</td>
                                        <td className="px-4 py-2 border border-gray-200 text-right">{item.nettoItem} {invoice.currency}</td>
                                        <td className="px-4 py-2 border border-gray-200 text-right">{Math.round(item.vatItem)}%</td>
                                        <td className="px-4 py-2 border border-gray-200 text-right">{item.bruttoItem} {invoice.currency}</td>
                                        <td className="px-4 py-2 border border-gray-200">{item.comment || "None"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                    <section className="mt-6 text-right border-t border-gray-300 pt-4 text-gray-900">
                        <p className="text-lg"><strong>Total Net:</strong> {invoice.summaryNetto} {invoice.currency}</p>
                        <p className="text-lg"><strong>Total VAT:</strong> {invoice.summaryVat} {invoice.currency}</p>
                        <p className="text-lg font-bold text-purple-700"><strong>Total Gross:</strong> {invoice.summaryBrutto} {invoice.currency}</p>
                    </section>
                </div>
            </div>

            {
                isModalOpen && (
                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                        <div className="bg-white rounded-lg p-6 max-h-[80vh] overflow-y-auto">
                            <h2 className="text-2xl mb-6 font-semibold text-center">Correct Invoice</h2>
                            <div className="grid grid-cols-3 gap-4 w-full">
                                <div>
                                    <label className="block text-gray-700">Invoice Name</label>
                                    <input
                                        type="text"
                                        name="invoiceName"
                                        value={creditNoteData?.invoiceName || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                                        readOnly />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Payment Terms</label>
                                    <input
                                        type="text"
                                        name="paymentTerm"
                                        value={creditNoteData?.paymentTerm || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                                        readOnly />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Comments</label>
                                    <input
                                        type="text"
                                        name="comments"
                                        value={creditNoteData?.comments || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full" />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Seller</label>
                                    <input
                                        type="text"
                                        name="seller"
                                        value={creditNoteData?.seller || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full" />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Client Name</label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        value={creditNoteData?.customerName || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full" />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Description</label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={creditNoteData?.description || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full" />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Exchange Rate</label>
                                    <input
                                        type="number"
                                        name="exchangeRate"
                                        value={creditNoteData?.exchangeRate || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                                        readOnly />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Effective Month</label>
                                    <input
                                        type="text"
                                        name="effectiveMonth"
                                        value={creditNoteData?.effectiveMonth || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full" />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Currency</label>
                                    <input
                                        type="text"
                                        name="currency"
                                        value={creditNoteData?.currency || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-semibold text-center">Invoice Items</h2>
                            <div className="relative w-full ustify-end">
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => {
                                            const newItem = { itemName: '', quantity: 0, nettoItem: 0, vatItem: 0, bruttoItem: 0 };
                                            setCreditNoteItems([...creditNoteItems, newItem]);
                                            calculateTotals([...creditNoteItems, newItem]);
                                        }}
                                        className="bg-purple-600 text-white py-1 px-3 rounded hover:bg-green-700">
                                        Add Item
                                    </button>
                                </div>
                                <table className="w-full text-left border-collapse bg-white mt-4">
                                    <thead>
                                        <tr className="bg-purple-800 text-white">
                                            <th className="px-4 py-2 border border-gray-200">Name</th>
                                            <th className="px-4 py-2 border border-gray-200 text-right">Quantity</th>
                                            <th className="px-4 py-2 border border-gray-200 text-right">Net</th>
                                            <th className="px-4 py-2 border border-gray-200 text-right">VAT (%)</th>
                                            <th className="px-4 py-2 border border-gray-200 text-right">Gross</th>
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
                            </div>

                            <div className="grid grid-cols-3 gap-4 w-full mt-6">
                                <div>
                                    <label className="block text-gray-700">Total Net</label>
                                    <input
                                        type="number"
                                        name="summaryNetto"
                                        value={creditNoteData?.summaryNetto || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                                        readOnly />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Total VAT</label>
                                    <input
                                        type="number"
                                        name="summaryVat"
                                        value={creditNoteData?.summaryVat || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                                        readOnly />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Total Gross</label>
                                    <input
                                        type="number"
                                        name="summaryBrutto"
                                        value={creditNoteData?.summaryBrutto || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                                        readOnly />
                                </div>
                            </div>

                            <div className="flex justify-center mt-6">
                                <button onClick={submitCorrection} className="bg-purple-800 text-white py-2 px-6 rounded hover:bg-purple-900">
                                    Submit Invoice
                                </button>
                            </div>
                        </div>
                    </Modal>
                )
            }
        </>
    );
};
export default InvoiceDetailManager;
