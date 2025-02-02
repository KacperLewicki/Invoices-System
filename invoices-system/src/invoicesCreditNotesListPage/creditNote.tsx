"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInvoice } from '../hooks/context/invoiceContext';
import "../globalCSS/globals.css";
import { CreditNoteData } from '../types/typesInvoice';
import CreditNotesList from '../components/invoiceList/creditNotesList';

interface CreditNote_Data extends CreditNoteData {

  id: number;
}

const CreditNotes: React.FC = () => {

  const { creditNotes, loadingCreditNotes, setSelectedCreditNote } = useInvoice();
  const router = useRouter();

  const [localCreditNotes, setLocalCreditNotes] = useState<CreditNote_Data[]>([]);

  useEffect(() => {

    if (Array.isArray(creditNotes)) {

      setLocalCreditNotes(

        creditNotes.map((creditNote) => ({
          ...creditNote,
        }))
      );

    } else {

      setLocalCreditNotes([]);
    }
  }, [creditNotes]);

  const handleRowClick = (creditNote: CreditNote_Data) => {

    setSelectedCreditNote(creditNote);
    router.push(`/invoiceList/invoiceDetails/creditnote`);
  };

  if (loadingCreditNotes) {

    return (
      <p className="text-center mt-10 text-lg text-gray-600"> Data loading... </p>
    );
  }

  return (

    <div className="flex justify-center items-center p-6">
      <CreditNotesList
        localCreditNotes={localCreditNotes}
        onRowClick={handleRowClick} />
    </div>

  );
};

export default CreditNotes;
