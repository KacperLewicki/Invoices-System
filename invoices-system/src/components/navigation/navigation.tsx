'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/context/authContext';
import { usePathname } from 'next/navigation';
import { FaHome, FaBell, FaFileInvoice, FaPlusCircle, FaUserShield, FaCog, FaSignOutAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import AccountInfoModal from '../userSettings/accountInfo';
import Settings from '../userSettings/settings';

interface NavigationProps {

  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navigation({ isCollapsed, setIsCollapsed }: NavigationProps) {

  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [isAccountInfoOpen, setIsAccountInfoOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const pathname = usePathname();

  const initials =
    user && typeof user.name === 'string'
      ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
      : 'IS';

  const toggleMenu = () => setShowMenu(!showMenu);

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

  const toggleCollapse = () => {

    setIsCollapsed(!isCollapsed);
  };

  return (

    <>
      <nav
        className={` bg-purple-700 text-white p-4 ${isCollapsed ? 'w-20' : 'w-64'} min-h-screen fixed top-0 left-0 shadow-lg flex flex-col justify-between transition-all duration-300 `}>
        <div>
          <div className="flex items-center justify-between mb-6">
            {!isCollapsed && (
              <button
                onClick={toggleMenu}
                className="bg-white text-purple-700 rounded-full flex items-center justify-center shadow-md"
                style={{ width: 48, height: 48 }}>
                {initials}
              </button>
            )}
            <button
              onClick={toggleCollapse}
              className="text-white p-1 rounded-full hover:bg-purple-600 transition ml-2"
              title={isCollapsed ? 'Expand menu' : 'Collapse menu'}>
              {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
          </div>

          {user && !isCollapsed && showMenu && (
            <div className="absolute left-20 top-4 bg-white text-gray-800 rounded-md shadow-lg p-2 space-y-2">
              <button
                onClick={openAccountInfo}
                className="block px-4 py-2 hover:bg-purple-100 rounded-md">
                Account Info
              </button>
              <button
                onClick={openSettings}
                className="block px-4 py-2 hover:bg-purple-100 rounded-md">
                Settings
              </button>
            </div>
          )}

          <ul className="mt-8 flex flex-col space-y-4 text-md font-medium">
            {user && (
              <>
                <li>
                  <Link
                    href="/home"
                    className="flex items-center px-2 py-2 rounded-md hover:bg-purple-600 transition">
                    <FaHome className="mr-2" />
                    {!isCollapsed && <span>Home</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/notifications"
                    className="flex items-center px-2 py-2 rounded-md hover:bg-purple-600 transition">
                    <FaBell className="mr-2" />
                    {!isCollapsed && <span>Notifications</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/invoiceList"
                    className="flex items-center px-2 py-2 rounded-md hover:bg-purple-600 transition">
                    <FaFileInvoice className="mr-2" />
                    {!isCollapsed && <span>Invoice List</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/createInvoice"
                    className="flex items-center px-2 py-2 rounded-md hover:bg-purple-600 transition">
                    <FaPlusCircle className="mr-2" />
                    {!isCollapsed && <span>Create Invoice</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin"
                    className="flex items-center px-2 py-2 rounded-md hover:bg-purple-600 transition">
                    <FaUserShield className="mr-2" />
                    {!isCollapsed && <span>Admin</span>}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={openSettings}
                    className="flex items-center px-2 py-2 rounded-md hover:bg-purple-600 transition">
                    <FaCog className="mr-2" />
                    {!isCollapsed && <span>Settings</span>}
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center px-2 py-2 rounded-md hover:bg-purple-600 transition mt-4">
            <FaSignOutAlt className="mr-2" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        )}
      </nav>

      {user && (  <AccountInfoModal
        isOpen={isAccountInfoOpen}
        onClose={() => setIsAccountInfoOpen(false)}
        user={user} />
        )}
  
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
