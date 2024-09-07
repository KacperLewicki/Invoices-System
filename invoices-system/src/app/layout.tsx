import React from 'react';
import Navigation from '@/components/navigation/navigation';
import "./CSS/layout.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (

    <html lang="en">

      <head>

        <title>Invoice System</title>

      </head>

      <body>
        <main>

          <div><Navigation /></div>

          <div>{children}</div>
          
        </main>
      </body>

    </html>
  );
}
