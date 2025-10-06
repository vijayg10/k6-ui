import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import StatusPage from './pages/StatusPage';
import MetricsPage from './pages/MetricsPage';
import ControlPage from './pages/ControlPage';
import GroupsPage from './pages/GroupsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<StatusPage />} />
          <Route path="metrics" element={<MetricsPage />} />
          <Route path="control" element={<ControlPage />} />
          <Route path="groups" element={<GroupsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
