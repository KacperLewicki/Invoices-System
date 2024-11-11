import React from 'react';
import Navigation from '@/components/navigation/navigation';
import "../globalCSS/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (

    <html lang="en">
      <head>
        <title>Invoice System</title>
      </head>

      <body className="bg-purple-100 min-h-screen flex flex-col items-center">
        <main className="w-full max-w-screen-2xl px-4 py-6 flex flex-col gap-6">
          
          <div className="w-full shadow-lg bg-purple-700 rounded-lg">

            <Navigation />

          </div>

          <div className="w-full bg-white rounded-lg shadow-lg p-6">

            {children}
            
          </div>

        </main>
      </body>
    </html>
  );
}
