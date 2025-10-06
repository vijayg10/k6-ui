import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <nav className="bg-dark-card border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-white">k6 Dashboard</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className={`${
                    isActive('/')
                      ? 'border-accent-purple text-white'
                      : 'border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-200'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Status
                </Link>
                <Link
                  to="/metrics"
                  className={`${
                    isActive('/metrics')
                      ? 'border-accent-purple text-white'
                      : 'border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-200'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Metrics
                </Link>
                <Link
                  to="/groups"
                  className={`${
                    isActive('/groups')
                      ? 'border-accent-purple text-white'
                      : 'border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-200'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Groups
                </Link>
                <Link
                  to="/control"
                  className={`${
                    isActive('/control')
                      ? 'border-accent-purple text-white'
                      : 'border-transparent text-gray-400 hover:border-gray-500 hover:text-gray-200'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Control
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
