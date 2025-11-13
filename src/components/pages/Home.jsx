import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { categoryService } from "@/services/api/categoryService";
import ProductGrid from "@/components/organisms/ProductGrid";
import CategoryFilter from "@/components/molecules/CategoryFilter";
import SearchBar from "@/components/molecules/SearchBar";
import ProductDetailModal from "@/components/organisms/ProductDetailModal";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Home = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  
  const searchQuery = searchParams.get("search") || "";
  
  const filters = {
    search: searchQuery,
    categories: selectedCategories,
    sortBy
  };
  
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await categoryService.getAll();
        setCategories(categoryData);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    
    loadCategories();
  }, []);
  
  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/");
    }
  };
  
  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };
  
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name", label: "Name A-Z" }
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
          Discover Amazing Products
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Shop from thousands of sellers and find exactly what you're looking for
        </p>
        
        {/* Hero Search */}
        <div className="max-w-2xl mx-auto">
          <SearchBar
            onSearch={handleSearch}
            defaultValue={searchQuery}
            placeholder="Search for products, brands, categories..."
            className="shadow-lg"
          />
        </div>
      </motion.div>
      
      {/* Filters and Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Filter Toggle and Sort */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
              Filters
              {selectedCategories.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-primary text-white rounded-full text-xs">
                  {selectedCategories.length}
                </span>
              )}
            </Button>
            
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Active Filters */}
          {(searchQuery || selectedCategories.length > 0) && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchQuery && (
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                  Search: {searchQuery}
                </span>
              )}
              {selectedCategories.length > 0 && (
                <span className="px-2 py-1 bg-accent/10 text-accent rounded-full text-xs">
                  {selectedCategories.length} categories
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={cn(
            "lg:w-80 flex-shrink-0",
            showFilters ? "block" : "hidden lg:block"
          )}
        >
          <div className="sticky top-24 space-y-6">
            <CategoryFilter
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryChange={setSelectedCategories}
            />
          </div>
        </motion.div>
        
        {/* Products */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex-1"
        >
          <ProductGrid
            filters={filters}
            onProductClick={handleProductClick}
          />
        </motion.div>
      </div>
      
      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default Home;