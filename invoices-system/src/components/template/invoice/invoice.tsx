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
              Nowy Formularz
            </button>
          </div>

          <div className="col-span-full p-4 rounded-lg border border-gray-300 transition transform duration-300 hover:shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 hover:text-purple-700 transition duration-300">
              Informacje podstawowe
            </h2>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mt-4">
              <input
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="nameInvoice"
                type="text"
                disabled
                placeholder="Wygenerowany numer faktury"
                title='Wygenerowany numer faktury'
                value={formData.nameInvoice}
                onChange={handleChange}
              />
              <input
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="dataInvoice"
                type="date"
                required
                placeholder="Data wydania"
                title='Data wydania'
                value={formData.dataInvoice}
                onChange={handleChange}
                disabled={isFormDisabled}
              />
              <input
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="dataInvoiceSell"
                type="date"
                placeholder="Data wystawienia faktury"
                title='Data wystawienia faktury'
                required
                value={formData.dataInvoiceSell}
                onChange={handleChange}
                disabled={isFormDisabled}
              />
              <input
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="seller"
                type="text"
                placeholder="Sprzedawca"
                title='Sprzedawca'
                value={formData.seller}
                onChange={handleChange}
                disabled={isFormDisabled}
              />
              <input
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="customerName"
                type="text"
                title='Klient'
                placeholder="Klient"
                value={formData.customerName}
                onChange={handleChange}
                disabled={isFormDisabled}
              />
              <textarea
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="description"
                placeholder="Opis"
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
                <option hidden>Obowiązujący miesiąc</option>
                <option>Styczeń</option>
                <option>Luty</option>
                <option>Marzec</option>
                <option>Kwiecień</option>
                <option>Maj</option>
                <option>Czerwiec</option>
                <option>Lipiec</option>
                <option>Sierpień</option>
                <option>Wrzesień</option>
                <option>Październik</option>
                <option>Listopad</option>
                <option>Grudzień</option>
              </select>
            </div>
          </div>

          {!formData.nameInvoice && (
            <div className="col-span-full p-4 rounded-lg border border-gray-300 transition transform duration-300 hover:shadow-lg">
              <h2 className="text-xl font-semibold text-gray-700 hover:text-purple-700 transition duration-300">
                Dodaj przedmiot do faktury
              </h2>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mt-4">
                <input
                  className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  name="nameItem"
                  type="text"
                  placeholder="Nazwa Przedmiotu"
                  title='Nazwa Przedmiotu'
                  value={currentItem.nameItem}
                  onChange={handleItemChange}
                />
                <input
                  className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  name="quantity"
                  type="number"
                  placeholder="Ilość"
                  title='Ilość'
                  value={currentItem.quantity}
                  onChange={handleItemChange}
                />
                <input
                  className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  name="vatItem"
                  type="number"
                  placeholder="VAT"
                  title='VAT'
                  value={currentItem.vatItem}
                  onChange={handleItemChange}
                />
                <input
                  className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  name="nettoItem"
                  type="number"
                  placeholder="Netto"
                  title='Netto'
                  value={currentItem.nettoItem}
                  onChange={handleItemChange}
                />
                <input
                  className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  name="comment"
                  type="text"
                  placeholder="Komentarz"
                  title='Komentarz'
                  value={currentItem.comment}
                  onChange={handleItemChange}
                />
              </div>

              <div className="flex justify-center mt-4">
                <button
                  type="button"
                  onClick={addItem}
                  className="bg-purple-600 text-white rounded-lg py-2 px-6 hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105">
                  Dodaj Przedmiot
                </button>
              </div>
            </div>
          )}

          <div className="col-span-full p-4 rounded-lg border border-gray-300 transition transform duration-300 hover:shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 hover:text-purple-700 transition duration-300">
              Przedmioty dodane do faktury
            </h2>

            <table className="w-full border border-gray-300 mt-4 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-purple-800 text-white">
                  <th className="p-2">Nazwa</th>
                  <th>Ilość</th>
                  <th>Vat</th>
                  <th>Netto</th>
                  <th>Brutto</th>
                  <th>Komentarz</th>
                  <th>Akcje</th>
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
                      <button onClick={() => deleteItem(index)} className="text-red-500 hover:underline">Usuń</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="col-span-full p-4 rounded-lg border border-gray-300 transition transform duration-300 hover:shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 hover:text-purple-700 transition duration-300">
              Suma
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <input
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="summaryNetto"
                type="number"
                disabled
                placeholder="Netto"
                title='Suma Netto'
                value={formData.summaryNetto}
                onChange={handleChange}
              />
              <input
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="summaryVat"
                type="number"
                disabled
                placeholder="VAT"
                title='Suma VAT'
                value={formData.summaryVat}
                onChange={handleChange}
              />
              <input
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="summaryBrutto"
                type="number"
                disabled
                placeholder="Brutto"
                title='Suma Brutto'
                value={formData.summaryBrutto}
                onChange={handleChange}
              />
              <select
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                title='Waluta'
                disabled={isFormDisabled}>
                <option hidden>Wybierz Walutę</option>
                <option>PLN</option>
                <option>EUR</option>
                <option>USD</option>
              </select>
            </div>
          </div>

          <div className="col-span-full p-4 rounded-lg border border-gray-300 transition transform duration-300 hover:shadow-lg">
            <h2 className="text-xl font-semibold text-gray-700 hover:text-purple-700 transition duration-300">
              Szczegóły
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <input
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="dueDate"
                type="date"
                placeholder="Termin wykonania"
                title='Termin wykonania'
                required
                value={formData.dueDate}
                onChange={handleChange}
                disabled={isFormDisabled}
              />
              <input
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="paymentMethod"
                type="text"
                placeholder="Metoda płatności"
                title='Metoda płatności'
                value={formData.paymentMethod}
                onChange={handleChange}
                readOnly
              />
              <input
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="exchangeRate"
                title='Kurs'
                type="number"
                placeholder="Kurs"
                value={formData.exchangeRate}
                onChange={handleChange}
                readOnly
              />
              <select
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="documentStatus"
                value={formData.documentStatus}
                title='Status dokumentu'
                onChange={handleChange}
                disabled={isFormDisabled}>
                <option hidden>Status dokumentu</option>
                <option>W trakcie akceptacji</option>
                <option>Opłacona - Gotowa faktura</option>
                <option>Częściowo opłacone</option>
                <option>Do poprawy</option>
              </select>
              <input
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="paymentTerm"
                type="date"
                placeholder="Termin płatności"
                title='Termin płatności'
                required
                value={formData.paymentTerm}
                onChange={handleChange}
                disabled={isFormDisabled}
              />
              <textarea
                className="border border-purple-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                name="comments"
                title='Uwagi'
                placeholder="Uwagi"
                value={formData.comments}
                onChange={handleChange}
                disabled={isFormDisabled}
              />
            </div>
          </div>

          <div className="col-span-full flex justify-center mt-4">
            {!formData.nameInvoice && (
              <button
                type="submit"
                className="bg-purple-600 text-white rounded-lg py-2 px-6 hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105">
                Wyślij Fakturę do weryfikacji
              </button>)}
          </div>

        </form>
      </div>
    </div>
  );
};

export default Invoice;
