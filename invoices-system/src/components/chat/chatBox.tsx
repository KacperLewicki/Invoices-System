'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Message } from '../../types/typesInvoice';

export const ChatBox = ({ selectedInvoice, mockMessages }: any) => (

    <div className="flex-1 p-4 overflow-hidden">

        {selectedInvoice ? (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white shadow-md rounded-lg p-6 h-full max-h-[calc(100vh-300px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">

                <h3 className="text-xl font-semibold mb-4 text-gray-800"> Comments on: {selectedInvoice.nameInvoice} </h3>

                <div className="space-y-4">

                    {mockMessages.map((msg: Message) => (
                        <motion.div
                            key={msg.id}
                            whileHover={{ scale: 1.02 }}
                            className={`p-4 rounded-md shadow-sm ${msg.sender === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                            <div className="font-medium text-sm">{msg.sender}</div>
                            <div className="mt-1">{msg.content}</div>
                            <div className="text-xs text-gray-500 mt-2">{msg.timestamp}</div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        ) : (
            <p className="text-gray-500 text-center mt-10">Select an invoice from the list above to see the comments.</p>
        )}
    </div>
);