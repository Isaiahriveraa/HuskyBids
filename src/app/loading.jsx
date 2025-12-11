'use client';

import HuskyBidsLoader from '@/components/experimental/ui/HuskyBidsLoader';
import { useLoading } from './contexts/LoadingContext';

export default function GlobalLoading() {
  const { message } = useLoading();

  return (
    <div className="fixed inset-0 bg-zinc-950 bg-opacity-95 z-50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center p-8">
        <HuskyBidsLoader size="xl" centered />

        <p className="mt-6 text-zinc-600 font-mono text-xs">
          {message || 'Loading...'}
        </p>
      </div>
    </div>
  );
}
