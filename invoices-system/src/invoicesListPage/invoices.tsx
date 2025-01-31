"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInvoice } from '../hooks/context/invoiceContext';
import "../globalCSS/globals.css";
import { InvoiceData, ItemData } from '../types/typesInvoice';
import InvoicesList from '../components/invoiceList/invoicesList';

interface Item_Data extends ItemData {

  id: number;
}

interface Invoice_Data extends InvoiceData {

  id: number;
  items: Item_Data[];
}

const Invoices: React.FC = () => {

  const { invoices, loading, setSelectedInvoice } = useInvoice();
  const router = useRouter();

  const [localInvoices, setLocalInvoices] = useState<Invoice_Data[]>([]);

  useEffect(() => {

    if (Array.isArray(invoices)) {

      const mapped = invoices.map((invoice) => ({ ...invoice }));

      setLocalInvoices(mapped);

    } else {

      setLocalInvoices([]);
    }
  }, [invoices]);

  const handleRowClick = (invoice: Invoice_Data) => {

    setSelectedInvoice(invoice);
    router.push(`/invoiceList/invoiceDetails/invoice`);

  };

  if (loading) {

    return (
      <p className="text-center mt-10 text-lg text-gray-600">
        Data loading...
      </p>
    );
  }

  return (

    <div className="flex justify-center items-center bg-white p-6">
      <InvoicesList
        localInvoices={localInvoices}
        onRowClick={handleRowClick}
      />
    </div>
    
  );
};

export default Invoices;
