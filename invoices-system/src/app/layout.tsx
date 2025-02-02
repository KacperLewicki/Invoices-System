import { ReactNode } from 'react';
import "../globalCSS/globals.css";
import { InvoiceProvider } from '../hooks/context/invoiceContext';
import { AuthProvider } from '../hooks/context/authContext';

import NavigationWrapper from '../components/navigation/navigationWrapper';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    
    <html lang="en">
      <body className="bg-purple-50 text-gray-800 overflow-auto min-h-screen">
        <AuthProvider>
          <InvoiceProvider>
            <NavigationWrapper>
              {children}
            </NavigationWrapper>
          </InvoiceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
