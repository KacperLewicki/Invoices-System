import { InvoiceData } from '../../types/typesInvoice';

export const fetchInvoices = async (): Promise<InvoiceData[]> => {

    try {

        const response = await fetch('/api/dowolandInvoiceDataToInvoicePage');
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
