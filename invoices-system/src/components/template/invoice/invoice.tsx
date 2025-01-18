"use client";

import React, { useState } from 'react';
import { saveInvoiceToDatabase, formatInvoiceDates } from '../../../service/invoice/invoiceService';
import { InvoiceData, ItemData } from '../../../types/typesInvoice';
import { useInvoice } from '../../../hooks/context/invoiceContext';

import "../../../globalCSS/globals.css";

const Invoice: React.FC = () => {

  const { fetchInvoices, fetchCreditNotes } = useInvoice();

  const [formData, setFormData] = useState<InvoiceData>({

    nameInvoice: '',
    dataInvoice: '',
    dataInvoiceSell: '',
    dueDate: '',
    paymentTerm: '',
    comments: '',
    seller: '',
    description: '',
    summaryNetto: 0,
    summaryVat: 0,
    summaryBrutto: 0,
    exchangeRate: 1,
    paymentMethod: 'Bank Transfer',
    effectiveMonth: '',
    documentStatus: 'W trakcie akceptacji',
    currency: 'PLN',
    identyfikator: '',
    customerName: ''
  });

  const [items, setItems] = useState<ItemData[]>([]);
  const [currentItem, setCurrentItem] = useState<ItemData>({

    nameItem: '',
    quantity: 0,
    vatItem: 0,
    nettoItem: 0,
    bruttoItem: 0,
    comment: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {

    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {

    const { name, value } = e.target;
    setCurrentItem({
      ...currentItem,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    const formattedData = formatInvoiceDates(formData);

    try {

      const generatedInvoiceName = await saveInvoiceToDatabase(formattedData, items);

      setFormData({ ...formData, nameInvoice: generatedInvoiceName });

      await fetchInvoices();
      await fetchCreditNotes();

      alert(`Faktura ${generatedInvoiceName} została zapisana pomyślnie`);

    } catch (error) {

      console.error('Error:', error);
      alert('Wystąpił błąd podczas zapisywania faktury');
    }
  };

  const handleNewForm = () => {

    setFormData({
      nameInvoice: '',
      dataInvoice: '',
      dataInvoiceSell: '',
      dueDate: '',
      paymentTerm: '',
      comments: '',
      seller: '',
      description: '',
      summaryNetto: 0,
      summaryVat: 0,
      summaryBrutto: 0,
      exchangeRate: 1,
      paymentMethod: '',
      effectiveMonth: '',
      documentStatus: '',
      currency: '',
      identyfikator: '',
      customerName: ''
    });

    setItems([]);

    alert('Stworzono nowy formularz');

  };

  const addItem = () => {

    const { nameItem, quantity, vatItem, nettoItem } = currentItem;

    if (!nameItem || !quantity || !vatItem || !nettoItem) {

      alert('Aby móc dodać przedmiot, należy wypełnić nastepuące pola: Nazwa przedmiotu, Ilość, VAT, Netto');

      return;
    }

    const netto = parseFloat(nettoItem.toString());
    const vat = parseFloat(vatItem.toString());
    const quantityValue = parseFloat(quantity.toString());
    const brutto = netto + (netto * vat / 100);

    const newItem = {
      ...currentItem,
      nettoItem: netto * quantityValue,
      bruttoItem: brutto * quantityValue,
    };

    setItems([...items, newItem]);
    setCurrentItem({
      nameItem: '',
      quantity: 0,
      vatItem: 0,
      nettoItem: 0,
      bruttoItem: 0,
      comment: ''
    });

    const newSummaryNetto = formData.summaryNetto + newItem.nettoItem;
    const newSummaryVat = formData.summaryVat + (newItem.nettoItem * newItem.vatItem / 100);
    const newSummaryBrutto = formData.summaryBrutto + newItem.bruttoItem;

    setFormData({
      ...formData,
      summaryNetto: newSummaryNetto,
      summaryVat: newSummaryVat,
      summaryBrutto: newSummaryBrutto
    });
  };

  const deleteItem = (index: number) => {

    const itemToDelete = items[index];
    const newItems = items.filter((_, i) => i !== index);

    const newSummaryNetto = formData.summaryNetto - itemToDelete.nettoItem;
    const newSummaryVat = formData.summaryVat - (itemToDelete.nettoItem * itemToDelete.vatItem / 100);
    const newSummaryBrutto = formData.summaryBrutto - itemToDelete.bruttoItem;

    setItems(newItems);
    setFormData({
      ...formData,
      summaryNetto: newSummaryNetto,
      summaryVat: newSummaryVat,
      summaryBrutto: newSummaryBrutto
    });
  };

  const isFormDisabled = !!formData.nameInvoice;

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-6">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-7xl border border-gray-200 transform transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-3xl font-bold text-purple-700 text-center mb-6">Faktura KL</h1>

        <form onSubmit={handleSubmit} className="grid gap-6 grid-cols-1 md:grid-cols-3">

          <div className="md:col-span-1 mb-4">
            <button
              type="button"
              onClick={handleNewForm}
              className="bg-purple-600 text-white rounded-lg py-2 px-4 hover:bg-purple-700 transition duration-300 ease-in-out transform hover:shadow-md">
              New Form
            </button>
          </div>

          <div className="col-span-full p-4 rounded-lg border border-gray-300 transition transform duration-300 hover:shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 hover:text-purple-700 transition duration-300">
              Basic Information
            </h2>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mt-4">
              <input
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="nameInvoice"
                type="text"
                disabled
                placeholder="Generated Invoice Number"
                title='Wygenerowany numer faktury'
                value={formData.nameInvoice}
                onChange={handleChange} />
              <input
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="dataInvoice"
                type="date"
                required
                placeholder="Issue Date"
                title='Data wydania'
                value={formData.dataInvoice}
                onChange={handleChange}
                disabled={isFormDisabled} />
              <input
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="dataInvoiceSell"
                type="date"
                placeholder="Invoice Issuance Date"
                title='Data wystawienia faktury'
                required
                value={formData.dataInvoiceSell}
                onChange={handleChange}
                disabled={isFormDisabled} />
              <input
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="seller"
                type="text"
                placeholder="Seller"
                title='Sprzedawca'
                value={formData.seller}
                onChange={handleChange}
                disabled={isFormDisabled} />
              <input
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="customerName"
                type="text"
                title='Klient'
                placeholder="Client"
                value={formData.customerName}
                onChange={handleChange}
                disabled={isFormDisabled} />
              <textarea
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="description"
                placeholder="Description"
                title='Opis'
                value={formData.description}
                onChange={handleChange}
                disabled={isFormDisabled}>
              </textarea>
              <select
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="effectiveMonth"
                title='Obowiązujący miesiąc'
                value={formData.effectiveMonth}
                onChange={handleChange}
                disabled={isFormDisabled}>
                <option hidden>Effective Month</option>
                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option>April</option>
                <option>May</option>
                <option>June</option>
                <option>July</option>
                <option>August</option>
                <option>September</option>
                <option>October</option>
                <option>November</option>
                <option>December</option>
              </select>
            </div>
          </div>

          {!formData.nameInvoice && (
            <div className="col-span-full p-4 rounded-lg border border-gray-300 transition transform duration-300 hover:shadow-lg">
              <h2 className="text-xl font-semibold text-gray-700 hover:text-purple-700 transition duration-300">
                Add Item to Invoice
              </h2>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mt-4">
                <input
                  className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  name="nameItem"
                  type="text"
                  placeholder="Item Name"
                  title='Nazwa Przedmiotu'
                  value={currentItem.nameItem}
                  onChange={handleItemChange} />
                <input
                  className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  name="quantity"
                  type="number"
                  placeholder="Quantity"
                  title='Ilość'
                  value={currentItem.quantity}
                  onChange={handleItemChange} />
                <input
                  className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  name="vatItem"
                  type="number"
                  placeholder="VAT"
                  title='VAT'
                  value={currentItem.vatItem}
                  onChange={handleItemChange} />
                <input
                  className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  name="nettoItem"
                  type="number"
                  placeholder="Net"
                  title='Netto'
                  value={currentItem.nettoItem}
                  onChange={handleItemChange} />
                <input
                  className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  name="comment"
                  type="text"
                  placeholder="Comment"
                  title='Komentarz'
                  value={currentItem.comment}
                  onChange={handleItemChange} />
              </div>

              <div className="flex justify-center mt-4">
                <button
                  type="button"
                  onClick={addItem}
                  className="bg-purple-600 text-white rounded-lg py-2 px-6 hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105">
                  Add Item
                </button>
              </div>
            </div>
          )}

          <div className="col-span-full p-4 rounded-lg border border-gray-300 transition transform duration-300 hover:shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 hover:text-purple-700 transition duration-300">
              Items Added to Invoice
            </h2>

            <table className="w-full border border-gray-300 mt-4 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-purple-800 text-white">
                  <th className="p-2">Name</th>
                  <th>Quantity</th>
                  <th>VAT</th>
                  <th>Net</th>
                  <th>Gross</th>
                  <th>Comment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b last:border-none">
                    <td className="p-2 text-center">{item.nameItem}</td>
                    <td className="p-2 text-center">{Math.round(item.quantity)}</td>
                    <td className="p-2 text-center">{Math.round(item.vatItem)}</td>
                    <td className="p-2 text-center">{item.nettoItem}</td>
                    <td className="p-2 text-center">{item.bruttoItem}</td>
                    <td className="p-2 text-center">{item.comment}</td>
                    <td className="p-2 text-center">
                      <button onClick={() => deleteItem(index)} className="text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="col-span-full p-4 rounded-lg border border-gray-300 transition transform duration-300 hover:shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 hover:text-purple-700 transition duration-300">
              Total
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <input
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="summaryNetto"
                type="number"
                disabled
                placeholder="Net"
                title='Suma Netto'
                value={formData.summaryNetto}
                onChange={handleChange} />
              <input
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="summaryVat"
                type="number"
                disabled
                placeholder="VAT"
                title='Suma VAT'
                value={formData.summaryVat}
                onChange={handleChange} />
              <input
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="summaryBrutto"
                type="number"
                disabled
                placeholder="Gross"
                title='Suma Brutto'
                value={formData.summaryBrutto}
                onChange={handleChange} />
              <select
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                title='Waluta'
                disabled={isFormDisabled}>
                <option hidden>Select Currency</option>
                <option>PLN</option>
                <option>EUR</option>
                <option>USD</option>
              </select>
            </div>
          </div>

          <div className="col-span-full p-4 rounded-lg border border-gray-300 transition transform duration-300 hover:shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 hover:text-purple-700 transition duration-300">
              Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <input
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="dueDate"
                type="date"
                placeholder="Due Date"
                title='Termin wykonania'
                required
                value={formData.dueDate}
                onChange={handleChange}
                disabled={isFormDisabled} />
              <input
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="paymentMethod"
                type="text"
                placeholder="Payment Method"
                title='Metoda płatności'
                value={formData.paymentMethod}
                onChange={handleChange}
                readOnly />
              <input
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="exchangeRate"
                title='Kurs'
                type="number"
                placeholder="Exchange Rate"
                value={formData.exchangeRate}
                onChange={handleChange}
                readOnly />
              <select
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="documentStatus"
                value={formData.documentStatus}
                title='Status dokumentu'
                onChange={handleChange}
                disabled={isFormDisabled}>
                <option hidden>Document Status</option>
                <option>Under Review</option>
                <option>Paid - Final Invoice</option>
                <option>Partially Paid</option>
                <option>Requires Correction</option>
              </select>
              <input
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="paymentTerm"
                type="date"
                placeholder="Payment Due Date"
                title='Termin płatności'
                required
                value={formData.paymentTerm}
                onChange={handleChange}
                disabled={isFormDisabled} />
              <textarea
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="comments"
                title='Uwagi'
                placeholder="Comments"
                value={formData.comments}
                onChange={handleChange}
                disabled={isFormDisabled} />
            </div>
          </div>

          <div className="col-span-full flex justify-center mt-4">
            {!formData.nameInvoice && (
              <button
                type="submit"
                className="bg-purple-600 text-white rounded-lg py-2 px-6 hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105">
                Submit Invoice for Review
              </button>)}
          </div>

        </form>
      </div>
    </div>
  );
};

export default Invoice;
