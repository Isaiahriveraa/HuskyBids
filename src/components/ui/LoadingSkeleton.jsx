'use client';

import React from 'react';

export const SkeletonCard = () => (
  <div className="bg-zinc-900 p-6 rounded-lg shadow animate-pulse">
    <div className="h-4 bg-zinc-700 rounded w-1/3 mb-4"></div>
    <div className="h-10 bg-zinc-700 rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-zinc-700 rounded w-2/3"></div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="bg-zinc-900 p-6 rounded-lg shadow animate-pulse">
    <div className="h-4 bg-zinc-700 rounded w-1/3 mb-4"></div>
    <div className="h-10 bg-zinc-700 rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-zinc-700 rounded w-2/3"></div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="h-4 bg-zinc-700 rounded w-12"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-zinc-700 rounded w-32"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-zinc-700 rounded w-20 ml-auto"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-zinc-700 rounded w-16 ml-auto"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-zinc-700 rounded w-12 ml-auto"></div>
    </td>
  </tr>
);

export const GameCardSkeleton = () => (
  <div className="p-3 bg-zinc-900 rounded-lg animate-pulse border border-dotted border-zinc-800">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-5 bg-zinc-700 rounded w-40 mb-2"></div>
        <div className="h-4 bg-zinc-700 rounded w-48"></div>
      </div>
      <div className="text-right">
        <div className="h-4 bg-zinc-700 rounded w-16 mb-2 ml-auto"></div>
        <div className="h-3 bg-zinc-700 rounded w-20 ml-auto"></div>
      </div>
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="p-6">
    <div className="mb-6 animate-pulse">
      <div className="h-8 bg-zinc-700 rounded w-64 mb-2"></div>
      <div className="h-4 bg-zinc-700 rounded w-80"></div>
    </div>

    {/* Main Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>

    {/* Secondary Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[1, 2, 3].map((i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>

    {/* Recent Activity */}
    <div className="bg-zinc-900 p-6 rounded-lg shadow mb-8 animate-pulse border border-dotted border-zinc-800">
      <div className="h-6 bg-zinc-700 rounded w-40 mb-4"></div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 bg-zinc-800 rounded-lg">
            <div className="h-5 bg-zinc-600 rounded w-48 mb-2"></div>
            <div className="h-4 bg-zinc-600 rounded w-64 mb-1"></div>
            <div className="h-3 bg-zinc-600 rounded w-32"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const LeaderboardSkeleton = () => (
  <div className="p-8">
    <div className="mb-8 animate-pulse">
      <div className="h-8 bg-zinc-700 rounded w-48 mb-2"></div>
      <div className="h-4 bg-zinc-700 rounded w-80"></div>
    </div>

    {/* Podium Skeleton */}
    <div className="mb-12">
      <div className="flex justify-center items-end space-x-8 h-64">
        {[140, 208, 128].map((height, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="h-5 bg-zinc-700 rounded w-24 mb-2"></div>
            <div
              className="w-32 bg-zinc-700 rounded-t-lg animate-pulse"
              style={{ height: `${height}px` }}
            ></div>
          </div>
        ))}
      </div>
    </div>

    {/* Table Skeleton */}
    <div className="bg-zinc-900 rounded-lg shadow-md overflow-hidden border border-dotted border-zinc-800">
      <table className="w-full">
        <thead className="bg-zinc-800">
          <tr>
            <th className="px-6 py-3 text-left text-zinc-400">Rank</th>
            <th className="px-6 py-3 text-left text-zinc-400">Username</th>
            <th className="px-6 py-3 text-right text-zinc-400">Biscuits</th>
            <th className="px-6 py-3 text-right text-zinc-400">Win Rate</th>
            <th className="px-6 py-3 text-right text-zinc-400">Total Bets</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <TableRowSkeleton key={i} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
