'use client';

import { useQuery } from '@tanstack/react-query';
import { getHealth } from '@/lib/api/health.api';

export default function Home() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
    retry: 1,
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 p-8 text-white">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-lg font-semibold text-gray-300">System Health</h1>

        {isLoading && (
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 text-sm text-gray-500">
            Checking…
          </div>
        )}

        {isError && !isLoading && (
          <div className="rounded-lg border border-red-900 bg-red-950/40 p-6">
            <p className="text-sm font-medium text-red-400">API unreachable</p>
            <p className="mt-1 text-xs text-red-600">
              {process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}
            </p>
          </div>
        )}

        {data && (
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 space-y-3">
            <StatusRow
              label="API"
              value={data.status === 'ok' ? 'healthy' : 'unhealthy'}
              ok={data.status === 'ok'}
            />
            <StatusRow
              label="Database"
              value={data.database}
              ok={data.database === 'connected'}
            />
            {data.dbError && (
              <p className="text-xs text-red-500 break-all">{data.dbError}</p>
            )}
            <p className="pt-1 text-xs text-gray-600">
              Last checked: {new Date(data.timestamp).toLocaleTimeString()}
            </p>
          </div>
        )}

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="w-full rounded-md bg-gray-800 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700 disabled:opacity-40"
        >
          {isFetching ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
    </main>
  );
}

function StatusRow({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">{label}</span>
      <span className={`text-sm font-medium ${ok ? 'text-green-400' : 'text-red-400'}`}>
        {value}
      </span>
    </div>
  );
}
