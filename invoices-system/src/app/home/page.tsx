"use client";

import React from 'react';

export default function HomePage() {

  return (

    <div className="bg-gradient-to-br from-purple-600 to-purple-400 text-white text-center p-6 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
      <h1 className="text-2xl font-bold">Invoice System - Kacper Lewicki</h1>
      <p className="mt-2 text-lg">%%% Cała aplikacja tworzona jest w NEXT.js - React.js z pomocą TypeScript %%%</p>
      <p className="mt-2 text-lg">@@@ Prace nad aplikacją trwają do teraz @@@</p>
      <p className="mt-2 text-lg">W najbliższych aktualizacjach dojdzie zakładka Powiadomienia i Widok Administratora.</p>
      <p className="mt-2 text-lg">W ramach testów proszę o przydzielenie sobie statusów &Status dokumentu& podczas tworzenia faktury,
        najbardziej polecam wybrać status do poprawy bo wtedy można przejść cały proces odpowiedzialny za credit-note. Gdy zakładka Administrator będzie już dostępna i gotowa do użytku
        - powiekszy się możliwość manipulowania fakturami i ich statusami. Ale to już w krótce ;D, o dalszych aktualizacjach będę informował na stronie głównej appki i portfolio.</p>
    </div>
  );
}
