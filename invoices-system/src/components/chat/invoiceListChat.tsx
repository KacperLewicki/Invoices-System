'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const InvoiceListChat = ({ invoices, selectedInvoice, handleSelectInvoice, searchTerm, setSearchTerm, loading, error }: any) => (

    <div className="bg-purple-700 p-4 shadow-md max-h-[250px] overflow-y-auto rounded-md">
        <div className="sticky top-0 bg-purple-700 z-10">
            <input
                type="text"
                placeholder="Search for an invoice..."
                className="w-full max-w-md rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
            {loading && <p className="text-white">Loading...</p>}
            {error && <p className="text-red-300">Error: {error}</p>}

            {Array.isArray(invoices) && invoices.map((inv: any) => (
                <motion.div
                    key={inv.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectInvoice(inv.id)}
                    className={`cursor-pointer p-2 rounded-lg transition shadow-md text-center ${selectedInvoice?.id === inv.id ? 'bg-purple-500 text-white' : 'bg-white text-purple-700 hover:bg-purple-200'}`}>
                    <div className="font-semibold text-sm">{inv.nameInvoice}</div>
                </motion.div>
            ))}
        </div>
    </div>
);
