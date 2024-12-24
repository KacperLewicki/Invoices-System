"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useInvoice } from "../../../hooks/context/invoiceContext";
import Modal from "../../modal/modal_popup";
import { CreditNoteData, CreditNoteItemData } from "../../../types/typesInvoice";
import {
    fetchInvoiceData,
    calculateTotals,
    sendCreditNote,
} from "../../../service/invoiceList/invoiceListService";

const InvoiceDetailManager: React.FC = () => {

    const { selectedInvoice: invoice } = useInvoice();
    const [showComment, setShowComment] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [creditNoteData, setCreditNoteData] = useState<CreditNoteData | null>(
        null
    );

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

        if (name === "nettoItem" || name === "vatItem") {

            const netto = updatedItems[index].nettoItem || 0;
            const vat = updatedItems[index].vatItem || 0;
            updatedItems[index].bruttoItem = netto + (netto * vat) / 100;
        }

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

    const submitCorrection = async () => {

        try {

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

                setIsModalOpen(false);
                setShowConfirmation(true);
            }
        } catch (error) {

            console.error("Error creating credit note:", error);
        }
    };

    if (!invoice) return <p>Faktura nie znaleziona</p>;

    return (
        <>
            {showConfirmation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl mb-4 font-semibold text-center">Dane zostały wysłane</h2>
                        <p className="mb-4 text-center">Twoja poprawiona faktura jest w zakładce 'Poprawione Faktury' i jest w oczekiwaniu na akceptację przez administratora</p>
                        <div className="flex justify-center">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="bg-purple-800 text-white py-2 px-6 rounded-lg shadow-md hover:bg-purple-900"
                            >
                                Powrót do widoku faktury
                            </button>
                        </div>
                    </div>
                </div >
            )}
            {
                showComment && (
                    <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-md mb-4">
                        <h2 className="text-lg font-semibold">Komentarz:</h2>
                        <p>{"Brak"}</p>
                    </div>
                )
            }

            <div className="flex justify-center items-start py-10">
                <div className="flex">
                    <div className="flex flex-col items-center mr-8 h-full">
                        {invoice.documentStatus === 'Do poprawy' && (
                            <>
                                <button className="mb-4 bg-purple-800 text-white py-2 px-6 rounded-lg shadow-md hover:bg-purple-900 w-48" onClick={() => setShowComment(!showComment)}>
                                    Pokaż Komentarz
                                </button>
                                <button onClick={createCreditNote} className="mb-4 bg-purple-800 text-white py-2 px-6 rounded-lg shadow-md hover:bg-purple-900 w-48">
                                    Popraw Fakturę
                                </button>
                            </>
                        )}
                        <button className="bg-purple-800 text-white py-2 px-6 rounded-lg shadow-md hover:bg-purple-900 w-48">
                            Wygeneruj PDF Faktury
                        </button>
                    </div>

                    <div className="w-full max-w-7xl bg-white p-8 shadow-lg rounded-lg border border-gray-200">
                        <header className="border-b border-gray-300 pb-4 mb-4 flex justify-between items-center">
                            <h1 className="text-3xl font-bold text-purple-700">Faktura: {invoice.nameInvoice}</h1>
                            <p className="text-lg text-gray-700">
                                Status: <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${invoice.documentStatus === 'Opłacone'
                                    ? 'bg-green-200 text-green-800' : invoice.documentStatus === 'Do poprawy'
                                        ? 'bg-red-200 text-red-800' : invoice.documentStatus === 'W trakcie akceptacji'
                                            ? 'bg-yellow-200 text-yellow-800' : 'bg-orange-100 text-orange-600'}`}>
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
            </div>
            {
                isModalOpen && (
                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                        <div className="bg-white rounded-lg p-6 max-h-[80vh] overflow-y-auto">
                            <h2 className="text-2xl mb-6 font-semibold text-center">Popraw Fakturę</h2>
                            <div className="grid grid-cols-3 gap-4 w-full">
                                <div>
                                    <label className="block text-gray-700">Nazwa faktury</label>
                                    <input
                                        type="text"
                                        name="invoiceName"
                                        value={creditNoteData?.invoiceName || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Status dokumentu</label>
                                    <input
                                        type="text"
                                        name="documentStatus"
                                        value={creditNoteData?.documentStatus || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Data faktury</label>
                                    <input
                                        type="date"
                                        name="dataInvoice"
                                        value={creditNoteData?.dataInvoice || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Data sprzedaży</label>
                                    <input
                                        type="date"
                                        name="dataInvoiceSell"
                                        value={creditNoteData?.dataInvoiceSell || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Termin płatności</label>
                                    <input
                                        type="date"
                                        name="dueDate"
                                        value={creditNoteData?.dueDate || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Warunki płatności</label>
                                    <input
                                        type="text"
                                        name="paymentTerm"
                                        value={creditNoteData?.paymentTerm || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Komentarze</label>
                                    <input
                                        type="text"
                                        name="comments"
                                        value={creditNoteData?.comments || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Sprzedawca</label>
                                    <input
                                        type="text"
                                        name="seller"
                                        value={creditNoteData?.seller || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Nazwa klienta</label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        value={creditNoteData?.customerName || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Opis</label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={creditNoteData?.description || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Kurs wymiany</label>
                                    <input
                                        type="number"
                                        name="exchangeRate"
                                        value={creditNoteData?.exchangeRate || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Metoda płatności</label>
                                    <input
                                        type="text"
                                        name="paymentMethod"
                                        value={creditNoteData?.paymentMethod || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Miesiąc efektywny</label>
                                    <input
                                        type="text"
                                        name="effectiveMonth"
                                        value={creditNoteData?.effectiveMonth || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Waluta</label>
                                    <input
                                        type="text"
                                        name="currency"
                                        value={creditNoteData?.currency || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                                    />
                                </div>
                            </div>

                            <h2 className="text-2xl font-semibold text-center">Pozycje Faktury</h2>
                            <div className="relative w-full ustify-end">
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => {
                                            const newItem = { itemName: '', quantity: 0, nettoItem: 0, vatItem: 0, bruttoItem: 0 };
                                            setCreditNoteItems([...creditNoteItems, newItem]);
                                            calculateTotals([...creditNoteItems, newItem]);
                                        }}
                                        className="bg-purple-600 text-white py-1 px-3 rounded hover:bg-green-700"
                                    >
                                        Dodaj pozycję
                                    </button>
                                </div>
                                <table className="w-full text-left border-collapse bg-white mt-4">
                                    <thead>
                                        <tr className="bg-purple-800 text-white">
                                            <th className="px-4 py-2 border border-gray-200">Nazwa</th>
                                            <th className="px-4 py-2 border border-gray-200 text-right">Ilość</th>
                                            <th className="px-4 py-2 border border-gray-200 text-right">Netto</th>
                                            <th className="px-4 py-2 border border-gray-200 text-right">VAT (%)</th>
                                            <th className="px-4 py-2 border border-gray-200 text-right">Brutto</th>
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
                                                        placeholder="Nazwa przedmiotu"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 border border-gray-200 text-right">
                                                    <input
                                                        type="number"
                                                        name="quantity"
                                                        value={item.quantity}
                                                        onChange={(e) => handleItemChange(e, index)}
                                                        className="w-full p-2 border border-gray-300 rounded"
                                                        placeholder="Ilość"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 border border-gray-200 text-right">
                                                    <input
                                                        type="number"
                                                        name="nettoItem"
                                                        value={item.nettoItem}
                                                        onChange={(e) => handleItemChange(e, index)}
                                                        className="w-full p-2 border border-gray-300 rounded"
                                                        placeholder="Netto"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 border border-gray-200 text-right">
                                                    <input
                                                        type="number"
                                                        name="vatItem"
                                                        value={item.vatItem}
                                                        onChange={(e) => handleItemChange(e, index)}
                                                        className="w-full p-2 border border-gray-300 rounded"
                                                        placeholder="VAT (%)"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 border border-gray-200 text-right">
                                                    <input
                                                        type="number"
                                                        name="bruttoItem"
                                                        value={item.bruttoItem}
                                                        onChange={(e) => handleItemChange(e, index)}
                                                        className="w-full p-2 border border-gray-300 rounded"
                                                        placeholder="Brutto"
                                                        readOnly
                                                    />
                                                </td>
                                                <td className="px-4 py-2 border border-gray-200 text-right">
                                                    <button
                                                        onClick={() => handleItemDelete(index)}
                                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                                    >
                                                        Usuń
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid grid-cols-3 gap-4 w-full mt-6">
                                <div>
                                    <label className="block text-gray-700">Razem Netto</label>
                                    <input
                                        type="number"
                                        name="summaryNetto"
                                        value={creditNoteData?.summaryNetto || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Razem VAT</label>
                                    <input
                                        type="number"
                                        name="summaryVat"
                                        value={creditNoteData?.summaryVat || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Razem Brutto</label>
                                    <input
                                        type="number"
                                        name="summaryBrutto"
                                        value={creditNoteData?.summaryBrutto || ''}
                                        onChange={handleInputChange}
                                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center mt-6">
                                <button onClick={submitCorrection} className="bg-purple-800 text-white py-2 px-6 rounded hover:bg-purple-900">
                                    Wyślij Fakturę
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
