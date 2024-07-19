"use client";

import React from 'react';

const Invoice = () => {

  const handleClick = () => {
    console.log('Invoice clicked');
  };

  return (
    <div>
      <h1>hej</h1>
        <button onClick={handleClick}>Click me</button>
    </div>
  );
};

export default Invoice;