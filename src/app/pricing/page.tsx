'use client';

import { PricingTable } from '@/components/pricing/PricingTable';
import withAuth from '@/hoc/withAuth';
import * as React from 'react';

function Home() {
  return <PricingTable />;
}

export default withAuth(Home);
