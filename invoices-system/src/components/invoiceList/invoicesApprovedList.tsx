"use client";

import React from 'react';
import "../../globalCSS/globals.css";
import { InvoiceData, CreditNoteData } from '../../types/typesInvoice';

interface InvoiceWithType extends InvoiceData {

  id: number;
  items: any[];
  type: 'invoice';
}

interface CreditNoteWithType extends CreditNoteData {

  id: number;
  type: 'creditNote';
}

type ApprovedItem = InvoiceWithType | CreditNoteWithType;

interface InvoicesApprovedListProps {

  combinedData?: ApprovedItem[];
  onRowClick: (item: ApprovedItem) => void;

}

const InvoicesApprovedList: React.FC<InvoicesApprovedListProps> = ({ combinedData = [], onRowClick }) => {

  return (

    <div className="w-full max-w-full shadow-lg rounded-lg border border-gray-200 overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-purple-800 text-white">
          <tr>
            <th className="px-4 py-4 text-sm font-semibold text-center">No.</th>
            <th className="px-4 py-4 text-sm font-semibold">Invoice Number</th>
            <th className="px-4 py-4 text-sm font-semibold">Client</th>
            <th className="px-4 py-4 text-sm font-semibold text-right">Gross Value</th>
            <th className="px-4 py-4 text-sm font-semibold text-center">Currency</th>
            <th className="px-4 py-4 text-sm font-semibold">Issue Date</th>
            <th className="px-4 py-4 text-sm font-semibold">Payment Due Date</th>
            <th className="px-4 py-4 text-sm font-semibold text-center">Type</th>
            <th className="px-4 py-4 text-sm font-semibold text-center">Status</th>
          </tr>
        </thead>
        <tbody className="text-gray-800 bg-white">
          {combinedData.length > 0 ? (
            combinedData.map((item, index) => (
              <tr
                key={`${item.type}-${item.id}`}
                onClick={() => onRowClick(item)}
                className="cursor-pointer hover:bg-purple-100 transition duration-200 ease-in-out">
                <td className="px-4 py-4 text-sm text-center border border-gray-200"> {index + 1} </td>
                <td className="px-4 py-4 text-sm font-medium border border-gray-200"> {item.type === 'invoice' ? item.nameInvoice : item.creditNote} </td>
                <td className="px-4 py-4 text-sm border border-gray-200"> {item.customerName} </td>
                <td className="px-4 py-4 text-sm text-right border border-gray-200"> {item.summaryBrutto} </td>
                <td className="px-4 py-4 text-sm text-center border border-gray-200"> {item.currency} </td>
                <td className="px-4 py-4 text-sm border border-gray-200"> {new Date(item.dataInvoiceSell).toLocaleDateString()} </td>
                <td className="px-4 py-4 text-sm border border-gray-200"> {new Date(item.dueDate).toLocaleDateString()} </td>
                <td className="px-4 py-4 text-sm text-center border border-gray-200"> {item.type === 'invoice' ? 'Invoice' : 'Credit Note'} </td>
                <td className="px-4 py-4 text-sm border border-gray-200 text-center"> <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-green-200 text-green-800"> {item.documentStatus} </span> </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="px-4 py-4 text-center text-sm text-gray-600"> No available invoices or credit notes to display. </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvoicesApprovedList;
