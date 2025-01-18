"use client";

import React from 'react';

export default function HomePage() {

  return (
    <div className="bg-gradient-to-br from-purple-600 to-purple-400 text-white text-center p-6 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
      <h1 className="text-2xl font-bold">Invoice System - Kacper Lewicki</h1>
      <p className="mt-2 text-lg">%%% The entire application is built in NEXT.js - React.js with the help of TypeScript %%%</p>
      <p className="mt-2 text-lg">@@@ Work on the application is ongoing @@@</p>
      <p className="mt-2 text-lg">In the upcoming updates, the Notifications tab and Administrator View will be added.</p>
      <p className="mt-2 text-lg">During testing, please assign yourself the statuses &Document Status& while creating an invoice. I highly recommend choosing the -Requires Correction- status as it allows you to go through the entire process responsible for credit notes. Once the Administrator tab is available and ready for use,
        the ability to manipulate invoices and their statuses will expand further. But that coming soon ;D. Further updates will be announced on the app homepage and portfolio.</p>
    </div>
  );
}
