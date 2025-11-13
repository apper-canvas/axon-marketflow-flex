import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { formatPrice } from "@/utils/formatters";
import { closeCart, clearCart } from "@/store/slices/cartSlice";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import CartItem from "@/components/molecules/CartItem";
import Empty from "@/components/ui/Empty";

const CartSidebar = ({ className }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems, isOpen } = useSelector(state => state.cart);
  
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  
  const handleCheckout = () => {
    dispatch(closeCart());
    navigate("/checkout");
  };
  
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  
  const handleContinueShopping = () => {
    dispatch(closeCart());
    navigate("/");
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => dispatch(closeCart())}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl",
              className
            )}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-blue-50">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Shopping Cart</h2>
                  <p className="text-sm text-gray-600">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </p>
                </div>
                <button
                  onClick={() => dispatch(closeCart())}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {cartItems.length === 0 ? (
                  <Empty
                    icon="ShoppingCart"
                    title="Your cart is empty"
                    message="Add some products to get started!"
                    actionText="Start Shopping"
                    onAction={handleContinueShopping}
                    className="h-full"
                  />
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <CartItem key={item.productId} item={item} />
                    ))}
                    
                    {/* Clear Cart Button */}
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={handleClearCart}
                        className="text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        Clear all items
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="border-t border-gray-200 p-6 bg-gradient-to-r from-gray-50 to-gray-100">
                  <div className="space-y-4">
                    {/* Total */}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-gray-800">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(total)}
                      </span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button
                        onClick={handleCheckout}
                        className="w-full py-4 text-lg font-semibold"
                        variant="accent"
                      >
                        <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
                        Proceed to Checkout
                      </Button>
                      
                      <Button
                        onClick={handleContinueShopping}
                        variant="ghost"
                        className="w-full"
                      >
                        Continue Shopping
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;