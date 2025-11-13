import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { toggleCart } from "@/store/slices/cartSlice";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";

const Header = ({ className }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/");
    }
    setIsMobileMenuOpen(false);
  };
  
  const handleCartClick = () => {
    dispatch(toggleCart());
  };
  
  const navigationItems = [
    { name: "Home", href: "/", icon: "Home" },
    { name: "Categories", href: "/categories", icon: "Grid3X3" },
    { name: "Orders", href: "/orders", icon: "Package" },
    { name: "Sell", href: "/seller", icon: "Store" }
  ];
  
  return (
    <header className={cn("sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="ShoppingBag" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              MarketFlow
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors duration-200 font-medium"
              >
                <ApperIcon name={item.icon} className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          
          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button - Mobile */}
            <button className="lg:hidden p-2 text-gray-600 hover:text-primary transition-colors">
              <ApperIcon name="Search" className="w-5 h-5" />
            </button>
            
            {/* Cart Button */}
            <button
              onClick={handleCartClick}
              className="relative p-2 text-gray-600 hover:text-primary transition-colors"
            >
              <ApperIcon name="ShoppingCart" className="w-6 h-6" />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-accent to-orange-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                >
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </motion.span>
              )}
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors"
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-lg"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <SearchBar onSearch={handleSearch} placeholder="Search products..." />
              
              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors duration-200"
                  >
                    <ApperIcon name={item.icon} className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;