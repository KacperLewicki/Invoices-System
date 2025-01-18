import { NextApiRequest, NextApiResponse } from 'next';
import pool from './lib/db';
import { CreditNoteData } from '../types/typesInvoice';

// 📚 **Handler Tworzenia Korekty Faktury (Credit Note)**

// Ten endpoint obsługuje tworzenie korekty faktury (Credit Note).
// Dane korekty są walidowane, numer dokumentu jest automatycznie generowany,
// a powiązanie z użytkownikiem jest realizowane poprzez `identyfikator` z nagłówka HTTP.

// 📌 **Obsługa Żądań API**

/**
 * @function handler
 * Tworzy nową korektę faktury i automatycznie przypisuje `identyfikator` użytkownika.
 *
 * @param {NextApiRequest} req - Obiekt żądania HTTP.
 * @param {NextApiResponse} res - Obiekt odpowiedzi HTTP.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // 📌 1. Sprawdź metodę żądania

    if (req.method === 'POST') {

        // 📌 2. Destrukturyzacja danych z ciała żądania

        const {
            invoiceName,
            dataInvoice,
            dataInvoiceSell,
            dueDate,
            paymentTerm,
            comments,
            seller,
            summaryNetto,
            summaryBrutto,
            summaryVat,
            customerName,
            description,
            exchangeRate,
            paymentMethod,
            effectiveMonth,
            documentStatus,
            currency,
            items
        }: CreditNoteData = req.body;

        // 📌 3. Pobierz `identyfikator` z nagłówka

        const identyfikator = req.headers['identyfikator'];

        if (!identyfikator) {
            return res.status(400).json({ message: 'Brak identyfikatora użytkownika' });
        }

        // 📌 4. Nawiąż połączenie z bazą danych

        const connection = await pool.getConnection();

        try {
            // 📌 5. Rozpocznij transakcję

            await connection.beginTransaction();

            // 🔑 **Generowanie Numeru Korekty Faktury**

            /**
             * Pobierz ostatnie ID z tabeli `creditnotesinvoices`
             * i wygeneruj nowy numer korekty w formacie: CN/24/0001
             */

            const [rows]: any = await connection.query('SELECT MAX(id) as maxId FROM creditnotesinvoices');
            const maxId = rows[0]?.maxId || 0;
            const year = new Date().getFullYear().toString().slice(-2);
            const newCreditNoteNumber = `CN/${year}/${String(maxId + 1).padStart(4, '0')}`;

            let documentStatus = "Poprawka zatwierdzona - opłacona - gotowa faktura";

            // 📝 **Zapis Korekty Faktury do Bazy Danych**

            /**
             * Zapisz główne informacje o korekcie faktury do tabeli `creditnotesinvoices`.
             * Automatycznie dodaj `identyfikator` użytkownika.
             */

            const [result]: any = await connection.query(

                `INSERT INTO creditnotesinvoices 
                (creditNote, invoiceName, dataInvoice, dataInvoiceSell, dueDate, paymentTerm, comments, seller, 
                 summaryNetto, summaryBrutto, summaryVat, customerName, description, exchangeRate, 
                 paymentMethod, effectiveMonth, documentStatus, identyfikator, currency) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    newCreditNoteNumber,
                    invoiceName,
                    dataInvoice,
                    dataInvoiceSell,
                    dueDate,
                    paymentTerm,
                    comments,
                    seller,
                    summaryNetto,
                    summaryBrutto,
                    summaryVat,
                    customerName,
                    description,
                    exchangeRate,
                    paymentMethod,
                    effectiveMonth,
                    documentStatus,
                    identyfikator,
                    currency,
                ]
            );

            const creditNoteId = result.insertId;

            // 📦 **Zapis Pozycji Korekty Faktury**

            /**
             * Iteruj po tablicy `items` i zapisuj każdą pozycję korekty w tabeli `creditnoteitems`.
             */

            for (const item of items) {

                await connection.query(

                    `INSERT INTO creditnoteitems 
                    (creditNoteId, itemName, quantity, nettoItem, vatItem, bruttoItem) 
                    VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        creditNoteId,
                        item.itemName,
                        item.quantity,
                        item.nettoItem,
                        item.vatItem,
                        item.bruttoItem,
                    ]
                );
            }

            // ✅ **Zakończenie Transakcji**

            await connection.commit();

            res.status(201).json({

                id: creditNoteId,
                creditNote: newCreditNoteNumber,
                message: 'Korekta faktury utworzona pomyślnie',
            });

        } catch (error) {

            // ❌ **Obsługa Błędów**

            /**
             * W przypadku błędu wycofaj transakcję i zwróć komunikat błędu.
             */

            await connection.rollback();
            console.error('Błąd podczas tworzenia korekty faktury:', error);
            res.status(500).json({ message: 'Wewnętrzny błąd serwera' });

        } finally {

            // 🔄 **Zakończenie Połączenia**

            /**
             * Zwolnij połączenie z bazą danych.
             */

            connection.release();
        }
    } else {

        // 🚫 **Nieprawidłowa Metoda**

        /**
         * Jeśli metoda żądania nie jest `POST`, zwróć błąd 405.
         */

        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Metoda ${req.method} nie jest dozwolona`);
    }
}
