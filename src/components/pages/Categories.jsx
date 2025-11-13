import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { categoryService } from "@/services/api/categoryService";
import { productService } from "@/services/api/productService";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import ApperIcon from "@/components/ApperIcon";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [categoryData, productData] = await Promise.all([
        categoryService.getAll(),
        productService.getAll()
      ]);
      
      // Count products per category
      const counts = {};
      productData.forEach(product => {
        counts[product.category] = (counts[product.category] || 0) + 1;
      });
      
      setCategories(categoryData);
      setProductCounts(counts);
    } catch (err) {
      setError("Failed to load categories. Please try again.");
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
const handleCategoryClick = (categoryName) => {
    navigate(`/?categories=${encodeURIComponent(categoryName)}`);
  };
  
  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    return (
      <ErrorView
        title="Failed to load categories"
        message={error}
        onRetry={loadData}
      />
    );
  }
  
  const rootCategories = categories.filter(cat => !cat.parentId);
  
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Electronics': 'Laptop',
      'Clothing': 'Shirt',
      'Home & Garden': 'Home',
      'Books': 'Book',
      'Sports': 'Dumbbell',
      'Health': 'Heart',
      'Toys': 'Gamepad2',
      'Automotive': 'Car',
      'Food': 'UtensilsCrossed',
      'Beauty': 'Sparkles'
    };
    return iconMap[categoryName] || 'Tag';
  };
  
  const getCategoryGradient = (index) => {
    const gradients = [
      "from-blue-500 to-purple-600",
      "from-green-500 to-teal-600", 
      "from-orange-500 to-red-600",
      "from-purple-500 to-pink-600",
      "from-teal-500 to-blue-600",
      "from-red-500 to-orange-600",
      "from-indigo-500 to-purple-600",
      "from-yellow-500 to-orange-600",
      "from-pink-500 to-rose-600",
      "from-cyan-500 to-blue-600"
    ];
    return gradients[index % gradients.length];
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Browse Categories
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover products organized by categories to find exactly what you need
        </p>
      </motion.div>
      
      {/* Categories Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {rootCategories.map((category, index) => {
          const childCategories = categories.filter(cat => cat.parentId === category.Id);
          const totalProducts = productCounts[category.name] || 0;
          
          return (
            <motion.div
              key={category.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300"
              onClick={() => handleCategoryClick(category.name)}
            >
              {/* Category Header */}
              <div className={`h-32 bg-gradient-to-br ${getCategoryGradient(index)} p-6 flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <ApperIcon 
                  name={getCategoryIcon(category.name)} 
                  className="w-12 h-12 text-white relative z-10" 
                />
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full"></div>
              </div>
              
              {/* Category Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4">
                  {totalProducts} {totalProducts === 1 ? "product" : "products"} available
                </p>
                
                {/* Subcategories */}
                {childCategories.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Subcategories
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {childCategories.slice(0, 3).map(child => (
                        <span
                          key={child.Id}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {child.name}
                        </span>
                      ))}
                      {childCategories.length > 3 && (
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                          +{childCategories.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Hover Arrow */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ApperIcon name="ArrowRight" className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      
      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center py-16"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Can't find what you're looking for?
        </h2>
        <p className="text-gray-600 mb-8">
          Use our search to find specific products or browse all items
        </p>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:from-primary/90 hover:to-blue-600/90 transition-all duration-200 transform hover:scale-105 font-medium shadow-lg"
          >
            Browse All Products
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Categories;