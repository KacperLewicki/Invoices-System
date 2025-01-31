"use client";

import React from "react";

interface ConfirmationOverlayProps {

  onBackToInvoiceList: () => void;
  message?: string;

}

const ConfirmationOverlay: React.FC<ConfirmationOverlayProps> = ({

  onBackToInvoiceList,
  message = "Your corrected invoice was sent",

}) => {
    
  return (
    
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl mb-4 font-semibold text-center">
          Data has been sent
        </h2>
        <p className="mb-4 text-center">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onBackToInvoiceList}
            className="bg-purple-800 text-white py-2 px-6 rounded-lg shadow-md hover:bg-purple-900">
            Back to Invoice List
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationOverlay;
