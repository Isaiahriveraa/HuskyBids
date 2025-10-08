'use client';

import { Providers } from './providers';
import AppLayout from './AppLayout';

export default function ClientRoot({ children }) {
  return (
    <Providers>
      <AppLayout>
        {children}
      </AppLayout>
    </Providers>
  );
}