"use client";

import React from "react";
import { useInvoice } from "../../../../hooks/context/invoiceContext";
import "../../../../globalCSS/globals.css";
import SelectCreditNote from "../../../../components/invoiceDetail/selectCreditNote";
import { CreditNoteData } from "../../../../types/typesInvoice";


interface CreditNoteDataExtended extends CreditNoteData {

  id?: number;
}

const CreditNoteDetails: React.FC = () => {

  const { selectedCreditNote } = useInvoice();
  const creditNote = selectedCreditNote as CreditNoteDataExtended | undefined;

  const handleGeneratePDF = async () => {

    try {

      if (!creditNote) {

        throw new Error("No invoice data (creditNote).");
      }

      const payload = {

        creditNote: creditNote.creditNote,
        invoiceName: creditNote.invoiceName,
        documentStatus: creditNote.documentStatus,
        customerName: creditNote.customerName,
        seller: creditNote.seller,
        paymentMethod: creditNote.paymentMethod,
        effectiveMonth: creditNote.effectiveMonth,
        currency: creditNote.currency,
        dataInvoice: creditNote.dataInvoice,
        dataInvoiceSell: creditNote.dataInvoiceSell,
        dueDate: creditNote.dueDate,
        comments: creditNote.comments,
        summaryNetto: creditNote.summaryNetto,
        summaryVat: creditNote.summaryVat,
        summaryBrutto: creditNote.summaryBrutto,
        items: creditNote.items.map((item) => ({
          id: item.id,
          itemName: item.itemName,
          quantity: Math.round(item.quantity),
          nettoItem: item.nettoItem,
          vatItem: Math.round(item.vatItem),
          bruttoItem: item.bruttoItem,

        })),
      };

      const response = await fetch("/api/invoiceCreditNotePDF", {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {

        throw new Error("There was a problem with PDF generation.");
      }

      const blob = await response.blob();
      const pdfURL = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = pdfURL;
      link.download = `FV-${creditNote.invoiceName}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(pdfURL);

    } catch (error) {

      console.error(error);
      alert("There was a problem with PDF generation.");
    }
  };

  if (!creditNote) {

    return (
      <p className="text-center mt-10 text-lg text-gray-600">
        The credit note was not found.
      </p>
    );
  }

  return (

    <SelectCreditNote
      creditNote={creditNote}
      onGeneratePDF={handleGeneratePDF}
    />
  );
};

export default CreditNoteDetails;
