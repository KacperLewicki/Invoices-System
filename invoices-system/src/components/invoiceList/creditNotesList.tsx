"use client";

import React from 'react';
import "../../globalCSS/globals.css";
import { CreditNoteData } from '../../types/typesInvoice';

interface CreditNote_Data extends CreditNoteData {

  id: number;
}

interface CreditNotesListProps {

  localCreditNotes?: CreditNote_Data[];
  onRowClick: (creditNote: CreditNote_Data) => void;

}

const CreditNotesList: React.FC<CreditNotesListProps> = ({

  localCreditNotes = [],
  onRowClick,

}) => {

  return (

    <div className="w-full max-w-full shadow-lg rounded-lg border border-gray-200 overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-purple-800 text-white">
          <tr>
            <th className="px-4 py-4 text-sm font-semibold text-center">No.</th>
            <th className="px-4 py-4 text-sm font-semibold">Credit Note Number</th>
            <th className="px-4 py-4 text-sm font-semibold">Invoice</th>
            <th className="px-4 py-4 text-sm font-semibold">Client</th>
            <th className="px-4 py-4 text-sm font-semibold text-right">Gross Value</th>
            <th className="px-4 py-4 text-sm font-semibold text-center">Currency</th>
            <th className="px-4 py-4 text-sm font-semibold">Issue Date</th>
            <th className="px-4 py-4 text-sm font-semibold">Payment Due Date</th>
            <th className="px-4 py-4 text-sm font-semibold">Month</th>
            <th className="px-4 py-4 text-sm font-semibold text-center">Status</th>
          </tr>
        </thead>
        <tbody className="text-gray-800 bg-white">
          {localCreditNotes.length > 0 ? (
            localCreditNotes.map((creditNote, index) => (
              <tr
                key={creditNote.id}
                onClick={() => onRowClick(creditNote)}
                className="cursor-pointer hover:bg-purple-100 transition duration-200 ease-in-out">
                <td className="px-4 py-4 text-sm text-center border border-gray-200">
                  {index + 1}
                </td>
                <td className="px-4 py-4 text-sm font-medium border border-gray-200">
                  {creditNote.creditNote}
                </td>
                <td className="px-4 py-4 text-sm font-medium border border-gray-200">
                  {creditNote.invoiceName}
                </td>
                <td className="px-4 py-4 text-sm border border-gray-200">
                  {creditNote.customerName}
                </td>
                <td className="px-4 py-4 text-sm text-right border border-gray-200">
                  {creditNote.summaryBrutto}
                </td>
                <td className="px-4 py-4 text-sm text-center border border-gray-200">
                  {creditNote.currency}
                </td>
                <td className="px-4 py-4 text-sm border border-gray-200">
                  {new Date(creditNote.dataInvoiceSell).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-sm border border-gray-200">
                  {new Date(creditNote.dueDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-sm border border-gray-200">
                  {creditNote.effectiveMonth}
                </td>
                <td className="px-4 py-4 text-sm border border-gray-200 text-center">
                  <span
                    className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${creditNote.documentStatus === 'Correction Approved - Paid - Final Invoice'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-yellow-200 text-yellow-800'
                      }`}>
                    {creditNote.documentStatus}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="px-4 py-4 text-center text-sm text-gray-600">
                No available credit notes to display.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CreditNotesList;
