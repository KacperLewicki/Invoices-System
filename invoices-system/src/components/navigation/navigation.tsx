"use client";

import React from 'react';
import Link from 'next/link';

export default function Navigation() {

  return (

    <nav className="flex justify-around items-center bg-purple-700 p-4 rounded-lg shadow-lg">

      <ul className="flex space-x-6 text-white font-semibold">
        <li>
          <Link href="/" className="hover:bg-purple-500 px-3 py-2 rounded-md transition duration-200">Strona Główna</Link>
        </li>
        <li>
          <Link href="/news" className="hover:bg-purple-500 px-3 py-2 rounded-md transition duration-200">Powiadomienia</Link>
        </li>
        <li>
          <Link href="/invoiceList" className="hover:bg-purple-500 px-3 py-2 rounded-md transition duration-200">Lista Faktur</Link>
        </li>
        <li>
          <Link href="/createInvoice" className="hover:bg-purple-500 px-3 py-2 rounded-md transition duration-200">Stwórz Fakturę</Link>
        </li>
        <li>
          <Link href="/administrator" className="hover:bg-purple-500 px-3 py-2 rounded-md transition duration-200">Administrator</Link>
        </li>
      </ul>
    </nav>
  );
}
