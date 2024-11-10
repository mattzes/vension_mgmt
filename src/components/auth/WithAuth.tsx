'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';

export const WithAuth = ({ children }: { children: React.ReactNode }) => {
  const { user } = useContext(AuthContext);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, pathname, router]);

  return <>{children};</>;
};
