"use client";

import React, { useState, useEffect } from "react";
import { useInvoice } from "../../../../hooks/context/invoiceContext";
import { CreditNoteData, CreditNoteItemData } from "../../../../types/typesInvoice";
import { fetchInvoiceData, sendCreditNote } from "../../../../service/invoiceList/invoiceListService";
import Modal from "../../../../components/modal/modal_popup";
import InvoiceDetailView from "../../../../components/invoiceDetail/selectInvoice";
import CorrectionModal from "../../../../components/correctInvoice/correctInvoice";
import ConfirmationOverlay from "../../../../components/modal/confirmationOverlay";

const InvoiceDetailManager: React.FC = () => {

  const {
    selectedInvoice: invoice,
    fetchInvoices,
    fetchCreditNotes
  } = useInvoice();

  const [showComment, setShowComment] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creditNoteData, setCreditNoteData] = useState<CreditNoteData | null>(null);
  const [creditNoteItems, setCreditNoteItems] = useState<CreditNoteItemData[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {

    if (invoice) {

      const data = fetchInvoiceData(invoice);
      setCreditNoteData(data);
      setCreditNoteItems(data?.items || []);
    }
  }, [invoice]);

  const createCreditNote = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const calculateTotals = (items: CreditNoteItemData[]) => {

    let summaryNetto = 0;
    let summaryVat = 0;
    let summaryBrutto = 0;

    items.forEach((item) => {

      const quantity = parseFloat(item.quantity?.toString()) || 1;
      const netto = parseFloat(item.nettoItem?.toString()) || 0;
      const vat = parseFloat(item.vatItem?.toString()) || 0;

      const totalNetto = netto * quantity;
      const totalBrutto = totalNetto + (totalNetto * vat) / 100;
      const totalVat = totalBrutto - totalNetto;

      summaryNetto += totalNetto;
      summaryVat += totalVat;
      summaryBrutto += totalBrutto;
    });

    return {

      summaryNetto: parseFloat(summaryNetto.toFixed(2)),
      summaryVat: parseFloat(summaryVat.toFixed(2)),
      summaryBrutto: parseFloat(summaryBrutto.toFixed(2)),
    };
  };

  const validateForm = (): boolean => {

    if (!creditNoteData) return false;

    const requiredFields: { field: keyof CreditNoteData; label: string }[] = [

      { field: "paymentTerm", label: "Warunki płatności" },
      { field: "seller", label: "Sprzedawca" },
      { field: "customerName", label: "Nazwa klienta" },
      { field: "effectiveMonth", label: "Miesiąc efektywny" },
      { field: "currency", label: "Waluta" },

    ];

    for (const { field, label } of requiredFields) {

      if (!creditNoteData[field]) {

        alert(`The “${label}” field is required.`);
        return false;
      }
    }
    return true;
  };

  const submitCorrection = async () => {

    try {

      if (!validateForm()) {

        console.warn("Formularz zawiera błędy.");
        return;
      }

      if (creditNoteData) {

        const itemsToSend = creditNoteItems.map(

          ({ itemName, quantity, nettoItem, vatItem, bruttoItem }) => ({
            itemName,
            quantity,
            nettoItem,
            vatItem,
            bruttoItem,
          })
        );

        await sendCreditNote({

          ...creditNoteData,
          items: itemsToSend,

        });

        if (invoice) {

          await fetch("/api/updateInvoiceStatus", {

            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ invoiceName: invoice.nameInvoice }),
          });
        }

        await fetchInvoices();
        await fetchCreditNotes();

        setIsModalOpen(false);
        setShowConfirmation(true);
      }

    } catch (error) {

      console.error("Error creating credit note:", error);
      alert("An error occurred while uploading the corrected invoice.");
    }
  };

  const handleBackToInvoiceList = () => {

    window.location.href = "/invoiceList";
  };

  const handleGeneratePDF = async () => {

    try {

      if (!invoice) {

        throw new Error("No invoice (invoice) details.");
      }

      const payload = {

        invoiceName: invoice.nameInvoice,
        documentStatus: invoice.documentStatus,
        customerName: invoice.customerName,
        seller: invoice.seller,
        paymentMethod: invoice.paymentMethod,
        effectiveMonth: invoice.effectiveMonth,
        currency: invoice.currency,
        dataInvoice: invoice.dataInvoice,
        dataInvoiceSell: invoice.dataInvoiceSell,
        dueDate: invoice.dueDate,
        comments: invoice.comments,
        summaryNetto: invoice.summaryNetto,
        summaryVat: invoice.summaryVat,
        summaryBrutto: invoice.summaryBrutto,
        items: invoice.items.map((item) => ({
          id: item.id,
          itemName: item.nameItem,
          quantity: Math.round(item.quantity),
          nettoItem: item.nettoItem,
          vatItem: Math.round(item.vatItem),
          bruttoItem: item.bruttoItem,
        })),
      };

      const response = await fetch("/api/invoicePDF", {

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
      link.download = `FV-${invoice.nameInvoice}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(pdfURL);

    } catch (error) {

      console.error(error);
      alert("There was a problem with PDF generation.");
    }
  };

  if (!invoice) {

    return <p>The invoice was not found.</p>;
  }

  return (
    <>

      {showConfirmation && (
        <ConfirmationOverlay
          onBackToInvoiceList={handleBackToInvoiceList}
          message="Your corrected invoice is in the Corrected Invoices tab and awaits administrator approval"
        />
      )}

      {showComment && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-lg font-semibold">Administrator Comment:</h2>
          <p>{"Please correct the invoice - empty fields - test"}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 py-10 px-4">
        <div className="flex flex-col items-start">
          {invoice.documentStatus === "Requires Correction" && (
            <>
              <button
                className="mb-4 bg-purple-800 text-white py-2 px-6 rounded-lg shadow-md hover:bg-purple-900 w-48"
                onClick={() => setShowComment(!showComment)}>
                Show Comment
              </button>
              <button
                onClick={createCreditNote}
                className="mb-4 bg-purple-800 text-white py-2 px-6 rounded-lg shadow-md hover:bg-purple-900 w-48">
                Correct Invoice
              </button>
            </>
          )}
          <button
            onClick={handleGeneratePDF}
            className="bg-purple-800 text-white py-2 px-6 rounded-lg shadow-md hover:bg-purple-900 w-48">
            Generate Invoice PDF
          </button>
        </div>

        <InvoiceDetailView invoice={invoice} />

      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <CorrectionModal
            creditNoteData={creditNoteData}
            setCreditNoteData={setCreditNoteData}
            creditNoteItems={creditNoteItems}
            setCreditNoteItems={setCreditNoteItems}
            calculateTotals={calculateTotals}
            submitCorrection={submitCorrection}
            closeModal={closeModal} />
        </Modal>
      )}
    </>
  );
};

export default InvoiceDetailManager;
