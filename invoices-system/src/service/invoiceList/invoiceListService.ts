import { InvoiceData } from '../../types/typesInvoice';
import { CreditNoteData } from '../../types/typesInvoice';
import axios from 'axios';

export const fetchInvoices = async (): Promise<InvoiceData[]> => {

    try {

        const response = await fetch('/api/getInvoiceData');
        const data = await response.json();

        if (Array.isArray(data)) {

            return data;

        } else {

            console.error("Oczekiwana tablica, otrzymano:", data);
            return [];
        }

    } catch (error) {

        console.error('Błąd podczas pobierania faktur:', error);
        return [];
    }
};

export const fetchInvoiceData = (invoice: any): CreditNoteData | null => {
    
    if (!invoice) return null;

    return {
        creditNote: '',
        invoiceName: invoice.nameInvoice,
        dataInvoice: invoice.dataInvoice,
        dataInvoiceSell: invoice.dataInvoiceSell,
        dueDate: invoice.dueDate,
        paymentTerm: invoice.paymentTerm,
        comments: invoice.comments,
        seller: invoice.seller,
        summaryNetto: invoice.summaryNetto,
        summaryBrutto: invoice.summaryBrutto,
        summaryVat: invoice.summaryVat,
        customerName: invoice.customerName,
        description: invoice.description,
        exchangeRate: invoice.exchangeRate,
        paymentMethod: invoice.paymentMethod,
        effectiveMonth: invoice.effectiveMonth,
        documentStatus: invoice.documentStatus,
        identyfikator: invoice.identyfikator,
        currency: invoice.currency,
        items: invoice.items.map((item: any) => ({
            itemName: item.nameItem,
            quantity: item.quantity,
            nettoItem: item.nettoItem,
            vatItem: item.vatItem,
            bruttoItem: item.bruttoItem,
        })),
    };
};

export const calculateTotals = (items: any[]) => {

    const summaryNetto = items.reduce((total, item) => total + item.nettoItem * item.quantity, 0);
    const summaryVat = items.reduce((total, item) => total + (item.nettoItem * item.quantity * item.vatItem / 100), 0);
    const summaryBrutto = summaryNetto + summaryVat;

    return { summaryNetto, summaryVat, summaryBrutto };
};


export const sendCreditNote = async (creditNoteData: CreditNoteData) => {
    
    const response = await axios.post('/api/postInvoiceCreditNote', creditNoteData);
    return response.data;
};

