"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { InvoiceData, ItemData } from '../../types/typesInvoice';
import { InvoiceContextType } from '../../types/typesInvoice';

/**
 * Rozszerzony interfejs dla pojedynczego przedmiotu (item) na fakturze.
 * Dodaje własność `id`, aby móc jednoznacznie identyfikować dany przedmiot.
 */
interface Item_Data extends ItemData {
    id: number;
}

/**
 * Rozszerzony interfejs dla pojedynczej faktury.
 * Oprócz typów zdefiniowanych w `InvoiceData`, dodaje pole `id` i tablicę przedmiotów `items`,
 * dzięki czemu możliwe jest zarządzanie zidentyfikowanymi fakturami i ich pozycjami.
 */
interface Invoice_Data extends InvoiceData {
    id: number;
    items: Item_Data[];
}

/**
 * Interfejs rozszerzający `InvoiceContextType` o konkretne pola dla wybranej faktury i listy faktur.
 * `selectedInvoice` reprezentuje aktualnie wybraną fakturę, a `invoices` to tablica pobranych faktur.
 */
interface Invoice_ContextType extends InvoiceContextType {
    selectedInvoice: Invoice_Data | null;
    setSelectedInvoice: (invoice: Invoice_Data | null) => void;
    invoices: Invoice_Data[];
}

/**
 * Tworzy kontekst dla faktur, który zostanie wykorzystany w całej aplikacji.
 * Pozwala to na dostęp do wybranej faktury, listy faktur i stanu ładowania,
 * bez konieczności przekazywania ich przez propsy.
 */
const InvoiceContext = createContext<Invoice_ContextType | undefined>(undefined);

/**
 * Komponent `InvoiceProvider`:
 * 
 * Odpowiada za:
 * - Stan `selectedInvoice` - aktualnie wybrana faktura.
 * - Stan `invoices` - lista wszystkich faktur pobranych z API.
 * - Stan `loading` - wskaźnik procesu pobierania faktur.
 * 
 * Gdy komponent zostaje zamontowany, pobiera dane faktur z endpointu `'/api/dowolandInvoiceDataToInvoicePage'`.
 * Następnie udostępnia te informacje w całej aplikacji poprzez `InvoiceContext`.
 */

export const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    // Aktualnie wybrana faktura, domyślnie brak

    const [selectedInvoice, setSelectedInvoice] = useState<Invoice_Data | null>(null);

    // Lista wszystkich pobranych faktur

    const [invoices, setInvoices] = useState<Invoice_Data[]>([]);

    // Stan ładowania danych
    
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {

        /**
         * Asynchroniczna funkcja pobierająca dane faktur z API.
         * W przypadku powodzenia zapisuje dane do stanu `invoices`,
         * w przypadku błędu loguje go i ustawia pustą tablicę faktur.
         */

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

/**
 * Hook `useInvoice`:
 * 
 * Pozwala na pobranie wartości z `InvoiceContext`. Jeśli hook zostanie wywołany
 * poza komponentem otoczonym `InvoiceProvider`, rzuci błąd, zapewniając
 * integralność kontekstu i zapobiegając nieprawidłowemu użyciu.
 * 
 * @throws {Error} Gdy hook jest używany poza `InvoiceProvider`.
 * @returns {Invoice_ContextType} Obiekt zawierający aktualnie wybraną fakturę, funkcję do jej zmiany, listę faktur oraz stan ładowania.
 */

export const useInvoice = (): Invoice_ContextType => {
    const context = useContext(InvoiceContext);
    if (!context) {
        throw new Error('useInvoice must be used within an InvoiceProvider');
    }
    return context;
};
