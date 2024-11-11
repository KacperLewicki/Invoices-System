import React, { useState } from 'react'
import InvoiceCreditNoteUnderPage from '../underInvoicePage/invoiceCreditNoteUnderPage';
import InvoiceUnderPage from '../underInvoicePage/invoiceUnderPage';

import '../../../globalCSS/globals.css';

const InvoiceListPage = () => {

    const [showInvoiceUnderPage, setShowInvoiceUnderPage] = useState(false);
    const [showInvoiceCreditNoteUnderPage, setShowInvoiceCreditNoteUnderPage] = useState(false);

    const showInvoice = () => {

        setShowInvoiceUnderPage(true);
        setShowInvoiceCreditNoteUnderPage(false);
    }

    const showCreditNote = () => {
      
        setShowInvoiceUnderPage(false);
        setShowInvoiceCreditNoteUnderPage(true);
    }

    return (
        <div className=" flex flex-col items-center justify-center bg-white py-10">
            <h1 className="text-3xl font-bold text-purple-700 mb-6">Lista Faktur użytkownika: Kacper Lewicki</h1>
    
            <div className="flex space-x-4 mb-8">
                <button 
                    className="bg-purple-600 text-white rounded-lg py-2 px-6 hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
                    onClick={showInvoice}
                >
                    Stworzone Faktury
                </button>
                <button 
                    className="bg-purple-600 text-white rounded-lg py-2 px-6 hover:bg-purple-700 transition duration-300 ease-in-out transform hover:scale-105"
                    onClick={showCreditNote}
                >
                    Poprawione Faktury
                </button>
            </div>
    
            <div className="w-full max-w-5xl">
                {showInvoiceUnderPage && <InvoiceUnderPage />}
                {showInvoiceCreditNoteUnderPage && <InvoiceCreditNoteUnderPage />}
            </div>
        </div>
    );
    
}

export default InvoiceListPage;