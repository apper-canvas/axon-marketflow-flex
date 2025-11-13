import { useDispatch } from "react-redux";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { addToCart } from "@/store/slices/cartSlice";
import { cn } from "@/utils/cn";
import { formatPrice } from "@/utils/formatters";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const ProductDetailModal = ({ 
  product, 
  isOpen, 
  onClose 
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  if (!product) return null;
  
  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`);
    onClose();
  };
  
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };
  
  const isLowStock = product.stock <= 10;
  const isOutOfStock = product.stock === 0;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
                {/* Image Section */}
                <div className="lg:w-1/2 bg-gray-50">
                  <div className="relative h-64 lg:h-full min-h-[400px]">
                    <img
                      src={product.images[selectedImageIndex]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Image Navigation */}
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                          disabled={selectedImageIndex === 0}
                        >
                          <ApperIcon name="ChevronLeft" className="w-5 h-5" />
                        </button>
                        
                        <button
                          onClick={() => setSelectedImageIndex(Math.min(product.images.length - 1, selectedImageIndex + 1))}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                          disabled={selectedImageIndex === product.images.length - 1}
                        >
                          <ApperIcon name="ChevronRight" className="w-5 h-5" />
                        </button>
                        
                        {/* Image Dots */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {product.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImageIndex(index)}
                              className={cn(
                                "w-2 h-2 rounded-full transition-colors",
                                selectedImageIndex === index ? "bg-white" : "bg-white/50"
                              )}
                            />
                          ))}
                        </div>
                      </>
                    )}
                    
                    {/* Close Button */}
                    <button
                      onClick={onClose}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ApperIcon name="X" className="w-5 h-5" />
                    </button>
                    
                    {/* Stock Badges */}
                    <div className="absolute top-4 left-4 space-y-2">
                      {isOutOfStock && (
                        <Badge variant="error">Out of Stock</Badge>
                      )}
                      {isLowStock && !isOutOfStock && (
                        <Badge variant="warning">Low Stock</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Details Section */}
                <div className="lg:w-1/2 flex flex-col">
                  <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    {/* Product Info */}
                    <div className="space-y-6">
                      <div>
                        <span className="text-sm text-primary font-medium">{product.category}</span>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mt-1">
                          {product.title}
                        </h1>
                      </div>
                      
                      {/* Price */}
                      <div className="space-y-2">
                        <div className="text-3xl lg:text-4xl font-bold text-primary">
                          {formatPrice(product.price)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
<span>{product.stock} in stock</span>
                          <div className="flex items-center cursor-pointer" onClick={() => navigate('/reviews')}>
                            <ApperIcon name="Star" className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="hover:text-primary transition-colors">View Reviews</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                        <p className="text-gray-600 leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                      
                      {/* Features */}
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Features</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <ApperIcon name="Shield" className="w-4 h-4 text-green-500" />
                            <span>1 Year Warranty</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <ApperIcon name="Truck" className="w-4 h-4 text-blue-500" />
                            <span>Free Shipping</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <ApperIcon name="RotateCcw" className="w-4 h-4 text-orange-500" />
                            <span>30-Day Returns</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <ApperIcon name="Award" className="w-4 h-4 text-purple-500" />
                            <span>Premium Quality</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Section */}
                  <div className="border-t border-gray-200 p-6 lg:p-8 bg-gray-50">
                    <div className="space-y-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-700">Quantity:</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 1}
                            className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                          >
                            <ApperIcon name="Minus" className="w-4 h-4" />
                          </button>
                          
                          <span className="w-12 text-center font-medium">{quantity}</span>
                          
                          <button
                            onClick={() => handleQuantityChange(quantity + 1)}
                            disabled={quantity >= product.stock}
                            className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                          >
                            <ApperIcon name="Plus" className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Total Price */}
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">Total:</span>
                        <span className="text-xl font-bold text-primary">
                          {formatPrice(product.price * quantity)}
                        </span>
                      </div>
                      
                      {/* Add to Cart Button */}
                      <Button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        variant="accent"
                        className="w-full py-4 text-lg font-semibold"
                      >
                        {isOutOfStock ? (
                          <>
                            <ApperIcon name="AlertCircle" className="w-5 h-5 mr-2" />
                            Out of Stock
                          </>
                        ) : (
                          <>
                            <ApperIcon name="ShoppingCart" className="w-5 h-5 mr-2" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                      
                      {/* Additional Info */}
                      <div className="text-center text-xs text-gray-500 space-y-1">
                        <p>Free shipping on orders over $100</p>
                        <p>Secure checkout with SSL encryption</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;