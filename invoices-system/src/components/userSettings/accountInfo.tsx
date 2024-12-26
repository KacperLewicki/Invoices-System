'use client';

import React from 'react';
import Modal from '../modal/modal_popup';
import { User } from '../../types/typesInvoice';

interface AccountInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const AccountInfoModal = ({ isOpen, onClose, user }: AccountInfoModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white p-6 rounded-lg max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-700">Informacje o koncie</h2>
        </div>
        {user ? (
          <div className="space-y-4">
            <div className="flex justify-between">
              <strong className="text-purple-600 w-1/3">Imię i nazwisko:</strong>
              <span className="w-2/3">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <strong className="text-purple-600 w-/3">Email:</strong>
              <span className="w-2/3">{user.email}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Ładowanie danych użytkownika...</p>
        )}
      </div>
    </Modal>
  );
};

export default AccountInfoModal;
