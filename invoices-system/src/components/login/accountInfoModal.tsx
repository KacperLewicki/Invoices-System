'use client';

import React from 'react';
import Modal from './modal';
import { User } from '../../hooks/context/autoContext';

interface AccountInfoModalProps {

  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const  AccountInfoModal = ({ isOpen, onClose, user }: AccountInfoModalProps) => {

  return (
    
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl mb-4">Informacje o koncie</h2>
      {user ? (
        <div>
          <p>
            <strong>Imię i nazwisko:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      ) : (
        <p>Ładowanie danych użytkownika...</p>
      )}
    </Modal>
  );
}
export default AccountInfoModal;