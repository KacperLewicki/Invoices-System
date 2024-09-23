"use client";

import React from 'react';
import Link from 'next/link';

export default function Navigation () {

  return (

    <nav>
      <ul>
        
        <li>
          <Link href="/">Home</Link>
          <Link href="/createInvoice">Create Invoice</Link>
          <Link href="/news">News</Link>
        </li>
        
      </ul>
    </nav>

  );
};


