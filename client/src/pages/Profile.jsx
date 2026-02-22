import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI, authAPI } from '../utils/api';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get user from localStorage initially
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        setUser(JSON.parse(storedUser));

        // Fetch user's orders AND fresh user profile
        Promise.all([orderAPI.getMyOrders(), authAPI.getMe()])
            .then(([ordersData, userData]) => {
                setOrders(ordersData);
                // Update user with fresh data from DB (includes email if missing locally)
                if (userData) {
                    setUser(userData);
                    // Update local storage too
                    localStorage.setItem('user', JSON.stringify(userData));
                    window.dispatchEvent(new Event('auth-change'));
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [navigate]);

    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return parts[0][0] + parts[1][0];
        }
        return name[0].toUpperCase();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (!user) return null;

    return (
        <div className="profile-page section-padding">
            <div className="container">
                <div className="profile-header">
                    {user.image ? (
                        <img src={user.image} alt={user.name} className="profile-avatar-lg" />
                    ) : (
                        <div className="profile-avatar-lg profile-initials-lg">
                            {getInitials(user.name)}
                        </div>
                    )}
                    <div className="profile-info">
                        <h1>{user.name}</h1>
                        <p className="profile-email">{user.email || 'No email provided'}</p>
                        <span className="profile-role">{user.role === 'admin' ? 'Administrator' : 'Customer'}</span>
                    </div>
                </div>

                <div className="profile-content">
                    <div className="profile-section">
                        <h2>Order History</h2>
                        {loading ? (
                            <p className="text-center">Loading orders...</p>
                        ) : orders.length === 0 ? (
                            <div className="empty-orders">
                                <p>You haven't made any purchases yet.</p>
                                <button className="btn btn-primary" onClick={() => navigate('/shop')}>
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="orders-list">
                                {orders.map(order => (
                                    <div key={order._id} className="order-card">
                                        <div className="order-header">
                                            <div>
                                                <h4>Order #{order._id.slice(-6).toUpperCase()}</h4>
                                                <p className="order-date">{formatDate(order.createdAt)}</p>
                                            </div>
                                            <div className="order-status">
                                                <span className={`status-badge ${order.status || 'pending'}`}>
                                                    {order.status || 'Pending'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="order-body">
                                            <div className="order-items">
                                                {order.orderItems && order.orderItems.slice(0, 3).map((item, idx) => (
                                                    <div key={idx} className="order-item-preview">
                                                        <img src={item.image} alt={item.name} />
                                                        <span>{item.name}</span>
                                                    </div>
                                                ))}
                                                {order.orderItems && order.orderItems.length > 3 && (
                                                    <span className="more-items">+{order.orderItems.length - 3} more</span>
                                                )}
                                            </div>
                                            <div className="order-total">
                                                <strong>৳{order.totalPrice}</strong>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
