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
        images: [],
        description: '',
        countInStock: 0,
        isFeatured: false
    });
    const [imagePreviews, setImagePreviews] = useState([]);
    const [isUploading, setIsUploading] = useState(false); // New uploading state for Cloudinary

    useEffect(() => {
        if (isEdit) {
            productAPI.getById(id)
                .then(data => {
                    setFormData(data);
                    setImagePreviews(data.images || (data.image ? [data.image] : []));
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

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        const currentImagesCount = formData.images.length;
        const remainingSlots = 4 - currentImagesCount;

        if (files.length > remainingSlots) {
            alert(`You can only add ${remainingSlots} more image(s). Max 4 images allowed.`);
            return;
        }

        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                alert(`${file.name} is not an image file`);
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert(`${file.name} is too large. Max 5MB allowed.`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        setIsUploading(true);

        try {
            const uploadedUrls = await Promise.all(validFiles.map(async (file) => {
                const data = new FormData();
                data.append("file", file);
                data.append("upload_preset", "zaniza_uploads");
                data.append("cloud_name", "dhcfdebho");

                const res = await fetch("https://api.cloudinary.com/v1_1/dhcfdebho/image/upload", {
                    method: "POST",
                    body: data
                });
                const uploadedImage = await res.json();
                return uploadedImage.secure_url; // This gives you the secure Cloudinary URL!
            }));

            setFormData(prev => {
                const newImages = [...prev.images, ...uploadedUrls];
                return {
                    ...prev,
                    images: newImages,
                    image: newImages[0] || '' // Set first image as main image
                };
            });
            setImagePreviews(prev => [...prev, ...uploadedUrls]);
        } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            alert("Failed to upload images. Please try again.");
        } finally {
            setIsUploading(false);
            e.target.value = ''; // Reset file input
        }
    };

    const removeImage = (index) => {
        setFormData(prev => {
            const newImages = prev.images.filter((_, i) => i !== index);
            return {
                ...prev,
                images: newImages,
                image: newImages.length > 0 ? newImages[0] : ''
            };
        });
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
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
                    <label>Product Images (Max 4)</label>
                    <input
                        type="file"
                        name="images"
                        accept="image/*"
                        onChange={handleImageChange}
                        multiple
                        disabled={formData.images.length >= 4 || isUploading}
                    />
                    {isUploading && <p className="help-text" style={{color: 'blue'}}>Uploading images to Cloudinary... Please wait.</p>}
                    <p className="help-text">First image will be the main cover image.</p>

                    {imagePreviews.length > 0 && (
                        <div className="images-preview-grid">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="preview-item">
                                    <img src={preview} alt={`Preview ${index + 1}`} />
                                    <button
                                        type="button"
                                        className="remove-img-btn"
                                        onClick={() => removeImage(index)}
                                    >
                                        &times;
                                    </button>
                                    {index === 0 && <span className="main-badge">Cover</span>}
                                </div>
                            ))}
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

                <button type="submit" className="btn btn-primary" disabled={isUploading}>
                    {isUploading ? 'Uploading Images...' : (isEdit ? 'Update Product' : 'Create Product')}
                </button>
            </form>
        </div>
    );
};

export default AdminProductForm;
