'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AccountInfoModal from '../login/accountInfoModal';
import SettingsModal from '../login/settingsModal';
import { useAuth } from '../../components/context/autoContext';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [isAccountInfoOpen, setIsAccountInfoOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const pathname = usePathname();

  const initials = user
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '';

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const openAccountInfo = () => {
    setShowMenu(false);
    setIsAccountInfoOpen(true);
  };

  const openSettings = () => {
    setShowMenu(false);
    setIsSettingsOpen(true);
  };

  return (
    <>
      <nav className="flex justify-between items-center bg-purple-700 p-4 rounded-lg shadow-lg">
        <ul className="flex space-x-6 text-white font-semibold">
          <li>
            <Link href="/" className="hover:bg-purple-500 px-3 py-2 rounded-md transition duration-200">
              Strona Główna
            </Link>
          </li>

          {user && (
            // Jeśli użytkownik jest zalogowany, wyświetl pozostałe linki
            <>
              <li>
                <Link href="/news" className="hover:bg-purple-500 px-3 py-2 rounded-md transition duration-200">
                  Powiadomienia
                </Link>
              </li>
              <li>
                <Link href="/invoiceList" className="hover:bg-purple-500 px-3 py-2 rounded-md transition duration-200">
                  Lista Faktur
                </Link>
              </li>
              <li>
                <Link href="/createInvoice" className="hover:bg-purple-500 px-3 py-2 rounded-md transition duration-200">
                  Stwórz Fakturę
                </Link>
              </li>
              <li>
                <Link href="/administrator" className="hover:bg-purple-500 px-3 py-2 rounded-md transition duration-200">
                  Administrator
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Jeśli użytkownik nie jest zalogowany, wyświetl przycisk "Zaloguj" po prawej stronie nawigacji */}
        {!user && pathname === '/' && (
          <div>
            <Link href="/login">
              <button className="bg-white text-purple-700 font-semibold py-2 px-4 rounded hover:bg-purple-100 transition duration-200">
                Zaloguj
              </button>
            </Link>
          </div>
        )}

        {user && (
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="w-10 h-10 bg-white text-purple-700 rounded-full flex items-center justify-center"
            >
              {initials}
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg">
                <button
                  onClick={openAccountInfo}
                  className="block w-full text-left px-4 py-2 hover:bg-purple-100"
                >
                  Informacje o koncie
                </button>
                <button
                  onClick={openSettings}
                  className="block w-full text-left px-4 py-2 hover:bg-purple-100"
                >
                  Ustawienia
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-purple-100"
                >
                  Wyloguj
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Modale */}
      <AccountInfoModal
        isOpen={isAccountInfoOpen}
        onClose={() => setIsAccountInfoOpen(false)}
        user={user}
      />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
