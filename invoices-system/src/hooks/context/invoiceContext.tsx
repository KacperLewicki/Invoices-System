"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { InvoiceData, ItemData } from '../../types/typesInvoice';
import { InvoiceContextType } from '../../types/typesInvoice';

// 📚 **InvoiceContext Hook – Zarządzanie Fakturami**

/**
 * @module InvoiceContext
 * @description
 * Kontekst React do zarządzania stanem faktur w aplikacji.
 * Obejmuje wybraną fakturę, listę faktur oraz stan ładowania danych.
 */


// 🛠️ **Typy i Interfejsy**

/**
 * @interface Item_Data
 * @description Rozszerza ItemData o unikalny identyfikator `id`.
 */

interface Item_Data extends ItemData {

    id: number;
}

/**
 * @interface Invoice_Data
 * @description Rozszerza InvoiceData o identyfikator `id` oraz tablicę pozycji `items`.
 */
interface Invoice_Data extends InvoiceData {

    id: number;
    items: Item_Data[];
}

/**
 * @interface Invoice_ContextType
 * @description Definiuje strukturę kontekstu dla faktur.
 */


interface Invoice_ContextType extends InvoiceContextType {

    selectedInvoice: Invoice_Data | null;
    setSelectedInvoice: (invoice: Invoice_Data | null) => void;
    invoices: Invoice_Data[];
    loading: boolean;
    error: string | null;
    fetchInvoices: () => Promise<void>;
}

// 🌐 **Kontekst Faktur**

/**
 * Tworzy kontekst dla faktur, umożliwiający globalny dostęp do wybranej faktury,
 * listy faktur oraz stanu ładowania.
 */

const InvoiceContext = createContext<Invoice_ContextType | undefined>(undefined);

/**
 * @component InvoiceProvider
 * @description Komponent dostarczający kontekst faktur dla swojej poddrzewa komponentów.
 */

export const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [selectedInvoice, setSelectedInvoice] = useState<Invoice_Data | null>(null);
    const [invoices, setInvoices] = useState<Invoice_Data[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchInvoices = async () => {

        setLoading(true);
        setError(null);
    
        try {
            const token = localStorage.getItem('token') || '';
    
            //console.log('Token:', token);
    
            const response = await fetch('/api/getInvoiceData', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'identyfikator': token,
                },
            });
    
            //console.log('Nagłówki żądania:', response.headers);
    
            if (!response.ok) {

                const errorText = await response.text();
                throw new Error(`Błąd sieci: ${response.status} - ${errorText}`);
            }
    
            const data = await response.json();
    
            if (Array.isArray(data)) {

                setInvoices(data);

            } else {
                
            }
        } catch (error: any) {

            console.error('Błąd podczas pobierania faktur:', error.message);
            setError(error.message || 'Wystąpił błąd podczas pobierania faktur');
            setInvoices([]);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        fetchInvoices();
    }, []);

    return (
        <InvoiceContext.Provider value={{ selectedInvoice, setSelectedInvoice, invoices, loading, error, fetchInvoices}}>
            {children}
        </InvoiceContext.Provider>
    );
};


// 🪝 **Hook useInvoice**


/**
 * @function useInvoice
 * @description Hook dostarczający dostęp do kontekstu faktur.
 */
export const useInvoice = (): Invoice_ContextType => {

    const context = useContext(InvoiceContext);

    if (!context) {
        
        throw new Error('useInvoice must be used within an InvoiceProvider');
    }
    return context;
};


// 📌 **Podsumowanie**


/**
 * - **InvoiceProvider**: Zarządza stanem faktur i dostarcza dane przez kontekst.
 * - **useInvoice**: Hook do pobierania danych z kontekstu.
 * - **selectedInvoice**: Aktualnie wybrana faktura.
 * - **invoices**: Lista faktur.
 * - **loading**: Wskaźnik ładowania.
 * - **error**: Komunikat błędu w przypadku problemów z API.
 * 
 * 🔄 Dane są automatycznie pobierane przy montowaniu komponentu.
 * 🛡️ Zapewnia integralność kontekstu dzięki walidacji w `useInvoice`.
 * 🛡️ Dodatkowe zabezpieczenie przed pustymi obiektami, `null` i błędnymi odpowiedziami API.
 */
