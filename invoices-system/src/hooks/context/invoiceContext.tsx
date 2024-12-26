"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { InvoiceData, ItemData, CreditNoteData, CreditNoteItemData } from '../../types/typesInvoice';

// 🛠️ **Typy Danych**

interface Item_Data extends ItemData {

    id: number;
}

interface Invoice_Data extends InvoiceData {

    id: number;
    items: Item_Data[];
}

interface CreditNote_Item extends CreditNoteItemData {

    id: number;
}

interface CreditNote_Data extends CreditNoteData {

    id: number;
    items: CreditNote_Item[];
}

interface Invoice_ContextType {

    // Faktury

    selectedInvoice: Invoice_Data | null;
    setSelectedInvoice: (invoice: Invoice_Data | null) => void;
    invoices: Invoice_Data[];
    loading: boolean;
    error: string | null;
    fetchInvoices: () => Promise<void>;

    // Noty Kredytowe

    selectedCreditNote: CreditNote_Data | null;
    setSelectedCreditNote: (creditNote: CreditNote_Data | null) => void;
    creditNotes: CreditNote_Data[];
    loadingCreditNotes: boolean;
    errorCreditNotes: string | null;
    fetchCreditNotes: () => Promise<void>;
}

// 🌐 **Tworzenie Kontekstu**

const InvoiceContext = createContext<Invoice_ContextType | undefined>(undefined);

/** 
 * @component InvoiceProvider
 * Zarządzanie stanem faktur i not kredytowych.
 */

export const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    // 📝 **Stan Faktur**

    const [selectedInvoice, setSelectedInvoice] = useState<Invoice_Data | null>(null);
    const [invoices, setInvoices] = useState<Invoice_Data[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 📝 **Stan Not Kredytowych**

    const [selectedCreditNote, setSelectedCreditNote] = useState<CreditNote_Data | null>(null);
    const [creditNotes, setCreditNotes] = useState<CreditNote_Data[]>([]);
    const [loadingCreditNotes, setLoadingCreditNotes] = useState<boolean>(true);
    const [errorCreditNotes, setErrorCreditNotes] = useState<string | null>(null);

    /** Pobierz Faktury */

    const fetchInvoices = async () => {

        setLoading(true);
        setError(null);

        try {

            const token = localStorage.getItem('token') || '';

            const response = await fetch('/api/getInvoiceData', {
                headers: { 'Authorization': `Bearer ${token}`, 'identyfikator': token },
            });

            if (!response.ok) throw new Error(`Błąd: ${response.status}`);

            const data = await response.json();

            setInvoices(data);

        } catch (error: any) {

            setError(error.message || 'Błąd podczas pobierania faktur');

        } finally {

            setLoading(false);
        }
    };

    /** Pobierz Noty Kredytowe */

    const fetchCreditNotes = async () => {

        setLoadingCreditNotes(true);
        setErrorCreditNotes(null);

        try {
            const token = localStorage.getItem('token') || '';

            const response = await fetch('/api/getCreditNoteInvoiceData', {

                headers: { 'Authorization': `Bearer ${token}`, 'identyfikator': token },
            });

            if (!response.ok) throw new Error(`Błąd: ${response.status}`);

            const data = await response.json();

            setCreditNotes(data);

        } catch (error: any) {

            setErrorCreditNotes(error.message || 'Błąd podczas pobierania not kredytowych');

        } finally {

            setLoadingCreditNotes(false);
        }
    };

    useEffect(() => {

        fetchInvoices();
        fetchCreditNotes();

    }, []);

    return (
        <InvoiceContext.Provider
            value={{
                selectedInvoice,
                setSelectedInvoice,
                invoices,
                loading,
                error,
                fetchInvoices,
                selectedCreditNote,
                setSelectedCreditNote,
                creditNotes,
                loadingCreditNotes,
                errorCreditNotes,
                fetchCreditNotes,
            }}
        >
            {children}
        </InvoiceContext.Provider>
    );
};

/** 
 * @function useInvoice
 * Dostarcza kontekst dla faktur i not kredytowych.
 */

export const useInvoice = (): Invoice_ContextType => {

    const context = useContext(InvoiceContext);

    if (!context) {

        throw new Error('useInvoice must be used within an InvoiceProvider');
    }
    return context;
};
