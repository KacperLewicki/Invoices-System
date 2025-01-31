"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInvoice } from '../hooks/context/invoiceContext';
import "../globalCSS/globals.css";
import { InvoiceData, CreditNoteData } from '../types/typesInvoice';
import InvoicesApprovedList from '../components/invoiceList/invoicesApprovedList';

interface InvoiceWithType extends InvoiceData {

    id: number;
    items: any[];
    type: 'invoice';
}

interface CreditNoteWithType extends CreditNoteData {

    id: number;
    type: 'creditNote';
}

const InvoicesApproved: React.FC = () => {

    const {
        invoices,
        creditNotes,
        loading,
        loadingCreditNotes,
        setSelectedInvoice,
        setSelectedCreditNote
    } = useInvoice();

    const router = useRouter();

    const [localInvoices, setLocalInvoices] = useState<InvoiceWithType[]>([]);
    const [localCreditNotes, setLocalCreditNotes] = useState<CreditNoteWithType[]>([]);

    useEffect(() => {

        if (Array.isArray(invoices)) {

            const paidInvoices = invoices

                .filter((inv) => inv.documentStatus?.trim() === 'Paid - Final Invoice')
                .map((inv) => ({ ...inv, type: 'invoice' as const }));
                
            setLocalInvoices(paidInvoices);

        } else {

            setLocalInvoices([]);
        }

    }, [invoices]);

    useEffect(() => {

        if (Array.isArray(creditNotes)) {

            const paidCreditNotes = creditNotes

                .filter((cn) => cn.documentStatus?.trim() === 'Correction Approved - Paid - Final Invoice')
                .map((cn) => ({ ...cn, type: 'creditNote' as const }));

            setLocalCreditNotes(paidCreditNotes);

        } else {

            setLocalCreditNotes([]);
        }
    }, [creditNotes]);

    const combinedData = [...localInvoices, ...localCreditNotes];

    const handleRowClick = (

        invoiceOrCredit: InvoiceWithType | CreditNoteWithType

    ) => {

        if (invoiceOrCredit.type === 'invoice') {

            setSelectedInvoice(invoiceOrCredit);
            router.push(`/invoiceList/invoiceDetails/invoice`);

        } else {

            setSelectedCreditNote(invoiceOrCredit);
            router.push(`/invoiceList/invoiceDetails/creditnote`);
        }
    };

    if (loading || loadingCreditNotes) {

        return <p className="text-center mt-10 text-lg text-gray-600">Data loading...</p>;
    }


    return (

        <div className="flex justify-center items-center bg-white p-6">
            <InvoicesApprovedList
                combinedData={combinedData}
                onRowClick={handleRowClick}
            />
        </div>
    );
};

export default InvoicesApproved;
