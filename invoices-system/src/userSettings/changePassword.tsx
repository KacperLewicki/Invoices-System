'use client';

import React, { useState } from 'react';
import Modal from '../components/modal/modal_popup';
import { changePassword } from '../service/userSettings/settingsService';
import { ChangePasswordProps } from '../types/typesInvoice';

const ChangePassword: React.FC<ChangePasswordProps> = ({ isOpen, onClose }) => {

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleChangePassword = async () => {

        if (newPassword !== confirmPassword) {

            setMessage('The new passwords are not consistent.');
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
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <h2 className="text-2xl mb-6 font-semibold text-center">Change Password</h2>
                {message && <p className="mb-4 text-center text-violet-500">{message}</p>}
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Current Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password" />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">New Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password" />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Confirm New Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password" />
                    </div>
                    <button
                        onClick={handleChangePassword}
                        className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-600 transition duration-200 mt-4">
                        Change Password
                    </button>
                </div>
            </Modal>
        </>
    );

}

export default ChangePassword;
