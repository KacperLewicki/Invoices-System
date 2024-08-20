"use client";

import React from 'react';
import "./invoice.css";
import invoiceItems from '../invoiceItems/invoiceItems';

const Invoice = (props: any) => {

  return (
    <>
      <h1 className='h1_create_invoices'>Create Invoice manual</h1>

      <form className='invoices_forms'>

        <button type='button' className='addNewFormButton'>New Forms</button>

        <input className='inputValue_invoices' title='Name Invoice' name='nameInvoice' type='text' disabled placeholder='The fax number will be shown after sending' />
        <input className='inputValue_invoices' title='Data Invoice' name='dataInvoice' type="date" required placeholder='Issue date' />
        <input className='inputValue_invoices' title='Data Invocie Sell' name='dataInvoiceSell' type='date' placeholder='Sell-by date' required />
        <input className='inputValue_invoices' title='Seller' name='seller' type="text" placeholder='Seller' />
        <input className='inputValue_invoices' title='Customer' name='customerName' type='text' placeholder='Customer' />

        <textarea className='inputValue_invoices' title='Description' name='description' placeholder='description' />

        <label>
          <select className='inputValue_invoices' title='Efective Month' name="EfectiveMonth">
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

        {invoiceItems()}

        <h2 className='summaryh2'>Summary</h2>

        <input className='inputValue_invoices' title='Summary Netto' type='Number' name='summaryNetto' placeholder='Netto' disabled />
        <input className='inputValue_invoices' title='Summary Vat' type='Number' name='summaryVat' placeholder='Vat' disabled />
        <input className='inputValue_invoices' title='Summary Brutto' type='Number' name='summaryBrutto' placeholder='Total' disabled />
        <input className='inputValue_invoices' title='Due Date' name='DueDate' type='date' placeholder='Due Date' required />
        <input className='inputValue_invoices' title='Payment Method' name='paymentMethod' placeholder='Payment Method' />
        <input className='inputValue_invoices' title='Exchange Rate' type='Number' name='ExchangeRate' placeholder='Exchange rate' />

        <label>
          <select className='inputValue_invoices' title='Currency' name="currency">
            <option hidden>Select Currency</option>
            <option>PLN</option>
            <option>EUR</option>
            <option>USD</option>
          </select>
        </label>

        <h2 className='detailsh2'>Details</h2>

        <select className='inputValue_invoices' title='Document Status' name="documentStatus">
          <option hidden>Document Status</option>
          <option>Issued</option>
          <option>Paid</option>
          <option>Partly Paid</option>
          <option>Settled</option>
          <option>Corrected</option>
        </select>

        <input className='inputValue_invoices' title='Payment  Term' name='PaymentTerm' type='date' placeholder='Payment term' required />

        <textarea className='inputValue_invoices' title='Comments' name='comments' placeholder='Comments' />

        <button className='invoiceCreateButton' type='submit'> Send Invoice </button>

      </form>
    </>

  )

}

export default Invoice;