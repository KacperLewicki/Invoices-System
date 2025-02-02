'use client';

import React, { useState } from 'react';
import Navigation from '../navigation/navigation';

interface NavigationWrapperProps {
  children: React.ReactNode;
}

export default function NavigationWrapper({ children }: NavigationWrapperProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
  
    <div className="flex">
      <Navigation isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className={`flex-1 p-4 transition-all duration-300  ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        {children}
      </main>
    </div>
  );
}
