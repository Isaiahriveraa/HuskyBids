'use client';

import { useState, useEffect } from 'react';

export default function MongoDBStatus() {
  const [status, setStatus] = useState({ loading: true, connected: false, error: null });

  useEffect(() => {
    async function checkConnection() {
      try {
        const res = await fetch('/api/test-db');
        const data = await res.json();

        setStatus({
          loading: false,
          connected: data.success,
          error: data.success ? null : 'Connection failed',
          details: data
        });
      } catch (error) {
        setStatus({
          loading: false,
          connected: false,
          error: error.message
        });
      }
    }

    checkConnection();
  }, []);

  if (status.loading) {
    return (
      <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm flex items-center gap-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        <span className="text-gray-600">Checking DB...</span>
      </div>
    );
  }

  if (status.connected) {
    return (
      <div className="bg-green-50 border border-green-300 rounded-lg px-3 py-2 text-sm flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-green-700 font-medium">MongoDB Connected</span>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-300 rounded-lg px-3 py-2 text-sm flex items-center gap-2">
      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
      <span className="text-red-700 font-medium">DB Error: {status.error}</span>
    </div>
  );
}
