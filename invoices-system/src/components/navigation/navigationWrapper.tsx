'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '../navigation/navigation';
import { useAuth } from '../../hooks/context/authContext';

interface NavigationWrapperProps {
  children: React.ReactNode;
}

export default function NavigationWrapper({ children }: NavigationWrapperProps) {

  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();

  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {

    setFadeIn(true);
    
  }, []);

  return (
    <>
      <Navigation isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        className={` transition-all duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'} ${user ? isCollapsed ? 'ml-20' : 'ml-64' : isCollapsed ? 'ml-0' : 'ml-0'}`}>
        {children}
      </main>
    </>
  );
}
