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
    paymentMethod: '',
    efectiveMonth: '',
    documentStatus: '',
    currency: '',
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

      const generatedInvoiceNumber = await saveInvoiceToDatabase(formattedData, items);

      setFormData({ ...formData, nameInvoice: generatedInvoiceNumber });

      alert(`Faktura ${generatedInvoiceNumber} została zapisana pomyślnie`);

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

      alert('Please fill in the required fields: Name, Quantity, VAT, and Netto.');

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

        <input className='inputValue_invoices' title='Name Invoice' name='nameInvoice' type='text' disabled placeholder='The fax number will be shown after sending' value={formData.nameInvoice} onChange={handleChange} />
        <input className='inputValue_invoices' title='Data Invoice' name='dataInvoice' type="date" required placeholder='Issue date' value={formData.dataInvoice} onChange={handleChange} />
        <input className='inputValue_invoices' title='Data Invocie Sell' name='dataInvoiceSell' type='date' placeholder='Sell-by date' required value={formData.dataInvoiceSell} onChange={handleChange} />
        <input className='inputValue_invoices' title='Seller' name='seller' type="text" placeholder='Seller' value={formData.seller} onChange={handleChange} />
        <input className='inputValue_invoices' title='Customer' name='customerName' type='text' placeholder='Customer' value={formData.customerName} onChange={handleChange} />
        <textarea className='inputValue_invoices' title='Description' name='description' placeholder='description' value={formData.description} onChange={handleChange} />
        <label>
          <select className='inputValue_invoices' title='Efective Month' name="efectiveMonth" value={formData.efectiveMonth} onChange={handleChange}>
            <option hidden>Efective month</option>
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
        </label>

        <h2 className='h2_invoice_section_title'>Create Items</h2>

        <input name="nameItem" className='inputValue_invoices' type='text' placeholder='Item name' value={currentItem.nameItem} onChange={handleItemChange} />
        <input name="quantity" className='inputValue_invoices' type="number" placeholder='Quantity' value={currentItem.quantity} onChange={handleItemChange} />
        <input name="vatItem" className='inputValue_invoices' type="number" placeholder='VAT' value={currentItem.vatItem} onChange={handleItemChange} />
        <input name="nettoItem" className='inputValue_invoices' type="number" placeholder='Netto' value={currentItem.nettoItem} onChange={handleItemChange} />
        <input name="bruttoItem" className='inputValue_invoices' type="number" readOnly placeholder='Brutto' value={currentItem.bruttoItem} onChange={handleItemChange} />
        <input name="comment" className='inputValue_invoices' type='text' placeholder='comment' value={currentItem.comment} onChange={handleItemChange} />
        <button className='invoiceTableItemsButton' type='button' onClick={addItem}>Add Item</button>
        <h2 className='h2_invoice_section_title'>Items</h2>
        <table className='invoiceTableItems'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Vat</th>
              <th>Netto</th>
              <th>Brutto</th>
              <th>Comment</th>
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

        <h2 className='h2_invoice_section_title'>Summary</h2>

        <input className='inputValue_invoices' title='Summary Netto' type='Number' name='summaryNetto' placeholder='Netto' disabled value={formData.summaryNetto} onChange={handleChange} />
        <input className='inputValue_invoices' title='Summary Vat' type='Number' name='summaryVat' placeholder='Vat' disabled value={formData.summaryVat} onChange={handleChange} />
        <input className='inputValue_invoices' title='Summary Brutto' type='Number' name='summaryBrutto' placeholder='Total' disabled value={formData.summaryBrutto} onChange={handleChange} />
        <input className='inputValue_invoices' title='Due Date' name='DueDate' type='date' placeholder='Due Date' required value={formData.DueDate} onChange={handleChange} />
        <input className='inputValue_invoices' title='Payment Method' name='paymentMethod' placeholder='Payment Method' value={formData.paymentMethod} onChange={handleChange} />
        <input className='inputValue_invoices' title='Exchange Rate' type='Number' name='ExchangeRate' placeholder='Exchange rate' value={formData.ExchangeRate} onChange={handleChange} />
        <label>
          <select className='inputValue_invoices' title='Currency' name="currency" value={formData.currency} onChange={handleChange}>
            <option hidden>Select Currency</option>
            <option>PLN</option>
            <option>EUR</option>
            <option>USD</option>
          </select>
        </label>

        <h2 className='h2_invoice_section_title'>Details</h2>

        <select className='inputValue_invoices' title='Document Status' name="documentStatus" value={formData.documentStatus} onChange={handleChange}>
          <option hidden>Document Status</option>
          <option>Issued</option>
          <option>Paid</option>
          <option>Partly Paid</option>
          <option>Settled</option>
          <option>Corrected</option>
        </select>
        <input className='inputValue_invoices' title='Payment  Term' name='PaymentTerm' type='date' placeholder='Payment term' required value={formData.PaymentTerm} onChange={handleChange} />
        <textarea className='inputValue_invoices' title='Comments' name='comments' placeholder='Comments' value={formData.comments} onChange={handleChange} />
        <button className='invoiceCreateButton' type='submit'> Send Invoice </button>
      </form>
    </>
  );
};

export default Invoice;
