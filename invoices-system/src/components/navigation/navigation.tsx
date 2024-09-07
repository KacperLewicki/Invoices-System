"use client";

import React from 'react';
import Link from 'next/link';

export default function Navigation () {

  return (

    <nav>
      <ul>
        
        <li>
          <Link href="/">Home</Link>
        </li>

        <li>
          <Link href="/createInvoice">Create Invoice Page</Link>
        </li>
        
      </ul>
    </nav>

  );
};


