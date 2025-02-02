"use client";

import React from 'react';
import "../../globalCSS/globals.css";
import { InvoiceData, ItemData } from '../../types/typesInvoice';

interface Item_Data extends ItemData {
  id: number;
}

interface Invoice_Data extends InvoiceData {

  id: number;
  items: Item_Data[];
}

interface InvoicesListProps {

  localInvoices?: Invoice_Data[];
  onRowClick: (invoice: Invoice_Data) => void;

}

const InvoicesList: React.FC<InvoicesListProps> = ({ localInvoices = [], onRowClick }) => {

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
            <th className="px-4 py-4 text-sm font-semibold">Month</th>
            <th className="px-4 py-4 text-sm font-semibold text-center">Status</th>
          </tr>
        </thead>
        <tbody className="text-gray-800 bg-white">
          {localInvoices.length > 0 ? (
            localInvoices.map((invoice, index) => (
              <tr
                key={invoice.id}
                onClick={() => onRowClick(invoice)}
                className="cursor-pointer hover:bg-purple-100 transition duration-200 ease-in-out">
                <td className="px-4 py-4 text-sm text-center border border-gray-200"> {index + 1} </td>
                <td className="px-4 py-4 text-sm font-medium border border-gray-200"> {invoice.nameInvoice} </td>
                <td className="px-4 py-4 text-sm border border-gray-200"> {invoice.customerName} </td>
                <td className="px-4 py-4 text-sm text-right border border-gray-200"> {invoice.summaryBrutto} </td>
                <td className="px-4 py-4 text-sm text-center border border-gray-200"> {invoice.currency} </td>
                <td className="px-4 py-4 text-sm border border-gray-200"> {new Date(invoice.dataInvoiceSell).toLocaleDateString()} </td>
                <td className="px-4 py-4 text-sm border border-gray-200"> {new Date(invoice.dueDate).toLocaleDateString()} </td>
                <td className="px-4 py-4 text-sm border border-gray-200"> {invoice.effectiveMonth} </td>
                <td className="px-4 py-4 text-sm border border-gray-200 text-center">
                  <span
                    className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${invoice.documentStatus === 'Paid - Final Invoice'
                      ? 'bg-green-200 text-green-800'
                      : invoice.documentStatus === 'Requires Correction'
                        ? 'bg-red-200 text-red-800'
                        : invoice.documentStatus === 'Under Review'
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-orange-100 text-orange-600'
                      }`}>
                    {invoice.documentStatus}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="px-4 py-4 text-center text-sm text-gray-600"> No available invoices to display. </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvoicesList;
