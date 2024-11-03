"use client";

import React, { useState } from 'react';
import {
  InvoiceData,
  ItemData,
  checkInvoiceExists,
  saveInvoiceToDatabase,
  formatInvoiceDates
} from '../../../service/invoice/invoiceService';
import "./invoice.css";

const Invoice: React.FC = () => {

  const [formData, setFormData] = useState<InvoiceData>({

    nameInvoice: '',
    dataInvoice: '',
    dataInvoiceSell: '',
    DueDate: '',
    PaymentTerm: '',
    comments: '',
    seller: '',
    description: '',
    summaryNetto: 0,
    summaryVat: 0,
    summaryBrutto: 0,
    ExchangeRate: 0,
    paymentMethod: 'Bank Transfer',
    efectiveMonth: '',
    documentStatus: '',
    currency: 'PLN',
    status: '',
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

    if (formData.nameInvoice) {

      const invoiceExists = await checkInvoiceExists(formData.nameInvoice);
      if (invoiceExists) {

        alert('Faktura z tym numerem już istnieje w bazie danych');
        return;
      }
    }

    const formattedData = formatInvoiceDates(formData);

    try {

      const generatedInvoiceName = await saveInvoiceToDatabase(formattedData, items);

      setFormData({ ...formData, nameInvoice: generatedInvoiceName });

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
      DueDate: '',
      PaymentTerm: '',
      comments: '',
      seller: '',
      description: '',
      summaryNetto: 0,
      summaryVat: 0,
      summaryBrutto: 0,
      ExchangeRate: 0,
      paymentMethod: '',
      efectiveMonth: '',
      documentStatus: '',
      currency: '',
      status: '',
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

  return (
    <>
      <h1 className='h1_invoice_title'>Faktura NestBank</h1>

      <form className='invoices_forms' onSubmit={handleSubmit}>

        <button type='button' onClick={handleNewForm} className='addNewFormButton'>Nowy Formularz</button>
        <h2 className='h2_invoice_section_title'>Informacje podstawowe</h2>
        <input className='inputValue_invoices' title='Numer faktury zostanie wygenerowany dopiero wtedy gdy wyślemy fakture' name='nameInvoice' type='text' disabled placeholder='Wygenerowany numer faktury' value={formData.nameInvoice} onChange={handleChange} />
        <input className='inputValue_invoices' title='Data wydania' name='dataInvoice' type="date" required placeholder='Data wydania' value={formData.dataInvoice} onChange={handleChange} />
        <input className='inputValue_invoices' title='Data wystawienia faktury' name='dataInvoiceSell' type='date' placeholder='Data wystawienia faktury' required value={formData.dataInvoiceSell} onChange={handleChange} />
        <input className='inputValue_invoices' title='Sprzedawca' name='seller' type="text" placeholder='Sprzedawca' value={formData.seller} onChange={handleChange} />
        <input className='inputValue_invoices' title='Klient' name='customerName' type='text' placeholder='Klient' value={formData.customerName} onChange={handleChange} />
        <textarea className='inputValue_invoices' title='Opis' name='description' placeholder='Opis' value={formData.description} onChange={handleChange} />
        <label>
          <select className='inputValue_invoices' title='Obowiązujący miesiąc' name="efectiveMonth" value={formData.efectiveMonth} onChange={handleChange}>
            <option hidden>Obowiązujący miesiąc</option>
            <option>Styczeń</option>
            <option>Luty</option>
            <option>Marzec</option>
            <option>Kwiecień</option>
            <option>Maj</option>
            <option>Czerwiec</option>
            <option>Lipiec</option>
            <option>Sierpień</option>
            <option>Wrześień</option>
            <option>Październik</option>
            <option>Listopad</option>
            <option>Grudzień</option>
          </select>
        </label>

        <h2 className='h2_invoice_section_title'>Dodaj przedmiot do faktury</h2>

        <input name="nameItem" title='Nazwa Przedmiotu' className='inputValue_invoices' type='text' placeholder='Nazwa Przedmiotu' value={currentItem.nameItem} onChange={handleItemChange} />
        <input name="quantity" title='Ilość' className='inputValue_invoices' type="number" placeholder='Ilość' value={currentItem.quantity} onChange={handleItemChange}  />
        <input name="vatItem" title='VAT' className='inputValue_invoices' type="number" placeholder='VAT' value={currentItem.vatItem} onChange={handleItemChange} />
        <input name="nettoItem" title='Wartość Netto' className='inputValue_invoices' type="number" placeholder='Netto' value={currentItem.nettoItem} onChange={handleItemChange} />
        <input name="bruttoItem" title='Wartość Brutto' className='inputValue_invoices' type="number" readOnly placeholder='Brutto' value={currentItem.bruttoItem} onChange={handleItemChange} />
        <input name="comment" title='Komentarz do przedmiotu' className='inputValue_invoices' type='text' placeholder='Komentarz' value={currentItem.comment} onChange={handleItemChange} />
        
        {formData.nameInvoice ? null : (
          <button className='invoiceTableItemsButton' type='button' onClick={addItem}>Dodaj Przedmiot</button>)}

        <h2 className='h2_invoice_section_title'>Przedmioty dodane do faktury</h2>
        
        <table className='invoiceTableItems'>
          <thead>
            <tr>
              <th>Nazwa</th>
              <th>Ilość</th>
              <th>Vat</th>
              <th>Netto</th>
              <th>Brutto</th>
              <th>Komentarz</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.nameItem}</td>
                <td>{item.quantity}</td>
                <td>{item.vatItem}</td>
                <td>{item.nettoItem}</td>
                <td>{item.bruttoItem}</td>
                <td>{item.comment}</td>
                <div className="delete-button-container">
                  <button type="button" className="delete-button" onClick={() => deleteItem(index)}>Delete</button>
                </div>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className='h2_invoice_section_title'>Suma</h2>

        <input className='inputValue_invoices' title='Suma Netto' type='Number' name='summaryNetto' placeholder='Netto' disabled value={formData.summaryNetto} onChange={handleChange} />
        <input className='inputValue_invoices' title='Suma Vat' type='Number' name='summaryVat' placeholder='Vat' disabled value={formData.summaryVat} onChange={handleChange} />
        <input className='inputValue_invoices' title='Suma Brutto' type='Number' name='summaryBrutto' placeholder='Total' disabled value={formData.summaryBrutto} onChange={handleChange} />
        <label>
          <select className='inputValue_invoices' title='Waluta' name="currency" value={formData.currency} onChange={handleChange}>
            <option hidden>Wybierz Walute</option>
            <option>PLN</option>
            <option>EUR</option>
            <option>USD</option>
          </select>
        </label>

        <h2 className='h2_invoice_section_title'>Szczegóły</h2>

        <input className='inputValue_invoices' title='Termin wykonania' name='DueDate' type='date' placeholder='Termin wykonania' required value={formData.DueDate} onChange={handleChange} />
        <input className='inputValue_invoices' title='Metoda płatności' name='paymentMethod' placeholder='Metoda płatności' value={formData.paymentMethod} onChange={handleChange} />
        <input className='inputValue_invoices' title='Kurs' type='Number' name='ExchangeRate' placeholder='Kurs' value={formData.ExchangeRate} onChange={handleChange} />
        
        <select className='inputValue_invoices' title='Status dokumentu' name="documentStatus" value={formData.documentStatus} onChange={handleChange}>
          <option hidden>Status dokumentu</option>
          <option>Wydany</option>
          <option>Opłacony</option>
          <option>Częściowo opłacony</option>
          <option>Ustalony</option>
          <option>Poprawiony</option>
        </select>
        <input className='inputValue_invoices' title='Termin płatności' name='PaymentTerm' type='date' placeholder='Termin płatności' required value={formData.PaymentTerm} onChange={handleChange} />
        <textarea className='inputValue_invoices' title='Uwagi' name='comments' placeholder='Uwagi' value={formData.comments} onChange={handleChange} />
        <button className='invoiceCreateButton' type='submit'> Wyślij Fakture do weryfikacji </button>
      </form>
    </>
  );
};

export default Invoice;
