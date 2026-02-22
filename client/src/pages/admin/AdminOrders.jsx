import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { X, User, MapPin, CreditCard, Box } from 'lucide-react';
import Loading from '../../components/Loading';
import './AdminOrders.css';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('pending');
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await adminAPI.getAllOrders();
                // Sort orders by creation date (newest first)
                const sortedOrders = data.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setOrders(sortedOrders);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch orders:', err);
                setLoading(false);
            }
        };

        fetchOrders();

        // Refresh badge immediately when admin opens this page
        window.dispatchEvent(new Event('refreshPendingCount'));
    }, []);

    // Also refresh badge when orders are updated
    useEffect(() => {
        window.dispatchEvent(new Event('refreshPendingCount'));
    }, [orders]);

    // Filter orders based on status
    useEffect(() => {
        if (filterStatus === 'all') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order => order.status === filterStatus));
        }
    }, [orders, filterStatus]);

    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
    };

    const closeView = () => {
        setSelectedOrder(null);
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await adminAPI.updateOrderStatus(orderId, newStatus);
            // Refresh orders list
            const data = await adminAPI.getAllOrders();
            // Sort orders by creation date (newest first)
            const sortedOrders = data.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setOrders(sortedOrders);
            setSelectedOrder(null);
        } catch (err) {
            console.error('Failed to update order status:', err);
            alert('Failed to update order status');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'pending';
            case 'delivered': return 'delivered';
            case 'cancelled': return 'cancelled';
            default: return 'pending';
        }
    };

    if (loading) return <Loading message="Fetching orders..." />;

    return (
        <div className="admin-orders">
            <div className="orders-header">
                <h1>Orders Management</h1>
                <div className="order-stats">
                    <span className="stat-badge">
                        <strong>{orders.filter(o => o.status === 'pending').length}</strong> Pending
                    </span>
                    <span className="stat-badge delivered">
                        <strong>{orders.filter(o => o.status === 'delivered').length}</strong> Delivered
                    </span>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                <button
                    className={`filter-tab ${filterStatus === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('pending')}
                >
                    Pending Orders
                </button>
                <button
                    className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('all')}
                >
                    All Orders
                </button>
                <button
                    className={`filter-tab ${filterStatus === 'delivered' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('delivered')}
                >
                    Delivered
                </button>
                <button
                    className={`filter-tab ${filterStatus === 'cancelled' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('cancelled')}
                >
                    Cancelled
                </button>
            </div>

            <div className="order-table-container mt-4">
                <table className="order-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="text-center">Loading...</td></tr>
                        ) : filteredOrders.length === 0 ? (
                            <tr><td colSpan="6" className="text-center">No {filterStatus !== 'all' ? filterStatus : ''} orders found.</td></tr>
                        ) : (
                            filteredOrders.map(order => (
                                <tr key={order._id}>
                                    <td>#{order._id.substring(order._id.length - 6).toUpperCase()}</td>
                                    <td>{order.user?.name || order.guestInfo?.name || 'Guest'}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>৳{order.totalPrice}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusColor(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-sm" onClick={() => handleViewOrder(order)}>View Details</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={closeView}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Order Details</h2>
                            <button className="close-btn" onClick={closeView}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-grid">
                            {/* Customer & Shipping Info */}
                            <div className="info-group">
                                <h3><User size={20} /> Customer Information</h3>
                                <div className="info-row">
                                    <strong>Name:</strong> {selectedOrder.user?.name || selectedOrder.guestInfo?.name || 'N/A'}
                                </div>
                                <div className="info-row">
                                    <strong>Email:</strong> {selectedOrder.user?.email || selectedOrder.guestInfo?.email || 'N/A'}
                                </div>
                                <div className="info-row">
                                    <strong>Phone:</strong> {selectedOrder.guestInfo?.phone || selectedOrder.user?.phone || 'N/A'}
                                </div>
                                <div className="info-row">
                                    <strong>Type:</strong> <span className={`badge ${selectedOrder.user ? 'registered' : 'guest'}`}>{selectedOrder.user ? 'Registered User' : 'Guest'}</span>
                                </div>
                                <hr className="my-3 border-gray-200" />
                                <h3><MapPin size={20} /> Shipping Address</h3>
                                <div className="info-row">
                                    <strong>Address:</strong> {selectedOrder.shippingAddress?.address}
                                </div>
                                <div className="info-row">
                                    <strong>City:</strong> {selectedOrder.shippingAddress?.city}
                                </div>
                                <div className="info-row">
                                    <strong>Postal Code:</strong> {selectedOrder.shippingAddress?.postalCode}
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="info-group">
                                <h3><CreditCard size={20} /> Payment Details</h3>
                                <div className="info-row">
                                    <strong>Method:</strong> {selectedOrder.paymentMethod}
                                </div>
                                <div className="info-row">
                                    <strong>Status:</strong> {selectedOrder.isPaid ? 'Paid' : 'Unpaid'}
                                </div>
                                <div className="info-row">
                                    <strong>Total Amount:</strong> ৳{selectedOrder.totalPrice}
                                </div>

                                {(selectedOrder.paymentMethod === 'Bkash' || selectedOrder.paymentMethod === 'Nagad') && (
                                    <div className="payment-highlight">
                                        <div className="info-row">
                                            <strong>Sender Number:</strong> {selectedOrder.paymentDetails?.phoneNumber}
                                        </div>
                                        <div className="info-row">
                                            <strong>Transaction ID:</strong> {selectedOrder.paymentDetails?.transactionId}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="info-group w-full">
                            <h3><Box size={20} /> Order Items</h3>
                            <table className="order-items-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.orderItems?.map((item, index) => (
                                        <tr key={index}>
                                            <td className="item-name-cell">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="item-thumb"
                                                    onError={(e) => e.target.src = 'https://via.placeholder.com/40x40?text=Product'}
                                                />
                                                {item.name}
                                            </td>
                                            <td>{item.qty}</td>
                                            <td>৳{item.price}</td>
                                            <td>৳{item.qty * item.price}</td>
                                        </tr>
                                    ))}
                                    {(!selectedOrder.orderItems || selectedOrder.orderItems.length === 0) && (
                                        <tr>
                                            <td colSpan="4" className="text-center text-gray-500 py-4">No items found in this order</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Action Buttons */}
                        {selectedOrder.status === 'pending' && (
                            <div className="order-actions">
                                <button
                                    className="btn btn-success"
                                    onClick={() => handleStatusUpdate(selectedOrder._id, 'delivered')}
                                >
                                    Mark as Delivered
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleStatusUpdate(selectedOrder._id, 'cancelled')}
                                >
                                    Cancel Order
                                </button>
                            </div>
                        )}

                        {selectedOrder.status !== 'pending' && (
                            <div className="status-info">
                                <p className={`status-message ${selectedOrder.status}`}>
                                    {selectedOrder.status === 'delivered' ? '✓ This order has been delivered' : '✗ This order was cancelled'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
