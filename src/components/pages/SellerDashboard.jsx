import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { formatPrice, formatDate } from "@/utils/formatters";
import { productService } from "@/services/api/productService";
import { categoryService } from "@/services/api/categoryService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
stock: "",
    images: ["https://via.placeholder.com/400x300?text=Product+Image"]
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [productData, categoryData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll()
      ]);
      
      // Filter products for current seller (mock seller ID)
      const sellerProducts = productData.filter(product => product.sellerId === "seller-1");
      setProducts(sellerProducts);
      setCategories(categoryData);
    } catch (err) {
      setError("Failed to load seller data. Please try again.");
      console.error("Error loading seller data:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      category: "",
      stock: "",
images: ["https://via.placeholder.com/400x300?text=Product+Image"]
    });
    setFormErrors({});
    setEditingProduct(null);
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      errors.price = "Please enter a valid price";
    }
    if (!formData.category) errors.category = "Please select a category";
    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      errors.stock = "Please enter a valid stock quantity";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitLoading(true);
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        sellerId: "seller-1" // Mock seller ID
};
      
      if (editingProduct) {
        await productService.update(editingProduct.Id, productData);
        toast.success("Product updated successfully!");
      } else {
        await productService.create(productData);
        toast.success("Product created successfully!");
      }
      
      resetForm();
      setShowAddForm(false);
      loadData();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };
  
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
images: product.images
    });
    setShowAddForm(true);
  };
  
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await productService.delete(productId);
      toast.success("Product deleted successfully!");
      loadData();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product. Please try again.");
    }
  };
  
  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    return (
      <ErrorView
        title="Failed to load seller dashboard"
        message={error}
        onRetry={loadData}
      />
    );
  }
  
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const lowStockProducts = products.filter(product => product.stock <= 10).length;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Seller Dashboard</h1>
            <p className="text-gray-600">Manage your products and track your sales</p>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            variant="accent"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </motion.div>
      
      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="bg-gradient-to-br from-primary to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Products</p>
              <p className="text-3xl font-bold">{totalProducts}</p>
            </div>
            <ApperIcon name="Package" className="w-10 h-10 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Inventory Value</p>
              <p className="text-3xl font-bold">{formatPrice(totalValue)}</p>
            </div>
            <ApperIcon name="DollarSign" className="w-10 h-10 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100">Low Stock Items</p>
              <p className="text-3xl font-bold">{lowStockProducts}</p>
            </div>
            <ApperIcon name="AlertTriangle" className="w-10 h-10 text-amber-200" />
          </div>
        </div>
      </motion.div>
      
      {/* Add/Edit Product Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <button
              onClick={() => {
                resetForm();
                setShowAddForm(false);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Product Title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                error={formErrors.title}
              />
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="flex h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.filter(cat => !cat.parentId).map(category => (
                    <option key={category.Id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <p className="text-sm text-red-600">{formErrors.category}</p>
                )}
              </div>
              
              <Input
                label="Price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                error={formErrors.price}
              />
              
              <Input
                label="Stock Quantity"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                error={formErrors.stock}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Product Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="flex w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-transparent resize-none"
                placeholder="Describe your product..."
              />
              {formErrors.description && (
                <p className="text-sm text-red-600">{formErrors.description}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  resetForm();
                  setShowAddForm(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitLoading}
                variant="accent"
              >
                {submitLoading ? (
                  <>
                    <ApperIcon name="Loader" className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                    {editingProduct ? "Update Product" : "Add Product"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      )}
      
      {/* Products List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Products</h2>
        
        {products.length === 0 ? (
          <Empty
            icon="Package"
            title="No products yet"
            message="Start selling by adding your first product!"
            actionText="Add Product"
            onAction={() => setShowAddForm(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{product.title}</h3>
                    {product.stock <= 10 && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                        Low Stock
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
<div>
                      <div className="text-lg font-bold text-primary">
                        {formatPrice(product.price)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {product.stock} in stock
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {product.category}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="flex-1"
                    >
                      <ApperIcon name="Edit2" className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(product.Id)}
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                    Added {formatDate(product.createdAt)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SellerDashboard;