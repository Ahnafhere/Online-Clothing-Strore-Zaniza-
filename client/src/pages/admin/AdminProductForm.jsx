import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productAPI } from '../../utils/api';
import './AdminProductForm.css';

const AdminProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        image: '',
        description: '',
        countInStock: 0,
        isFeatured: false
    });
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        if (isEdit) {
            productAPI.getById(id)
                .then(data => {
                    setFormData(data);
                    setImagePreview(data.image);
                })
                .catch(err => console.error(err));
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setFormData(prev => ({
                    ...prev,
                    image: base64String
                }));
                setImagePreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const submitPromise = isEdit
            ? productAPI.update(id, formData)
            : productAPI.create(formData);

        submitPromise
            .then(() => navigate('/admin/products'))
            .catch(err => {
                console.error(err);
                alert('Failed to save product. Please try again.');
            });
    };

    return (
        <div className="admin-product-form-page">
            <h1 className="mb-4">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                    <label>Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} required>
                        <option value="">Select Category</option>
                        <option value="Kameez">Kameez</option>
                        <option value="Saree">Saree</option>
                        <option value="Fabric">Fabric</option>
                        <option value="Co-ord Set">Co-ord Set</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Stock Status</label>
                    <select
                        name="countInStock"
                        value={formData.countInStock > 0 ? '100' : '0'}
                        onChange={(e) => setFormData(prev => ({ ...prev, countInStock: parseInt(e.target.value) }))}
                        required
                    >
                        <option value="100">In Stock</option>
                        <option value="0">Out of Stock</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Price (৳)</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Product Image</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        required={!isEdit}
                    />
                    {imagePreview && (
                        <div className="image-preview">
                            <img src={imagePreview} alt="Preview" />
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                    ></textarea>
                </div>

                <div className="form-group checkbox">
                    <label>
                        <input
                            type="checkbox"
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleChange}
                        />
                        Mark as Featured Product
                    </label>
                </div>

                <button type="submit" className="btn btn-primary">
                    {isEdit ? 'Update Product' : 'Create Product'}
                </button>
            </form>
        </div>
    );
};

export default AdminProductForm;
