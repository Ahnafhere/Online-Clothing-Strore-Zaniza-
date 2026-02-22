import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingBag, LogOut } from 'lucide-react';
import { adminAPI } from '../utils/api';
import zanizaLogo from '../assets/zaniza-logo.png';
import './AdminLayout.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        const fetchPendingCount = async () => {
            try {
                const data = await adminAPI.getPendingOrdersCount();
                setPendingCount(data.count);
            } catch (err) {
                console.error('Failed to fetch pending orders count:', err);
            }
        };
        fetchPendingCount();

        // Refresh count every 30 seconds
        const interval = setInterval(fetchPendingCount, 30000);

        // Listen for manual refresh requests from AdminOrders page
        window.addEventListener('refreshPendingCount', fetchPendingCount);

        return () => {
            clearInterval(interval);
            window.removeEventListener('refreshPendingCount', fetchPendingCount);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <Link to="/">
                        <img src={zanizaLogo} alt="Zaniza" className="admin-sidebar-logo" />
                    </Link>
                    <span className="admin-label">Admin Panel</span>
                </div>
                <nav className="admin-nav">
                    <Link to="/admin" className="admin-nav-item">
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link to="/admin/products" className="admin-nav-item">
                        <Package size={20} /> Products
                    </Link>
                    <Link to="/admin/orders" className="admin-nav-item">
                        <ShoppingBag size={20} /> Orders
                        {pendingCount > 0 && <span className="notification-dot"></span>}
                    </Link>
                </nav>
                <div className="admin-footer">
                    <button onClick={handleLogout} className="admin-nav-item logout-btn">
                        <LogOut size={20} /> Logout
                    </button>
                    <Link to="/" className="admin-nav-item mt-2">
                        Back to Site
                    </Link>
                </div>
            </aside>
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
