import moment from 'moment';
import { InvoiceData, ItemData } from '../../types/typesInvoice';

/**
 * @function saveInvoiceToDatabase
 * @description Saves the invoice and its items to the database.
 * @param {InvoiceData} invoiceData - Invoice data.
 * @param {ItemData[]} itemsData - List of invoice items.
 * @returns {Promise<string>} - Returns the name of the saved invoice.
 */

const saveInvoiceToDatabase = async (invoiceData: InvoiceData, itemsData: ItemData[]): Promise<string> => {

  try {
    const response = await fetch('/api/postInvoiceManual', {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'identyfikator': localStorage.getItem('token') || '',
      },
      body: JSON.stringify({
        invoice: invoiceData,
        items: itemsData,
      }),
    });

    if (!response.ok) {

      const errorText = await response.text();
      console.error('API response error:', errorText);
      throw new Error('Failed to save the invoice');
    }

    const responseData = await response.json();
    return responseData.nameInvoice;

  } catch (error: any) {

    console.error('An error occurred while saving the invoice:', error.message);
    throw new Error('Failed to save the invoice');
  }
};

/**
 * @function formatInvoiceDates
 * @description Formats the invoice dates to a database-compatible format.
 * @param {InvoiceData} invoiceData - Invoice data with dates to format.
 * @returns {InvoiceData} - Invoice with formatted dates.
 */

const formatInvoiceDates = (invoiceData: InvoiceData): InvoiceData => {

  return {
    ...invoiceData,
    dataInvoice: moment(invoiceData.dataInvoice).format('YYYY-MM-DD'),
    dataInvoiceSell: moment(invoiceData.dataInvoiceSell).format('YYYY-MM-DD'),
    dueDate: moment(invoiceData.dueDate).format('YYYY-MM-DD'),
    paymentTerm: moment(invoiceData.paymentTerm).format('YYYY-MM-DD'),
  };
};

export {

  type InvoiceData,
  type ItemData,
  saveInvoiceToDatabase,
  formatInvoiceDates,
};
