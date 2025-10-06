import { useState } from 'react';
import { k6Api } from '../services/k6Api';

export default function ControlPage() {
  const [vus, setVus] = useState('');
  const [vusMax, setVusMax] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);

  const showMessage = (text, type = 'success', response = null) => {
    setMessage({ text, type });
    setLastResponse(response);
    setTimeout(() => setMessage(null), 10000);
  };

  const handleSetVUs = async (e) => {
    e.preventDefault();
    if (!vus) return;

    setLoading(true);
    try {
      const vusNum = parseInt(vus);
      const vusMaxNum = vusMax ? parseInt(vusMax) : null;
      const response = await k6Api.setVUs(vusNum, vusMaxNum);
      showMessage(`VUs updated successfully: ${vusNum}${vusMaxNum ? ` (max: ${vusMaxNum})` : ''}`, 'success', response);
      setVus('');
      setVusMax('');
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async () => {
    setLoading(true);
    try {
      const response = await k6Api.pauseTest();
      showMessage('Test paused successfully', 'success', response);
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    setLoading(true);
    try {
      const response = await k6Api.resumeTest();
      showMessage('Test resumed successfully', 'success', response);
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    if (!window.confirm('Are you sure you want to stop the test?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await k6Api.stopTest();
      showMessage('Test stopped successfully', 'success', response);
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Test Control</h2>

      {message && (
        <div
          className={`rounded-lg p-4 border ${
            message.type === 'error'
              ? 'bg-red-900/20 border-red-800 text-red-400'
              : 'bg-green-900/20 border-green-800 text-green-400'
          }`}
        >
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      {lastResponse && (
        <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-white mb-4">Last Response</h3>
            <pre className="bg-dark-bg border border-dark-border p-4 rounded text-sm overflow-auto max-h-96 text-gray-300">
              {JSON.stringify(lastResponse, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-white mb-4">Adjust Virtual Users</h3>
          <form onSubmit={handleSetVUs} className="space-y-4">
            <div>
              <label htmlFor="vus" className="block text-sm font-medium text-gray-300">
                VUs
              </label>
              <input
                type="number"
                id="vus"
                min="0"
                value={vus}
                onChange={(e) => setVus(e.target.value)}
                className="mt-1 block w-full rounded-md bg-dark-bg border-dark-border text-white shadow-sm focus:border-accent-purple focus:ring-accent-purple sm:text-sm px-3 py-2 border"
                placeholder="Enter number of VUs"
                required
              />
            </div>
            <div>
              <label htmlFor="vusMax" className="block text-sm font-medium text-gray-300">
                VUs Max (Optional)
              </label>
              <input
                type="number"
                id="vusMax"
                min="0"
                value={vusMax}
                onChange={(e) => setVusMax(e.target.value)}
                className="mt-1 block w-full rounded-md bg-dark-bg border-dark-border text-white shadow-sm focus:border-accent-purple focus:ring-accent-purple sm:text-sm px-3 py-2 border"
                placeholder="Enter max number of VUs"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-purple hover:bg-accent-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-purple disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Set VUs'}
            </button>
          </form>
        </div>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-white mb-4">Test Execution Control</h3>
          <div className="space-y-3">
            <button
              onClick={handlePause}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-yellow-600/50 rounded-md text-sm font-medium text-yellow-300 bg-yellow-900/40 hover:bg-yellow-900/50 focus:outline-none focus:ring-2 focus:ring-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pause Test
            </button>
            <button
              onClick={handleResume}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-green-600/50 rounded-md text-sm font-medium text-green-300 bg-green-900/40 hover:bg-green-900/50 focus:outline-none focus:ring-2 focus:ring-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Resume Test
            </button>
            <button
              onClick={handleStop}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-red-600/50 rounded-md text-sm font-medium text-red-300 bg-red-900/40 hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Stop Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
