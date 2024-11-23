"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ItemData {
    id: number;
    nameItem: string;
    quantity: number;
    vatItem: number;
    nettoItem: number;
    bruttoItem: number;
    comment: string;
}

interface InvoiceData {
    id: number;
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
    items: ItemData[];
}

interface InvoiceContextType {

    selectedInvoice: InvoiceData | null;
    setSelectedInvoice: (invoice: InvoiceData | null) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);

    return (
        <InvoiceContext.Provider value={{ selectedInvoice, setSelectedInvoice }}>
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