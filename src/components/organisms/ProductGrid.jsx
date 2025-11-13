import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { productService } from "@/services/api/productService";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const ProductGrid = ({ 
  className,
  filters = {},
  onProductClick,
  limit
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      
      let allProducts = await productService.getAll();
      
      // Apply filters
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        allProducts = allProducts.filter(product =>
          product.title.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
        );
      }
      
      if (filters.categories && filters.categories.length > 0) {
        allProducts = allProducts.filter(product =>
          filters.categories.includes(product.category)
        );
      }
      
      if (filters.minPrice) {
        allProducts = allProducts.filter(product => product.price >= filters.minPrice);
      }
      
      if (filters.maxPrice) {
        allProducts = allProducts.filter(product => product.price <= filters.maxPrice);
      }
      
      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case "price-low":
            allProducts.sort((a, b) => a.price - b.price);
            break;
          case "price-high":
            allProducts.sort((a, b) => b.price - a.price);
            break;
          case "name":
            allProducts.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case "newest":
            allProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
          default:
            break;
        }
      }
      
      // Apply limit
      if (limit) {
        allProducts = allProducts.slice(0, limit);
      }
      
      setProducts(allProducts);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadProducts();
  }, [filters, limit]);
  
  if (loading) {
    return <Loading variant="skeleton" className={className} />;
  }
  
  if (error) {
    return (
      <ErrorView
        title="Failed to load products"
        message={error}
        onRetry={loadProducts}
        className={className}
      />
    );
  }
  
  if (products.length === 0) {
    return (
      <Empty
        icon="Search"
        title="No products found"
        message={filters.search ? `No products match "${filters.search}"` : "No products available at the moment."}
        actionText="Browse All Products"
        onAction={() => window.location.href = "/"}
        className={className}
      />
    );
  }
  
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* View Controls and Results Count */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {products.length} {products.length === 1 ? "product" : "products"}
          {filters.search && <span> for "{filters.search}"</span>}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              viewMode === "grid" 
                ? "bg-primary text-white" 
                : "text-gray-600 hover:text-primary hover:bg-gray-100"
            )}
          >
            <ApperIcon name="Grid3X3" className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2 rounded-lg transition-colors",
              viewMode === "list" 
                ? "bg-primary text-white" 
                : "text-gray-600 hover:text-primary hover:bg-gray-100"
            )}
          >
            <ApperIcon name="List" className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Products Grid/List */}
      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        )}
      >
        {products.map((product) => (
          <motion.div key={product.Id} variants={itemVariants}>
            <ProductCard
              product={product}
              onProductClick={onProductClick}
              className={viewMode === "list" ? "flex-row" : ""}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProductGrid;