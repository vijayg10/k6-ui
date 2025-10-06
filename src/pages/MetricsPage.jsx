import { useState, useEffect } from 'react';
import { k6Api } from '../services/k6Api';

export default function MetricsPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    try {
      setError(null);
      const data = await k6Api.getMetrics();
      setMetrics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
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
          onClick={fetchMetrics}
          className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const metricsData = (metrics?.data || []).sort((a, b) => a.id.localeCompare(b.id));

  const formatValue = (value, contains) => {
    if (typeof value === 'number') {
      // Format time values (milliseconds)
      if (contains === 'time') {
        if (value >= 1000) {
          return `${(value / 1000).toFixed(2)}s`;
        }
        return `${value.toFixed(2)}ms`;
      }
      // Format data values (bytes)
      if (contains === 'data') {
        if (value >= 1024 * 1024) {
          return `${(value / (1024 * 1024)).toFixed(2)} MB`;
        }
        if (value >= 1024) {
          return `${(value / 1024).toFixed(2)} KB`;
        }
        return `${value.toFixed(0)} B`;
      }
      // Format rate values (0-1)
      if (value >= 0 && value <= 1) {
        return `${(value * 100).toFixed(2)}%`;
      }
      // Default formatting
      return value.toFixed(2);
    }
    return value;
  };

  const formatMetricName = (name) => {
    return name.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Metrics</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Total: {metricsData.length} metrics
          </div>
          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="px-4 py-2 bg-accent-purple text-white rounded-md hover:bg-accent-purple-dark disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {metricsData.length === 0 ? (
        <div className="bg-yellow-500/20 border border-yellow-600 rounded-lg p-4">
          <p className="text-yellow-400">No metrics available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metricsData.map((metric) => {
            const attrs = metric.attributes || {};
            const sample = attrs.sample || {};

            return (
              <div key={metric.id} className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-base font-semibold text-white break-words">
                      {formatMetricName(metric.id)}
                    </h3>
                    {attrs.tainted && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400">
                        Failed
                      </span>
                    )}
                  </div>

                  <dl className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <dt className="text-gray-400">Type</dt>
                      <dd className="font-medium text-gray-300">{attrs.type}</dd>
                    </div>

                    {/* Display sample values */}
                    {sample.value !== undefined && (
                      <div className="flex justify-between pt-2 border-t border-dark-border">
                        <dt className="text-sm font-medium text-gray-400">Value</dt>
                        <dd className="text-sm font-bold text-accent-purple">
                          {formatValue(sample.value, attrs.contains)}
                        </dd>
                      </div>
                    )}

                    {sample.count !== undefined && (
                      <div className="flex justify-between pt-2 border-t border-dark-border">
                        <dt className="text-sm font-medium text-gray-400">Count</dt>
                        <dd className="text-sm font-bold text-accent-purple">
                          {formatValue(sample.count, attrs.contains)}
                        </dd>
                      </div>
                    )}

                    {sample.rate !== undefined && sample.count === undefined && (
                      <div className="flex justify-between pt-2 border-t border-dark-border">
                        <dt className="text-sm font-medium text-gray-400">Rate</dt>
                        <dd className="text-sm font-bold text-accent-purple">
                          {formatValue(sample.rate, attrs.contains)}
                        </dd>
                      </div>
                    )}

                    {sample.rate !== undefined && sample.count !== undefined && (
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-400">Rate</dt>
                        <dd className="text-sm font-medium text-gray-300">
                          {formatValue(sample.rate, attrs.contains)}/s
                        </dd>
                      </div>
                    )}

                    {/* Trend metrics */}
                    {sample.avg !== undefined && (
                      <>
                        <div className="flex justify-between pt-2 border-t border-dark-border">
                          <dt className="text-sm text-gray-400">Avg</dt>
                          <dd className="text-sm font-medium text-gray-300">
                            {formatValue(sample.avg, attrs.contains)}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">Min</dt>
                          <dd className="text-sm font-medium text-gray-300">
                            {formatValue(sample.min, attrs.contains)}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">Max</dt>
                          <dd className="text-sm font-medium text-gray-300">
                            {formatValue(sample.max, attrs.contains)}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">Median</dt>
                          <dd className="text-sm font-medium text-gray-300">
                            {formatValue(sample.med, attrs.contains)}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">P90</dt>
                          <dd className="text-sm font-medium text-gray-300">
                            {formatValue(sample['p(90)'], attrs.contains)}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-400">P95</dt>
                          <dd className="text-sm font-medium text-gray-300">
                            {formatValue(sample['p(95)'], attrs.contains)}
                          </dd>
                        </div>
                      </>
                    )}
                  </dl>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-white mb-4">Raw Response</h3>
          <pre className="bg-dark-bg border border-dark-border p-4 rounded text-sm overflow-auto max-h-96 text-gray-300">
            {JSON.stringify(metrics, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
