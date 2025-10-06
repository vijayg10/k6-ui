import { useState, useEffect } from 'react';
import { k6Api } from '../services/k6Api';

export default function GroupsPage() {
  const [groups, setGroups] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchGroups = async () => {
    try {
      setError(null);
      const data = await k6Api.getGroups();
      setGroups(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupDetail = async (id) => {
    setDetailLoading(true);
    try {
      const data = await k6Api.getGroup(id);
      setSelectedGroup(data);
    } catch (err) {
      console.error('Failed to fetch group detail:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
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
          onClick={fetchGroups}
          className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const groupsData = (groups?.data || []).sort((a, b) => {
    const nameA = a.attributes?.name || '';
    const nameB = b.attributes?.name || '';
    return nameA.localeCompare(nameB);
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Groups</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Total: {groupsData.length} groups
          </div>
          <button
            onClick={fetchGroups}
            disabled={loading}
            className="px-4 py-2 bg-accent-purple text-white rounded-md hover:bg-accent-purple-dark disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {groupsData.length === 0 ? (
        <div className="bg-yellow-500/20 border border-yellow-600 rounded-lg p-4">
          <p className="text-yellow-400">No groups available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {groupsData.map((group) => {
            const attrs = group.attributes || {};
            const checks = attrs.checks || [];
            const hasChecks = checks.length > 0;

            return (
              <div
                key={group.id}
                className="bg-dark-card border border-dark-border rounded-lg overflow-hidden"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white break-words">
                        {attrs.name || '(Root Group)'}
                      </h3>
                      {attrs.path && (
                        <p className="text-sm text-gray-400 mt-1">
                          Path: {attrs.path}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => fetchGroupDetail(group.id)}
                      className="ml-4 text-sm text-accent-purple hover:text-accent-purple-dark"
                    >
                      View Details
                    </button>
                  </div>

                  {hasChecks && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">
                        Checks ({checks.length})
                      </h4>
                      <div className="space-y-2">
                        {checks.map((check) => {
                          const total = check.passes + check.fails;
                          const passRate = total > 0 ? (check.passes / total) * 100 : 0;

                          return (
                            <div
                              key={check.id}
                              className="bg-dark-bg border border-dark-border rounded p-3"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <p className="text-sm font-medium text-white break-words flex-1">
                                  {check.name}
                                </p>
                                <span
                                  className={`ml-2 text-xs font-semibold ${
                                    passRate === 100
                                      ? 'text-green-400'
                                      : passRate === 0
                                      ? 'text-red-400'
                                      : 'text-yellow-400'
                                  }`}
                                >
                                  {passRate.toFixed(1)}%
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-xs">
                                <div>
                                  <span className="text-gray-400">Passes: </span>
                                  <span className="text-green-400 font-medium">
                                    {check.passes}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Fails: </span>
                                  <span className="text-red-400 font-medium">
                                    {check.fails}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Total: </span>
                                  <span className="text-white font-medium">{total}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {!hasChecks && (
                    <p className="text-sm text-gray-400 mt-2">No checks in this group</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedGroup && (
        <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Selected Group Detail</h3>
              <button
                onClick={() => setSelectedGroup(null)}
                className="text-sm text-gray-400 hover:text-gray-300"
              >
                Close
              </button>
            </div>
            {detailLoading ? (
              <div className="text-gray-400">Loading details...</div>
            ) : (
              <pre className="bg-dark-bg border border-dark-border p-4 rounded text-sm overflow-auto max-h-96 text-gray-300">
                {JSON.stringify(selectedGroup, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}

      <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-white mb-4">Raw Response</h3>
          <pre className="bg-dark-bg border border-dark-border p-4 rounded text-sm overflow-auto max-h-96 text-gray-300">
            {JSON.stringify(groups, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
