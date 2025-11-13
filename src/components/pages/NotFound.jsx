import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8 max-w-md"
      >
        {/* 404 Illustration */}
        <div className="space-y-4">
          <div className="relative">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
              <ApperIcon name="Search" className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-accent to-orange-500 rounded-full flex items-center justify-center">
              <ApperIcon name="X" className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-800">404</h1>
        </div>
        
        {/* Error Message */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">
            Page Not Found
          </h2>
          <p className="text-gray-600">
            Sorry, we couldn't find the page you're looking for. The link might be broken or the page may have been moved.
          </p>
        </div>
        
        {/* Navigation Links */}
        <div className="space-y-4">
          <Link to="/">
            <Button className="w-full">
              <ApperIcon name="Home" className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </Link>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Link to="/categories" className="flex-1">
              <Button variant="outline" className="w-full">
                <ApperIcon name="Grid3X3" className="w-4 h-4 mr-2" />
                Browse Categories
              </Button>
            </Link>
            <Link to="/orders" className="flex-1">
              <Button variant="outline" className="w-full">
                <ApperIcon name="Package" className="w-4 h-4 mr-2" />
                My Orders
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Help Section */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Need help? Try searching for what you need:
          </p>
          <div className="flex space-x-2 text-sm">
            <Link to="/?search=electronics" className="text-primary hover:text-primary/80">
              Electronics
            </Link>
            <span className="text-gray-400">•</span>
            <Link to="/?search=clothing" className="text-primary hover:text-primary/80">
              Clothing
            </Link>
            <span className="text-gray-400">•</span>
            <Link to="/?search=books" className="text-primary hover:text-primary/80">
              Books
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;