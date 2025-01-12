'use client';

import React, { useState } from 'react';
import Modal from '../modal/modal_popup';
import { changePassword } from '../../service/userSettings/settingsService';
import { ChangePasswordProps } from '../../types/typesInvoice';

const ChangePassword: React.FC<ChangePasswordProps> = ({ isOpen, onClose }) => {

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleChangePassword = async () => {

        if (newPassword !== confirmPassword) {

            setMessage('Nowe hasła nie są zgodne.');
            return;
        }

        const result = await changePassword(currentPassword, newPassword);

        setMessage(result.message);

        if (result.success) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
    };

    return (

        <Modal isOpen={isOpen} onClose={onClose} >
            <h2 className="text-2xl mb-6 font-semibold text-center">Zmień Hasło</h2>
            {message && <p className="mb-4 text-center text-violet-500">{message}</p>}
            <div className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Obecne Hasło</label>
                    <input
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Wprowadź obecne hasło"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Nowe Hasło</label>
                    <input
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Wprowadź nowe hasło"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Potwierdź Nowe Hasło</label>
                    <input
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Potwierdź nowe hasło"
                    />
                </div>
                <button
                    onClick={handleChangePassword}
                    className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-600 transition duration-200 mt-4">
                    Zmień Hasło
                </button>
            </div>
        </Modal>
    );
}

export default ChangePassword;
