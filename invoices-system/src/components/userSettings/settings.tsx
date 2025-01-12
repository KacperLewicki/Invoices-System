'use client';

import React, { useState } from 'react';
import Modal from '../modal/modal_popup';
import ChangePassword from './changePassword';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const Settings = ({ isOpen, onClose }: SettingsModalProps) => {

    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    const openChangePassword = () => {
        setIsChangePasswordOpen(true);
    };

    const closeChangePassword = () => {
        setIsChangePasswordOpen(false);
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <h2 className="text-2xl mb-6 font-semibold text-center">Ustawienia</h2>
                <div className="flex flex-col items-center">
                    <button
                        onClick={openChangePassword}
                        className="bg-purple-700 text-white py-2 px-6 rounded hover:bg-purple-600 transition duration-200">
                        Zmień hasło
                    </button>
                </div>
            </Modal>

            <ChangePassword
                isOpen={isChangePasswordOpen}
                onClose={closeChangePassword}
            />
        </>
    );
};

export default Settings;