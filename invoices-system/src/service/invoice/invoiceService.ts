import moment from 'moment';

interface InvoiceData {

  nameInvoice: string;
  dataInvoice: string;
  dataInvoiceSell: string;
  dueDate: string;
  paymentTerm: string;
  comments: string;
  seller: string;
  description: string;
  summaryNetto: number;
  summaryVat: number;
  summaryBrutto: number;
  exchangeRate: number;
  paymentMethod: string;
  effectiveMonth: string;
  documentStatus: string;
  currency: string;
  status: string;
  customerName: string;
}

interface ItemData {

  nameItem: string;
  quantity: number;
  vatItem: number;
  nettoItem: number;
  bruttoItem: number;
  comment: string;
}

const checkInvoiceExists = async (invoiceName: string): Promise<boolean> => {

  const response = await fetch(`/api/checkInvoiceManualName?nameInvoice=${encodeURIComponent(invoiceName)}`);

  if (!response.ok) {

    throw new Error('Nie udało się sprawdzić, czy faktura istnieje');
  }
  
  const data = await response.json();

  if (typeof data.exists !== 'boolean') {

    throw new Error('Nieprawidłowy format odpowiedzi');
  }
  return data.exists;
};

const saveInvoiceToDatabase = async (invoiceData: InvoiceData, itemsData: ItemData[]): Promise<string> => {

  const response = await fetch('/api/saveInvoiceManual', {

    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      invoice: invoiceData,
      items: itemsData,
    }),
  });
  if (!response.ok) {

    await response.text();
    throw new Error('Nie udało się zapisać faktury');
  }

  const responseData = await response.json();
  return responseData.nameInvoice;
};

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
  checkInvoiceExists,
  saveInvoiceToDatabase,
  formatInvoiceDates,
};