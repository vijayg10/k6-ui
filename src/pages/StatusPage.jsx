import { useState, useEffect } from 'react';
import { k6Api } from '../services/k6Api';

export default function StatusPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    try {
      setError(null);
      const data = await k6Api.getStatus();
      setStatus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
        <p className="text-red-400">Error: {error}</p>
        <button
          onClick={fetchStatus}
          className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const attributes = status?.data?.attributes || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Test Status</h2>
        <button
          onClick={fetchStatus}
          disabled={loading}
          className="px-4 py-2 bg-accent-purple text-white rounded-md hover:bg-accent-purple-dark disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-400">Status</dt>
              <dd className="mt-1 text-lg font-semibold">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                    attributes.paused
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : attributes.stopped
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-green-500/20 text-green-400'
                  }`}
                >
                  {attributes.stopped ? 'Stopped' : attributes.paused ? 'Paused' : 'Running'}
                </span>
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-400">Running</dt>
              <dd className="mt-1 text-lg font-semibold text-white">
                {attributes.running ? 'Yes' : 'No'}
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-400">Current VUs</dt>
              <dd className="mt-1 text-lg font-semibold text-white">
                {attributes.vus !== undefined ? attributes.vus : 'N/A'}
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-400">Max VUs</dt>
              <dd className="mt-1 text-lg font-semibold text-white">
                {attributes['vus-max'] !== undefined ? attributes['vus-max'] : 'N/A'}
              </dd>
            </div>

            {attributes.tainted !== undefined && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-400">Tainted</dt>
                <dd className="mt-1 text-lg font-semibold text-white">
                  {attributes.tainted ? 'Yes' : 'No'}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-white mb-4">Raw Response</h3>
          <pre className="bg-dark-bg border border-dark-border p-4 rounded text-sm overflow-auto max-h-96 text-gray-300">
            {JSON.stringify(status, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
