'use client';

import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext'; // Adjust path based on where your AuthContext is located

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthHOC = (props: React.ComponentProps<typeof WrappedComponent>) => {
    const { user } = useContext(AuthContext); // Access authentication state
    const router = useRouter();

    if (!user) {
      router.push('/login');
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthHOC;
};

export default withAuth;
