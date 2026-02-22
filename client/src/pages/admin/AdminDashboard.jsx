import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package, ShoppingBag, Users } from 'lucide-react';
import Loading from '../../components/Loading';
import { productAPI, adminAPI } from '../../utils/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        customers: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const data = await adminAPI.getStats();
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch dashboard stats:', err);
                setStats({ products: 0, orders: 0, customers: 0 });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <Loading message="Preparing dashboard..." />;

    return (
        <div className="admin-dashboard">
            <h1 className="mb-4">Dashboard Overview</h1>

            <div className="stats-grid mb-4">
                <div className="stat-card">
                    <div className="stat-icon bg-green">
                        <Package size={24} color="#1a472a" />
                    </div>
                    <div>
                        <h3>Total Products</h3>
                        <p className="stat-value">{stats.products}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon bg-gold">
                        <ShoppingBag size={24} color="#c5a059" />
                    </div>
                    <div>
                        <h3>Total Orders</h3>
                        <p className="stat-value">{stats.orders}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon bg-blue">
                        <Users size={24} color="#3b82f6" />
                    </div>
                    <div>
                        <h3>Total Customers</h3>
                        <p className="stat-value">{stats.customers}</p>
                    </div>
                </div>
            </div>

            <div className="quick-actions-section">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <Link to="/admin/products/new" className="action-card">
                        <Plus size={30} />
                        <span>Add New Product</span>
                    </Link>
                    <Link to="/admin/products" className="action-card">
                        <Package size={30} />
                        <span>Manage Stock</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
