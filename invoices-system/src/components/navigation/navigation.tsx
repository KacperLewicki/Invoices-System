"use client";

import React from 'react';
import Link from 'next/link';

export default function Navigation () {

  return (

    <nav>
      <ul>
        
        <li>
          <Link href="/">Strona Główna</Link>
          <Link href="/news">Powiadomienia</Link>
          <Link href="/invoiceList">Lista Faktur</Link>
          <Link href="/createInvoice">Stwórz Fakture</Link>
        </li>
        
      </ul>
    </nav>

  );
};


