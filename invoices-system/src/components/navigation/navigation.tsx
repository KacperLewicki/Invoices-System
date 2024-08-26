"use client";

import React from 'react';
import Link from 'next/link';

const Navigation = () => {

  return (

    <nav>
      <ul>
        <li>
          <Link href="/createInvoice/createInvoicePage">Create Invoice Page</Link>
        </li>
      </ul>
    </nav>

  );
};

export default Navigation;

