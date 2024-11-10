import React, { useState } from 'react'
import InvoiceCreditNoteUnderPage from '../underInvoicePage/invoiceCreditNoteUnderPage';
import InvoiceUnderPage from '../underInvoicePage/invoiceUnderPage';
import './invoiceListPage.css';

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

        <div>
            <h1>Lista Faktur użytkownika: </h1>

            <div className='buttonContainer'>
            <button className="buttonShowInvoiceUnderPage" onClick={showInvoice}>Stworzone Faktury</button>
            <button className="buttonShowInvoiceUnderPage" onClick={showCreditNote}>Poprawione Faktury</button>
            </div>
           
 
            <div>
                {showInvoiceUnderPage && <InvoiceUnderPage />}
                {showInvoiceCreditNoteUnderPage && <InvoiceCreditNoteUnderPage />}
            </div>

        </div>
    )
}

export default InvoiceListPage;