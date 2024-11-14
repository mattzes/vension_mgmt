// 'use client';
import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthHOC = (props: React.ComponentProps<typeof WrappedComponent>) => {
    const { user } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.push('/login');
      }
    }, [user]);

    if (!user) return null;

    return <WrappedComponent {...props} />;
  };

  return AuthHOC;
};

export default withAuth;
