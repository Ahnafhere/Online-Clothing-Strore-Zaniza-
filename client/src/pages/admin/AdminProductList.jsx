import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus } from 'lucide-react';
import { productAPI } from '../../utils/api';
import './AdminProducts.css';

const AdminProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        productAPI.getAll()
            .then(data => setProducts(data))
            .catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            productAPI.delete(id)
                .then(() => {
                    setProducts(products.filter(p => p._id !== id));
                })
                .catch(err => console.error(err));
        }
    };

    return (
        <div className="admin-products">
            <div className="admin-header flex justify-between items-center mb-4">
                <h1>Products</h1>
                <Link to="/admin/products/new" className="btn btn-primary flex items-center gap-4">
                    <Plus size={18} /> Add Product
                </Link>
            </div>

            <div className="product-table-container">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td>
                                    <img src={product.image} alt={product.name} className="table-img" />
                                </td>
                                <td>{product.name}</td>
                                <td>
                                    <span className="badge">{product.category}</span>
                                </td>
                                <td>৳{product.price}</td>
                                <td>
                                    <div className="actions">
                                        <Link to={`/admin/products/edit/${product._id}`} className="action-btn edit">
                                            <Edit size={18} />
                                        </Link>
                                        <button onClick={() => handleDelete(product._id)} className="action-btn delete">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProductList;
