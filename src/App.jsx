import { Routes, Route, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProtectedRoutes from './components/ProtectedRoutes';
import './App.css'
import UserMangement from './pages/UserMangement';
import Profile from './pages/Profile';
import Packages from './pages/Packages';
import Subscriptions from './pages/Subscriptions';

// Layout component for dashboard pages (Sidebar + Content)
const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/user-management" element={<UserMangement />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          
        </Route>
      </Route>
    </Routes>
  )
}

export default App
