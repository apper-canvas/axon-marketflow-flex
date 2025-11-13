import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { formatPrice } from "@/utils/formatters";
import { addToCart } from "@/store/slices/cartSlice";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const ProductCard = ({ 
  product, 
  className,
  onProductClick 
}) => {
  const dispatch = useDispatch();
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success("Added to cart!");
  };
  
  const isLowStock = product.stock <= 10;
  const isOutOfStock = product.stock === 0;
  
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300",
        isOutOfStock && "opacity-75",
        className
      )}
      onClick={() => onProductClick?.(product)}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Stock badges */}
        <div className="absolute top-3 left-3 space-y-1">
          {isOutOfStock && (
            <Badge variant="error">Out of Stock</Badge>
          )}
          {isLowStock && !isOutOfStock && (
            <Badge variant="warning">Low Stock</Badge>
          )}
        </div>
        
        {/* Quick view button */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
            <ApperIcon name="Eye" className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xl font-bold text-primary">
              {formatPrice(product.price)}
            </div>
            <div className="text-xs text-gray-500">
              {product.stock} in stock
            </div>
          </div>
          
          <Button
            variant="accent"
            size="sm"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="ShoppingCart" className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{product.category}</span>
            <div className="flex items-center">
              <ApperIcon name="Star" className="w-3 h-3 text-yellow-400 mr-1" />
              <span>4.5</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;