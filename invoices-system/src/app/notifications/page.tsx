'use client';

import React, { useState, useMemo } from 'react';
import { useInvoice } from '../../hooks/context/invoiceContext';
import { ChatBox } from '../../components/chat/chatBox';
import { Message } from '../../types/typesInvoice';
import { InvoiceListChat } from '../../components/chat/invoiceListChat';

export default function Notifications() {

  const { invoices = [], selectedInvoice, setSelectedInvoice, loading, error } = useInvoice();
  const [searchTerm, setSearchTerm] = useState('');

  const mockMessages: Message[] = [
    { id: 1, content: 'Komentarz do wybranej faktury. Sprawdź proszę terminy płatności.', timestamp: '10:12', sender: 'Admin' },
    { id: 2, content: 'Faktura została zaktualizowana w systemie (stan: zaakceptowana).', timestamp: '10:30', sender: 'System' },
    { id: 3, content: 'Proszę zwrócić uwagę na poprawność danych nabywcy.', timestamp: '10:35', sender: 'Admin' },
  ];

  const filteredInvoices = useMemo(() => {

    if (!searchTerm) return invoices;

    const lower = searchTerm.toLowerCase();

    return invoices.filter(inv =>
      inv.nameInvoice.toLowerCase().includes(lower)
    );

  }, [searchTerm, invoices]);

  const handleSelectInvoice = (invoiceId: number) => {

    const found = invoices.find((inv) => inv.id === invoiceId) || null;
    setSelectedInvoice(found);
  };

  return (

    <div className="flex flex-col bg-gray-50">
      <div className="flex flex-col">
        <InvoiceListChat
          invoices={filteredInvoices}
          selectedInvoice={selectedInvoice}
          handleSelectInvoice={handleSelectInvoice}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          loading={loading}
          error={error} />
      </div>
      <ChatBox selectedInvoice={selectedInvoice} mockMessages={mockMessages} />
    </div>
  );
}
