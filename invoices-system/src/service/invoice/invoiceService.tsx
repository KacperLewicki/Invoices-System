import moment from 'moment';

interface InvoiceData {

  nameInvoice: string;
  dataInvoice: string;
  dataInvoiceSell: string;
  DueDate: string;
  PaymentTerm: string;
  comments: string;
  seller: string;
  description: string;
  summaryNetto: number;
  summaryVat: number;
  summaryBrutto: number;
  ExchangeRate: number;
  paymentMethod: string;
  efectiveMonth: string;
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

    console.error(`Nie udało się sprawdzić, czy faktura istnieje: Status ${response.status} - ${response.statusText}`);
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
    DueDate: moment(invoiceData.DueDate).format('YYYY-MM-DD'),
    PaymentTerm: moment(invoiceData.PaymentTerm).format('YYYY-MM-DD'),

  };
};

export {
  type InvoiceData,
  type ItemData,
  checkInvoiceExists,
  saveInvoiceToDatabase,
  formatInvoiceDates,
};
