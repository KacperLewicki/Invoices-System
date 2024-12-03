"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { InvoiceData, ItemData, } from '../../types/typesInvoice';
import { InvoiceContextType } from '../../types/typesInvoice';

interface Item_Data extends ItemData {

    id: number;
}

interface Invoice_Data extends InvoiceData {

    id: number;
    items: Item_Data[];
}

interface Invoice_ContextType extends InvoiceContextType {

    selectedInvoice: Invoice_Data | null;
    setSelectedInvoice: (invoice: Invoice_Data | null) => void;
    invoices: Invoice_Data[];
}

const InvoiceContext = createContext<Invoice_ContextType | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [selectedInvoice, setSelectedInvoice] = useState<Invoice_Data | null>(null);
    const [invoices, setInvoices] = useState<Invoice_Data[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {

        const fetchInvoices = async () => {

            try {

                const response = await fetch('/api/dowolandInvoiceDataToInvoicePage');
                const data = await response.json();

                if (Array.isArray(data)) {

                    setInvoices(data);
                } else {

                    console.error("Oczekiwana tablica, otrzymano:", data);
                    setInvoices([]);
                }
            } catch (error) {

                console.error('Błąd podczas pobierania faktur:', error);
                setInvoices([]);
            } finally {

                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    return (
        <InvoiceContext.Provider value={{ selectedInvoice, setSelectedInvoice, invoices, loading }}>
            {children}
        </InvoiceContext.Provider>
    );
};

export const useInvoice = () => {

    const context = useContext(InvoiceContext);
    if (!context) {

        throw new Error('useInvoice must be used within an InvoiceProvider');
    }
    return context;
};
