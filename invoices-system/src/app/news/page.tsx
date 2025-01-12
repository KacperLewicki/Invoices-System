"use client";

import React from "react";

export default function NewsPage() {

  return (

    <div className="bg-gradient-to-br from-purple-600 to-purple-400 text-white text-center p-6 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
      <h1 className="text-2xl font-bold">Invoice System - Kacper Lewicki</h1>
      <p className="mt-2 text-lg">%%% Cała aplikacja tworzona jest w NEXT.js - React.js z pomocą TypeScript %%%</p>
      <p className="mt-2 text-lg">@@@ Prace nad aplikacją trwają do teraz @@@</p>
      <p className="mt-2 text-lg">W zakładce Powiadomienia, będziemy dostawać informacje o zmianach statusów w naszej fakturze + wiadmości od administratora.</p>
    </div>
  );
}
