import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
 
  return (
    
    <html lang="en">

      <head>

        <title>Invoice System</title>

      </head>

      <body>

        <main>{children}</main>

      </body>

    </html>
  );
}
