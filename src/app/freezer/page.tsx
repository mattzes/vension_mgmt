'use client';

import { FreezerTable } from '@/components/freezer/FreezerTable';
import * as React from 'react';
import withAuth from '@/hoc/withAuth';

function Home() {
  return <FreezerTable />;
}

export default withAuth(Home);
