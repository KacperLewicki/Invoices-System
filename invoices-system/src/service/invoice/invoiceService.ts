import moment from 'moment';
import { InvoiceData, ItemData } from '../../types/typesInvoice';

/**
 * @function saveInvoiceToDatabase
 * @description Zapisuje fakturę oraz jej pozycje do bazy danych.
 * @param {InvoiceData} invoiceData - Dane faktury.
 * @param {ItemData[]} itemsData - Lista pozycji faktury.
 * @returns {Promise<string>} - Zwraca nazwę zapisanej faktury.
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
      console.error('Błąd odpowiedzi API:', errorText);
      throw new Error('Nie udało się zapisać faktury');
    }

    const responseData = await response.json();
    return responseData.nameInvoice;

  } catch (error: any) {

    console.error('Wystąpił błąd podczas zapisywania faktury:', error.message);
    throw new Error('Nie udało się zapisać faktury');
  }
};

/**
 * @function formatInvoiceDates
 * @description Formatuje daty faktury do formatu zgodnego z bazą danych.
 * @param {InvoiceData} invoiceData - Dane faktury z datami do sformatowania.
 * @returns {InvoiceData} - Faktura z sformatowanymi datami.
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
